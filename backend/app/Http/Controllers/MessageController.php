<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    use ApiResponse;

    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get the latest message for each conversation
        // This is a complex SQL query, so we'll use a simpler approach for Laravel
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver', 'jobPost'])
            ->orderBy('created_at', 'desc')
            ->get();

        $conversations = [];
        $seenPairs = [];

        foreach ($messages as $message) {
            $otherUserId = $message->sender_id === $userId ? $message->receiver_id : $message->sender_id;
            
            // Create a unique key for the pair
            $pairKey = min($userId, $otherUserId) . '_' . max($userId, $otherUserId);
            
            // If we want to separate by job_id as well
            if ($message->job_id) {
                $pairKey .= '_' . $message->job_id;
            }

            if (!isset($seenPairs[$pairKey])) {
                $seenPairs[$pairKey] = true;
                
                $otherUser = $message->sender_id === $userId ? $message->receiver : $message->sender;
                $otherName = $otherUser->name;
                $role = 'User';
                $contact = '';

                if ($otherUser->role === 'company' && $otherUser->companyProfile) {
                    $otherName = $otherUser->companyProfile->company_name;
                    $role = 'Company';
                } elseif ($otherUser->role === 'job_seeker' && $otherUser->jobSeekerProfile) {
                    $role = 'Candidate';
                    $contactData = json_decode($otherUser->jobSeekerProfile->contact_information, true);
                    $contact = $contactData['title'] ?? '';
                    $otherName = $contactData['firstName'] ?? $otherUser->name;
                    if (isset($contactData['lastName'])) $otherName .= ' ' . $contactData['lastName'];
                }

                $conversations[] = [
                    'id' => 'conv-' . $pairKey,
                    'other_user_id' => $otherUserId,
                    'application_id' => $message->job_id && $otherUser->jobSeekerProfile ? \App\Models\Application::where('job_id', $message->job_id)->where('job_seeker_id', $otherUser->jobSeekerProfile->id)->value('id') : null,
                    'company' => $otherUser->role === 'company' ? $otherName : ($message->jobPost->companyProfile->company_name ?? 'Company'),
                    'candidate' => $otherUser->role === 'job_seeker' ? $otherName : $request->user()->name,
                    'contact' => $otherName,
                    'role' => $message->jobPost ? $message->jobPost->title : $contact,
                    'job_id' => $message->job_id,
                    'last_message' => $message->content,
                    'time' => $message->created_at->diffForHumans(),
                    'unread' => $message->receiver_id === $userId && !$message->read_at,
                    'status' => 'Active', // Mock status
                ];
            }
        }

        return $this->success($conversations);
    }

    public function show(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;
        $jobId = $request->query('job_id');

        $query = Message::where(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $userId)->where('receiver_id', $otherUserId)
              ->orWhere('sender_id', $otherUserId)->where('receiver_id', $userId);
        });

        if ($jobId) {
            $query->where('job_id', $jobId);
        }

        $messages = $query->with(['sender.companyProfile'])->orderBy('created_at', 'asc')->get();

        $formatted = $messages->map(function ($msg) use ($userId) {
            $senderName = $msg->sender_id === $userId
                ? 'You'
                : ($msg->sender->role === 'company' && $msg->sender->companyProfile
                    ? $msg->sender->companyProfile->company_name
                    : $msg->sender->name);

            return [
                'id' => $msg->id,
                'from' => $senderName,
                'text' => $msg->content,
                'created_at' => $msg->created_at,
            ];
        });

        return $this->success($formatted);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'job_id' => 'nullable|exists:job_posts,id',
            'metadata' => 'sometimes|array',
            'metadata.interview_at' => 'sometimes|date',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'job_id' => $request->job_id,
            'content' => $request->content,
        ]);

        $message->loadMissing('jobPost.companyProfile');

        $sender = $request->user()->loadMissing('companyProfile');
        $senderName = $sender->role === 'company' && $sender->companyProfile
            ? $sender->companyProfile->company_name
            : $sender->name;
        $jobTitle = $message->jobPost?->title;
        $messagePreview = Str::limit($request->content, 160);
        $interviewAt = $request->input('metadata.interview_at');
        $looksLikeInterviewSchedule = Str::contains(Str::lower($request->content), 'interview scheduled');
        $isInterviewSchedule = filled($interviewAt) || $looksLikeInterviewSchedule;
        $formattedInterviewAt = $interviewAt ? Carbon::parse($interviewAt)->toDayDateTimeString() : null;
        $notificationData = [
            'title' => $isInterviewSchedule ? 'Interview scheduled with ' . $senderName : 'Message from ' . $senderName,
            'message' => $isInterviewSchedule
                ? ($formattedInterviewAt
                    ? trim(($jobTitle ? 'Interview for ' . $jobTitle . ' on ' : 'Interview on ') . $formattedInterviewAt . '.')
                    : $messagePreview)
                : $messagePreview,
            'message_preview' => $messagePreview,
            'sender_id' => $request->user()->id,
            'sender_name' => $senderName,
            'company_name' => $sender->companyProfile?->company_name,
            'job_id' => $request->job_id,
            'job_title' => $jobTitle,
            'message_id' => $message->id,
        ];

        if ($interviewAt) {
            $notificationData['interview_at'] = $interviewAt;
            $notificationData['formatted_interview_at'] = $formattedInterviewAt;
        }

        Notification::create([
            'user_id' => $request->receiver_id,
            'type' => $isInterviewSchedule ? 'interview_scheduled' : 'message_received',
            'data' => $notificationData,
            'created_at' => now(),
        ]);

        return $this->success($message, 'Message sent successfully.');
    }

    public function markRead(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;
        
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success(null, 'Messages marked as read.');
    }

    public function destroyConversation(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;
        $jobId = $request->query('job_id');

        $query = Message::where(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $userId)->where('receiver_id', $otherUserId)
                ->orWhere('sender_id', $otherUserId)->where('receiver_id', $userId);
        });

        if ($jobId) {
            $query->where('job_id', $jobId);
        }

        $query->delete();

        return $this->success(null, 'Conversation deleted.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobSeekerProfile;
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

        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with([
                'sender.companyProfile',
                'sender.jobSeekerProfile',
                'receiver.companyProfile',
                'receiver.jobSeekerProfile',
                'jobPost.companyProfile',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Pass 1: dedup conversations and collect application lookup keys.
        $rows = [];
        $seenPairs = [];
        $jobIds = [];
        $seekerIds = [];

        foreach ($messages as $message) {
            $otherUserId = $message->sender_id === $userId ? $message->receiver_id : $message->sender_id;
            $pairKey = min($userId, $otherUserId) . '_' . max($userId, $otherUserId);
            if ($message->job_id) {
                $pairKey .= '_' . $message->job_id;
            }

            if (isset($seenPairs[$pairKey])) {
                continue;
            }
            $seenPairs[$pairKey] = true;

            $otherUser = $message->sender_id === $userId ? $message->receiver : $message->sender;
            $seekerProfileId = $otherUser?->role === 'job_seeker' ? $otherUser->jobSeekerProfile?->id : null;

            if ($message->job_id && $seekerProfileId) {
                $jobIds[] = $message->job_id;
                $seekerIds[] = $seekerProfileId;
            }

            $rows[] = [
                'message' => $message,
                'otherUserId' => $otherUserId,
                'otherUser' => $otherUser,
                'seekerProfileId' => $seekerProfileId,
                'pairKey' => $pairKey,
            ];
        }

        // Single batch query for application IDs across all conversations.
        $applicationByKey = [];
        if (!empty($jobIds)) {
            $applicationByKey = Application::whereIn('job_id', array_unique($jobIds))
                ->whereIn('job_seeker_id', array_unique($seekerIds))
                ->get(['id', 'job_id', 'job_seeker_id'])
                ->mapWithKeys(fn ($a) => [$a->job_id . '_' . $a->job_seeker_id => $a->id])
                ->all();
        }

        // Pass 2: shape the response.
        $conversations = [];
        foreach ($rows as $row) {
            $message = $row['message'];
            $otherUser = $row['otherUser'];
            $otherName = $otherUser->name ?? '';
            $contact = '';

            if ($otherUser?->role === 'company' && $otherUser->companyProfile) {
                $otherName = $otherUser->companyProfile->company_name;
            } elseif ($otherUser?->role === 'job_seeker' && $otherUser->jobSeekerProfile) {
                $candidate = $this->candidateDisplayData($otherUser->jobSeekerProfile);
                $contact = $candidate['title'];
                $otherName = $candidate['name'] !== '' ? $candidate['name'] : ($otherUser->name ?? '');
            }

            $applicationId = null;
            if ($message->job_id && $row['seekerProfileId']) {
                $applicationId = $applicationByKey[$message->job_id . '_' . $row['seekerProfileId']] ?? null;
            }

            $conversations[] = [
                'id' => 'conv-' . $row['pairKey'],
                'other_user_id' => $row['otherUserId'],
                'application_id' => $applicationId,
                'company' => $otherUser?->role === 'company' ? $otherName : ($message->jobPost->companyProfile->company_name ?? 'Company'),
                'candidate' => $otherUser?->role === 'job_seeker' ? $otherName : $request->user()->name,
                'contact' => $otherName,
                'role' => $message->jobPost ? $message->jobPost->title : $contact,
                'job_id' => $message->job_id,
                'last_message' => $message->content,
                'time' => $message->created_at->diffForHumans(),
                'unread' => $message->receiver_id === $userId && !$message->read_at,
                'status' => 'Active', // Mock status
            ];
        }

        return $this->success($conversations);
    }

    /**
     * Whitelist only the candidate display fields needed for the conversation list.
     * Avoids leaking the full contact_information JSON (email, phone, etc.).
     */
    private function candidateDisplayData(JobSeekerProfile $profile): array
    {
        $raw = is_array($profile->contact_information)
            ? $profile->contact_information
            : json_decode((string) $profile->contact_information, true);
        $raw = is_array($raw) ? $raw : [];

        $title = is_string($raw['title'] ?? null) ? $raw['title'] : '';
        $first = is_string($raw['firstName'] ?? null) ? $raw['firstName'] : '';
        $last = is_string($raw['lastName'] ?? null) ? $raw['lastName'] : '';

        return [
            'title' => $title,
            'name' => trim($first . ' ' . $last),
        ];
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

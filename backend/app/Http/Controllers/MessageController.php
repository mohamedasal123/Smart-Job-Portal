<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $messages = $query->orderBy('created_at', 'asc')->get();

        $formatted = $messages->map(function ($msg) use ($userId) {
            return [
                'id' => $msg->id,
                'from' => $msg->sender_id === $userId ? 'You' : $msg->sender->name,
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
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'job_id' => $request->job_id,
            'content' => $request->content,
        ]);

        Notification::create([
            'user_id' => $request->receiver_id,
            'type' => 'message_received',
            'data' => [
                'title' => 'New message received',
                'message' => $request->user()->name . ' sent you a message.',
                'sender_id' => $request->user()->id,
                'job_id' => $request->job_id,
                'message_id' => $message->id,
            ],
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

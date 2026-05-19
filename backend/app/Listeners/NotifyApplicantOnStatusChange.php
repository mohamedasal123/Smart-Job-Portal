<?php

namespace App\Listeners;

use App\Events\ApplicationStatusChanged;
use App\Models\Notification;

class NotifyApplicantOnStatusChange
{
    public function handle(ApplicationStatusChanged $event): void
    {
        $application = $event->application;
        
        Notification::create([
            'user_id' => $application->jobSeekerProfile->user_id,
            'type' => 'application_status_updated',
            'data' => [
                'application_id' => $application->id,
                'job_title' => $application->jobPost->title,
                'new_status' => $application->status,
                'message' => "Your application for {$application->jobPost->title} has been updated to {$application->status}."
            ],
            'created_at' => now(),
        ]);
    }
}

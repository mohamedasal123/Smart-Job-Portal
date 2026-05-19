<?php

namespace App\Jobs;

use App\Models\Application;
use App\Mail\RejectionEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendRejectionEmailJob implements ShouldQueue
{
    use Queueable;
    
    public int $tries = 3;

    public function __construct(
        public Application $application
    ) {}

    public function handle(): void
    {
        Mail::to($this->application->jobSeekerProfile->user->email)
            ->send(new RejectionEmail($this->application));
    }
}

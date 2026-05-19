<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RejectionEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Update: ' . $this->application->jobPost->title,
        );
    }

    public function content(): Content
    {
        // For structured data, we would ideally pass this to a blade view
        $html = "<p>Dear {$this->application->jobSeekerProfile->user->name},</p>";
        $html .= "<p>Thank you for applying to the {$this->application->jobPost->title} position at {$this->application->jobPost->companyProfile->company_name}.</p>";
        $html .= "<p>Unfortunately, we have decided not to move forward with your application at this time.</p>";
        
        $missingSkills = $this->application->missing_skills_json;
        if (!empty($missingSkills)) {
            $html .= "<p>Based on our AI gap analysis, you may want to improve your skills in: " . implode(', ', $missingSkills) . ".</p>";
        }

        $html .= "<p>We wish you the best in your job search.</p>";

        return new Content(
            htmlString: $html,
        );
    }
}

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $token
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Email Address',
        );
    }

    public function content(): Content
    {
        $url = env('FRONTEND_URL', 'http://127.0.0.1:5173') . '/email-verification?token=' . $this->token;

        return new Content(
            htmlString: '<p>Please verify your email by clicking this link: <a href="' . $url . '">' . $url . '</a></p>',
        );
    }
}

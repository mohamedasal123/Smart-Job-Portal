<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $token,
        public string $email
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password Notification',
        );
    }

    public function content(): Content
    {
        $url = rtrim(env('FRONTEND_URL', config('app.url')), '/')
            . "/reset-password?token={$this->token}&email=" . urlencode($this->email);

        return new Content(
            htmlString: '<p>You are receiving this email because we received a password reset request for your account.</p>
                         <p>Click the link below to reset your password:</p>
                         <p><a href="'.$url.'">Reset Password</a></p>
                         <p>This password reset link will expire in 60 minutes.</p>
                         <p>If you did not request a password reset, no further action is required.</p>',
        );
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PurgeExpiredTokens extends Command
{
    protected $signature = 'tokens:purge';
    protected $description = 'Purge expired email verification and password reset tokens';

    public function handle()
    {
        $deletedVerification = DB::table('email_verification_tokens')
            ->where('expires_at', '<', now())
            ->delete();

        // Password reset default table doesn't have expires_at, usually handled by Laravel broker based on config duration.
        // But we can delete anything older than 2 hours.
        $deletedPassword = DB::table('password_reset_tokens')
            ->where('created_at', '<', now()->subHours(2))
            ->delete();

        $this->info("Purged {$deletedVerification} verification tokens and {$deletedPassword} password reset tokens.");
    }
}

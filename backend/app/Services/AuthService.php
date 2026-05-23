<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Mail\VerificationEmail;
use Illuminate\Support\Facades\Mail;

class AuthService
{
    public function registerUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);

            if ($data['role'] === 'job_seeker') {
                $user->jobSeekerProfile()->create([]);
            } elseif ($data['role'] === 'company') {
                $user->companyProfile()->create(['company_name' => $data['name']]);
            }

            $token = Str::random(64);
            DB::table('email_verification_tokens')->insert([
                'user_id' => $user->id,
                'token' => hash('sha256', $token),
                'expires_at' => now()->addHours(24),
                'created_at' => now(),
            ]);

            Mail::to($user->email)->send(new VerificationEmail($token));

            return $user;
        });
    }

    public function verifyEmail(string $tokenStr): bool
    {
        $tokenHash = hash('sha256', $tokenStr);
        $record = DB::table('email_verification_tokens')
            ->where('token', $tokenHash)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return false;
        }

        User::where('id', $record->user_id)->update(['email_verified_at' => now()]);
        DB::table('email_verification_tokens')->where('token', $tokenHash)->delete();

        return true;
    }

    public function resendVerificationEmail(string $email): bool
    {
        $user = User::where('email', $email)->whereNull('email_verified_at')->first();

        if (!$user) {
            return false;
        }

        DB::table('email_verification_tokens')->where('user_id', $user->id)->delete();

        $token = Str::random(64);
        DB::table('email_verification_tokens')->insert([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHours(24),
            'created_at' => now(),
        ]);

        Mail::to($user->email)->send(new VerificationEmail($token));

        return true;
    }
}

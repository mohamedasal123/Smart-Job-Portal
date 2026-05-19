<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $admin = $this->upsertUser([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => $password,
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_banned' => false,
        ]);
        $admin->jobSeekerProfile()->delete();
        $admin->companyProfile()->delete();

        $company = $this->upsertUser([
            'name' => 'Test Company',
            'email' => 'company@test.com',
            'password' => $password,
            'role' => 'company',
            'email_verified_at' => now(),
            'is_banned' => false,
        ]);
        $company->jobSeekerProfile()->delete();
        $company->companyProfile()->updateOrCreate(
            ['user_id' => $company->id],
            [
                'company_name' => 'Test Company',
                'description' => 'Default employer account for local testing.',
                'website' => 'https://company.test',
                'location' => 'Localhost',
            ]
        );

        $jobseeker = $this->upsertUser([
            'name' => 'Test Jobseeker',
            'email' => 'jobseeker@test.com',
            'password' => $password,
            'role' => 'job_seeker',
            'email_verified_at' => now(),
            'is_banned' => false,
        ]);
        $jobseeker->companyProfile()->delete();
        $jobseeker->jobSeekerProfile()->updateOrCreate(
            ['user_id' => $jobseeker->id],
            [
                'phone' => '+10000000000',
                'address' => 'Localhost',
                'years_of_experience' => 3,
                'education_level' => 'Bachelor',
                'cv_parse_status' => 'pending',
                'contact_information' => json_encode([
                    'title' => 'Test Jobseeker',
                    'bio' => 'Default jobseeker account for local testing.',
                    'email' => 'jobseeker@test.com',
                ]),
            ]
        );
    }

    private function upsertUser(array $attributes): User
    {
        $user = User::withTrashed()->updateOrCreate(
            ['email' => $attributes['email']],
            $attributes
        );

        if ($user->trashed()) {
            $user->restore();
        }

        return $user;
    }
}

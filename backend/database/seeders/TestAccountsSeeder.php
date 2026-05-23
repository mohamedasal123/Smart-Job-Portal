<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $password = 'password123';

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
        $this->seedDemoNotifications($admin, [
            [
                'type' => 'demo_platform',
                'title' => 'Demo environment ready',
                'message' => 'Admin dashboard, users, jobs, and activity views are ready for local testing.',
                'icon' => 'admin_panel_settings',
                'read' => false,
            ],
            [
                'type' => 'demo_security',
                'title' => 'Security check passed',
                'message' => 'Seeded accounts are verified and active.',
                'icon' => 'verified_user',
                'read' => true,
            ],
        ]);

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
        $this->seedDemoNotifications($company, [
            [
                'type' => 'demo_candidate',
                'title' => 'New candidate activity',
                'message' => 'Review recent applicants from the Smart ATS workspace.',
                'icon' => 'group',
                'read' => false,
            ],
            [
                'type' => 'demo_job',
                'title' => 'Company profile reminder',
                'message' => 'Keep your company profile complete so candidates trust your job posts.',
                'icon' => 'domain',
                'read' => true,
            ],
        ]);

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
        $this->seedDemoNotifications($jobseeker, [
            [
                'type' => 'demo_job_alert',
                'title' => 'Recommended jobs are ready',
                'message' => 'Upload your CV to unlock AI recommendations and one-click apply.',
                'icon' => 'auto_awesome',
                'read' => false,
            ],
            [
                'type' => 'demo_application_update',
                'title' => 'Track every application',
                'message' => 'Application status updates will appear here as companies review your profile.',
                'icon' => 'work_history',
                'read' => true,
            ],
        ]);

    }

    private function seedDemoNotifications(User $user, array $notifications): void
    {
        $user->notifications()->where('type', 'like', 'demo_%')->delete();

        foreach ($notifications as $index => $notification) {
            $user->notifications()->create([
                'type' => $notification['type'],
                'data' => [
                    'title' => $notification['title'],
                    'message' => $notification['message'],
                    'icon' => $notification['icon'],
                ],
                'read_at' => $notification['read'] ? now()->subMinutes(($index + 1) * 10) : null,
                'created_at' => now()->subMinutes(($index + 1) * 15),
            ]);
        }
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

<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\JobPost;
use App\Models\JobSeekerProfile;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Database\Seeders\SkillsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_data_seeder_creates_users_jobs_applications_and_messages(): void
    {
        $this->seed(SkillsSeeder::class);
        $this->seed(DemoDataSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        $this->assertSame(1, User::where('role', 'admin')->count());
        $this->assertSame(3, CompanyProfile::count());
        $this->assertSame(4, JobSeekerProfile::count());
        $this->assertSame(5, JobPost::count());
        $this->assertSame(5, Application::count());
        $this->assertGreaterThanOrEqual(7, Message::count());

        $this->assertDatabaseHas('notifications', [
            'type' => 'interview_scheduled',
        ]);
        $this->assertSame(2, Notification::where('type', 'interview_scheduled')->count());
    }
}

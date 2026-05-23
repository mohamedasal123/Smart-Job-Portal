<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\CompanyProfile;
use App\Models\CvParsedData;
use App\Models\JobPost;
use App\Models\JobRequiredSkill;
use App\Models\JobSeekerProfile;
use App\Models\JobSeekerSkill;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    private string $password = 'password123';

    public function run(): void
    {
        $admin = $this->seedAdmin();
        $this->clearExistingJobs();

        $companies = $this->seedCompanies();
        $seekers = $this->seedJobSeekers();
        $jobs = $this->seedJobs($companies);

        $this->seedApplications($admin, $companies, $seekers, $jobs);
        $this->seedMessages($companies, $seekers, $jobs);
        $this->seedSavedJobs($seekers, $jobs);
        $this->seedViews($seekers, $jobs);
        $this->seedNotifications($admin, $companies, $seekers, $jobs);
    }

    private function clearExistingJobs(): void
    {
        JobPost::withTrashed()->get()->each->forceDelete();
    }

    private function seedAdmin(): User
    {
        $admin = $this->upsertUser('admin@test.com', [
            'name' => 'Demo Admin',
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_banned' => false,
        ]);

        $admin->jobSeekerProfile()->delete();
        $admin->companyProfile()->delete();

        return $admin;
    }

    private function seedCompanies(): array
    {
        $data = [
            'company@test.com' => [
                'user' => ['name' => 'Nile Tech Labs'],
                'profile' => [
                    'company_name' => 'Nile Tech Labs',
                    'description' => 'Product studio building SaaS dashboards, hiring pipelines, and AI workflow tools.',
                    'website' => 'https://niletech.test',
                    'location' => 'Cairo, Egypt',
                    'phone' => '+201000000001',
                    'founded_year' => 2018,
                    'company_size' => '51-200',
                    'industry' => 'Software Development',
                ],
            ],
            'hr@deltafinance.test' => [
                'user' => ['name' => 'Delta Finance HR'],
                'profile' => [
                    'company_name' => 'Delta Finance',
                    'description' => 'Fintech company modernizing payroll, lending, and internal analytics for SMEs.',
                    'website' => 'https://deltafinance.test',
                    'location' => 'Alexandria, Egypt',
                    'phone' => '+201000000002',
                    'founded_year' => 2015,
                    'company_size' => '201-500',
                    'industry' => 'Fintech',
                ],
            ],
            'talent@remotehub.test' => [
                'user' => ['name' => 'RemoteHub Talent'],
                'profile' => [
                    'company_name' => 'RemoteHub',
                    'description' => 'Remote-first marketplace connecting engineering teams with vetted MENA talent.',
                    'website' => 'https://remotehub.test',
                    'location' => 'Remote',
                    'phone' => '+201000000003',
                    'founded_year' => 2021,
                    'company_size' => '11-50',
                    'industry' => 'Recruitment Technology',
                ],
            ],
        ];

        $companies = [];

        foreach ($data as $email => $item) {
            $user = $this->upsertUser($email, $item['user'] + [
                'role' => 'company',
                'email_verified_at' => now(),
                'is_banned' => false,
            ]);
            $user->jobSeekerProfile()->delete();

            $companies[$email] = $user->companyProfile()->updateOrCreate(
                ['user_id' => $user->id],
                $item['profile']
            );
        }

        return $companies;
    }

    private function seedJobSeekers(): array
    {
        $data = [
            'jobseeker@test.com' => [
                'user' => ['name' => 'Mona Ahmed'],
                'profile' => [
                    'phone' => '+201100000001',
                    'address' => 'Nasr City, Cairo',
                    'years_of_experience' => 3,
                    'education_level' => 'Bachelor of Computer Science',
                    'resume_file_url' => 'demo-resumes/mona-ahmed.pdf',
                    'cv_parse_status' => 'done',
                    'contact_information' => ['title' => 'Frontend Developer', 'bio' => 'React developer focused on dashboards and accessible UI.', 'linkedin' => 'https://linkedin.test/mona-ahmed'],
                ],
                'skills' => ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'REST API', 'Git', 'Communication'],
            ],
            'omar.backend@test.com' => [
                'user' => ['name' => 'Omar Hassan'],
                'profile' => [
                    'phone' => '+201100000002',
                    'address' => 'Smouha, Alexandria',
                    'years_of_experience' => 5,
                    'education_level' => 'Bachelor of Software Engineering',
                    'resume_file_url' => 'demo-resumes/omar-hassan.pdf',
                    'cv_parse_status' => 'done',
                    'contact_information' => ['title' => 'Backend Laravel Developer', 'bio' => 'Builds APIs, queues, and reporting services for fintech products.', 'github' => 'https://github.test/omar-hassan'],
                ],
                'skills' => ['PHP', 'Laravel', 'MySQL', 'Redis', 'Docker', 'REST API', 'TDD', 'Problem Solving'],
            ],
            'sara.data@test.com' => [
                'user' => ['name' => 'Sara Mahmoud'],
                'profile' => [
                    'phone' => '+201100000003',
                    'address' => 'Mansoura, Egypt',
                    'years_of_experience' => 2,
                    'education_level' => 'Bachelor of Statistics',
                    'resume_file_url' => 'demo-resumes/sara-mahmoud.pdf',
                    'cv_parse_status' => 'done',
                    'contact_information' => ['title' => 'Junior Data Analyst', 'bio' => 'Turns raw data into clean dashboards and actionable reports.'],
                ],
                'skills' => ['Python', 'MySQL', 'PostgreSQL', 'Communication', 'Presentation Skills', 'Attention to Detail'],
            ],
            'youssef.devops@test.com' => [
                'user' => ['name' => 'Youssef Ali'],
                'profile' => [
                    'phone' => '+201100000004',
                    'address' => 'Maadi, Cairo',
                    'years_of_experience' => 6,
                    'education_level' => 'Bachelor of Information Systems',
                    'resume_file_url' => 'demo-resumes/youssef-ali.pdf',
                    'cv_parse_status' => 'done',
                    'contact_information' => ['title' => 'DevOps Engineer', 'bio' => 'Automates deployments, monitoring, and cloud infrastructure.'],
                ],
                'skills' => ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Nginx', 'CI/CD', 'Git', 'Leadership'],
            ],
            'nour.intern@test.com' => [
                'user' => ['name' => 'Nour Khaled'],
                'profile' => [
                    'phone' => '+201100000005',
                    'address' => 'Giza, Egypt',
                    'years_of_experience' => 0,
                    'education_level' => 'Computer Science Student',
                    'resume_file_url' => 'demo-resumes/nour-khaled.pdf',
                    'cv_parse_status' => 'processing',
                    'contact_information' => ['title' => 'Software Engineering Intern', 'bio' => 'Learning full-stack development and looking for internship experience.'],
                ],
                'skills' => ['JavaScript', 'React', 'Git', 'Teamwork', 'Creativity'],
            ],
        ];

        $seekers = [];

        foreach ($data as $email => $item) {
            $user = $this->upsertUser($email, $item['user'] + [
                'role' => 'job_seeker',
                'email_verified_at' => now(),
                'is_banned' => false,
            ]);
            $user->companyProfile()->delete();

            $profileData = $item['profile'];
            $profileData['contact_information'] = json_encode($profileData['contact_information']);

            $profile = $user->jobSeekerProfile()->updateOrCreate(['user_id' => $user->id], $profileData);
            $this->syncSeekerSkills($profile, $item['skills']);
            $this->seedParsedCv($profile, $item['skills']);

            $seekers[$email] = $profile;
        }

        return $seekers;
    }

    private function seedJobs(array $companies): array
    {
        $data = [
            'senior-laravel-api-engineer' => [
                'company' => 'company@test.com',
                'title' => 'Senior Laravel API Engineer',
                'category' => 'Backend Development',
                'description' => 'Own Laravel APIs for hiring workflows, candidate matching, and employer analytics.',
                'responsibilities' => 'Design REST APIs, improve query performance, write tests, and mentor junior engineers.',
                'location' => 'Cairo, Egypt',
                'work_mode' => 'Hybrid',
                'job_type' => 'full_time',
                'salary_range' => 'EGP 35,000 - 55,000',
                'salary_min' => 35000,
                'salary_max' => 55000,
                'experience_level' => 'Senior',
                'education' => 'Bachelor preferred',
                'status' => 'active',
                'is_active' => true,
                'views' => 148,
                'skills' => ['PHP', 'Laravel', 'MySQL', 'Redis', 'Docker', 'REST API', 'TDD'],
            ],
            'react-dashboard-developer' => [
                'company' => 'company@test.com',
                'title' => 'React Dashboard Developer',
                'category' => 'Frontend Development',
                'description' => 'Build rich dashboards for recruiters to manage jobs, interviews, and applications.',
                'responsibilities' => 'Create responsive React screens, connect APIs, and keep UI states clean.',
                'location' => 'Cairo, Egypt',
                'work_mode' => 'On-site',
                'job_type' => 'full_time',
                'salary_range' => 'EGP 22,000 - 38,000',
                'salary_min' => 22000,
                'salary_max' => 38000,
                'experience_level' => 'Mid-level',
                'education' => 'Relevant degree or portfolio',
                'status' => 'active',
                'is_active' => true,
                'views' => 231,
                'skills' => ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'REST API', 'Git'],
            ],
            'fintech-qa-automation-engineer' => [
                'company' => 'hr@deltafinance.test',
                'title' => 'Fintech QA Automation Engineer',
                'category' => 'Quality Assurance',
                'description' => 'Protect critical payroll and lending workflows with automated API and regression tests.',
                'responsibilities' => 'Write test plans, automate regression suites, and report release risks clearly.',
                'location' => 'Alexandria, Egypt',
                'work_mode' => 'Hybrid',
                'job_type' => 'full_time',
                'salary_range' => 'EGP 18,000 - 30,000',
                'salary_min' => 18000,
                'salary_max' => 30000,
                'experience_level' => 'Mid-level',
                'education' => 'Bachelor preferred',
                'status' => 'active',
                'is_active' => true,
                'views' => 96,
                'skills' => ['TDD', 'REST API', 'MySQL', 'Problem Solving', 'Attention to Detail'],
            ],
            'remote-devops-engineer' => [
                'company' => 'talent@remotehub.test',
                'title' => 'Remote DevOps Engineer',
                'category' => 'DevOps',
                'description' => 'Support distributed teams with cloud infrastructure, CI/CD pipelines, and observability.',
                'responsibilities' => 'Maintain Kubernetes clusters, automate deploys, improve uptime, and document runbooks.',
                'location' => 'Remote',
                'work_mode' => 'Remote',
                'job_type' => 'remote',
                'salary_range' => 'USD 2,000 - 3,500',
                'salary_min' => 2000,
                'salary_max' => 3500,
                'experience_level' => 'Senior',
                'education' => 'Experience-first',
                'status' => 'active',
                'is_active' => true,
                'views' => 312,
                'skills' => ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Nginx', 'CI/CD'],
            ],
            'data-analyst-internship' => [
                'company' => 'hr@deltafinance.test',
                'title' => 'Data Analyst Internship',
                'category' => 'Data Analysis',
                'description' => 'Internship for students who want hands-on reporting and analytics experience.',
                'responsibilities' => 'Clean datasets, build SQL reports, and present weekly business insights.',
                'location' => 'Alexandria, Egypt',
                'work_mode' => 'On-site',
                'job_type' => 'internship',
                'salary_range' => 'EGP 4,000 - 6,000',
                'salary_min' => 4000,
                'salary_max' => 6000,
                'experience_level' => 'Entry-level',
                'education' => 'Student or fresh graduate',
                'status' => 'active',
                'is_active' => true,
                'views' => 187,
                'skills' => ['Python', 'MySQL', 'PostgreSQL', 'Presentation Skills', 'Attention to Detail'],
            ],
            'part-time-wordpress-support' => [
                'company' => 'talent@remotehub.test',
                'title' => 'Part-time Web Support Specialist',
                'category' => 'Web Support',
                'description' => 'Help marketplace customers fix website content, forms, and basic integration issues.',
                'responsibilities' => 'Triage support tickets, update pages, and coordinate fixes with engineering.',
                'location' => 'Remote',
                'work_mode' => 'Remote',
                'job_type' => 'part_time',
                'salary_range' => 'EGP 8,000 - 12,000',
                'salary_min' => 8000,
                'salary_max' => 12000,
                'experience_level' => 'Junior',
                'education' => 'Any relevant background',
                'status' => 'paused',
                'is_active' => false,
                'views' => 64,
                'skills' => ['Communication', 'Problem Solving', 'HTML', 'CSS', 'JavaScript'],
            ],
        ];

        $jobs = [];

        foreach ($data as $key => $item) {
            $company = $companies[$item['company']];
            $skills = $item['skills'];
            unset($item['company'], $item['skills']);

            $job = JobPost::withTrashed()->updateOrCreate(
                ['company_id' => $company->id, 'title' => $item['title']],
                $item + ['company_id' => $company->id]
            );

            if ($job->trashed()) {
                $job->restore();
            }

            $this->syncJobSkills($job, $skills);
            $jobs[$key] = $job;
        }

        return $jobs;
    }

    private function seedApplications(User $admin, array $companies, array $seekers, array $jobs): void
    {
        $data = [
            ['job' => 'senior-laravel-api-engineer', 'seeker' => 'omar.backend@test.com', 'score' => 91.50, 'status' => 'shortlisted', 'missing' => ['Kubernetes'], 'history' => ['applied', 'under_review', 'shortlisted']],
            ['job' => 'react-dashboard-developer', 'seeker' => 'jobseeker@test.com', 'score' => 88.00, 'status' => 'under_review', 'missing' => ['GraphQL'], 'history' => ['applied', 'under_review']],
            ['job' => 'data-analyst-internship', 'seeker' => 'sara.data@test.com', 'score' => 84.25, 'status' => 'shortlisted', 'missing' => ['Power BI'], 'history' => ['applied', 'under_review', 'shortlisted']],
            ['job' => 'remote-devops-engineer', 'seeker' => 'youssef.devops@test.com', 'score' => 94.75, 'status' => 'under_review', 'missing' => ['Azure'], 'history' => ['applied', 'under_review']],
            ['job' => 'data-analyst-internship', 'seeker' => 'nour.intern@test.com', 'score' => 61.00, 'status' => 'applied', 'missing' => ['Python', 'PostgreSQL'], 'history' => ['applied']],
            ['job' => 'fintech-qa-automation-engineer', 'seeker' => 'jobseeker@test.com', 'score' => 57.50, 'status' => 'rejected', 'missing' => ['TDD', 'MySQL'], 'history' => ['applied', 'under_review', 'rejected']],
        ];

        foreach ($data as $item) {
            $application = Application::withTrashed()->updateOrCreate(
                ['job_id' => $jobs[$item['job']]->id, 'job_seeker_id' => $seekers[$item['seeker']]->id],
                ['ai_score' => $item['score'], 'status' => $item['status'], 'missing_skills_json' => $item['missing']]
            );

            if ($application->trashed()) {
                $application->restore();
            }

            ApplicationStatusHistory::where('application_id', $application->id)->delete();
            foreach ($item['history'] as $index => $status) {
                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => $status,
                    'changed_by' => $index === 0 ? $seekers[$item['seeker']]->user_id : $companies[$this->companyEmailForJob($item['job'])]->user_id,
                    'notes' => $this->statusNote($status),
                    'created_at' => now()->subDays(count($item['history']) - $index),
                ]);
            }
        }

    }

    private function seedMessages(array $companies, array $seekers, array $jobs): void
    {
        Message::whereIn('content', $this->demoMessageContents())->delete();

        $threads = [
            ['company' => 'company@test.com', 'seeker' => 'jobseeker@test.com', 'job' => 'react-dashboard-developer', 'messages' => [
                ['from' => 'company', 'content' => 'Hi Mona, your React profile looks good. Are you available for a technical interview tomorrow?', 'read' => true, 'minutes' => 180],
                ['from' => 'seeker', 'content' => 'Yes, tomorrow works for me after 3 PM. I can walk through my dashboard project.', 'read' => true, 'minutes' => 150],
                ['from' => 'company', 'content' => 'Perfect. I scheduled it for 4 PM and added the job details to the invite.', 'read' => false, 'minutes' => 120],
            ]],
            ['company' => 'hr@deltafinance.test', 'seeker' => 'sara.data@test.com', 'job' => 'data-analyst-internship', 'messages' => [
                ['from' => 'company', 'content' => 'Sara, we liked your SQL sample. Can you share when you can start the internship?', 'read' => true, 'minutes' => 360],
                ['from' => 'seeker', 'content' => 'I can start next Sunday and I am available on-site three days per week.', 'read' => true, 'minutes' => 330],
            ]],
            ['company' => 'talent@remotehub.test', 'seeker' => 'youssef.devops@test.com', 'job' => 'remote-devops-engineer', 'messages' => [
                ['from' => 'seeker', 'content' => 'I saw the DevOps role and can share examples of Kubernetes deployments I managed.', 'read' => true, 'minutes' => 240],
                ['from' => 'company', 'content' => 'Great, please send a short summary of your AWS and CI/CD experience before the interview.', 'read' => false, 'minutes' => 210],
            ]],
        ];

        foreach ($threads as $thread) {
            foreach ($thread['messages'] as $message) {
                Message::create([
                    'sender_id' => $message['from'] === 'company' ? $companies[$thread['company']]->user_id : $seekers[$thread['seeker']]->user_id,
                    'receiver_id' => $message['from'] === 'company' ? $seekers[$thread['seeker']]->user_id : $companies[$thread['company']]->user_id,
                    'job_id' => $jobs[$thread['job']]->id,
                    'content' => $message['content'],
                    'read_at' => $message['read'] ? now()->subMinutes($message['minutes'] - 20) : null,
                    'created_at' => now()->subMinutes($message['minutes']),
                    'updated_at' => now()->subMinutes($message['minutes']),
                ]);
            }
        }
    }

    private function seedSavedJobs(array $seekers, array $jobs): void
    {
        $saved = [
            'jobseeker@test.com' => ['react-dashboard-developer', 'remote-devops-engineer'],
            'omar.backend@test.com' => ['senior-laravel-api-engineer', 'remote-devops-engineer'],
            'sara.data@test.com' => ['data-analyst-internship', 'fintech-qa-automation-engineer'],
            'nour.intern@test.com' => ['data-analyst-internship', 'part-time-wordpress-support'],
        ];

        foreach ($saved as $email => $jobKeys) {
            foreach ($jobKeys as $jobKey) {
                DB::table('saved_jobs')->updateOrInsert(
                    ['job_seeker_id' => $seekers[$email]->id, 'job_id' => $jobs[$jobKey]->id],
                    ['created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2)]
                );
            }
        }
    }

    private function seedViews(array $seekers, array $jobs): void
    {
        foreach ($seekers as $profile) {
            foreach (array_slice($jobs, 0, 4) as $job) {
                DB::table('job_post_views')->updateOrInsert(
                    ['job_id' => $job->id, 'user_id' => $profile->user_id],
                    ['created_at' => now()->subHours(rand(1, 72)), 'updated_at' => now()->subHours(rand(1, 72))]
                );
            }
        }
    }

    private function seedNotifications(User $admin, array $companies, array $seekers, array $jobs): void
    {
        Notification::where('type', 'like', 'demo_%')->delete();
        Notification::where('type', 'interview_scheduled')->delete();

        $this->notify($admin, 'demo_platform', 'Demo data refreshed', 'Users, jobs, applications, interviews, and chats are ready for testing.', 'admin_panel_settings');
        $this->seedAdminApplicationSummary($admin);

        foreach ($companies as $company) {
            $this->notify($company->user, 'demo_applications', 'New applications to review', 'Open the dashboard to review seeded candidates and interview activity.', 'work_history');
        }

        foreach ($seekers as $profile) {
            $this->notify($profile->user, 'demo_recommendation', 'Recommended jobs available', 'Your demo profile has matching jobs, saved jobs, messages, and application statuses.', 'auto_awesome');
        }

        $this->notifyInterview($seekers['jobseeker@test.com']->user, $companies['company@test.com'], $jobs['react-dashboard-developer'], now()->addDay()->setTime(16, 0));
        $this->notifyInterview($seekers['sara.data@test.com']->user, $companies['hr@deltafinance.test'], $jobs['data-analyst-internship'], now()->addDays(2)->setTime(12, 30));
        $this->notifyInterview($seekers['youssef.devops@test.com']->user, $companies['talent@remotehub.test'], $jobs['remote-devops-engineer'], now()->addDays(3)->setTime(18, 0));
    }

    private function upsertUser(string $email, array $attributes): User
    {
        $user = User::withTrashed()->updateOrCreate(
            ['email' => $email],
            $attributes + ['email' => $email, 'password' => $this->password]
        );

        if ($user->trashed()) {
            $user->restore();
        }

        return $user;
    }

    private function syncSeekerSkills(JobSeekerProfile $profile, array $skillNames): void
    {
        JobSeekerSkill::where('job_seeker_id', $profile->id)->delete();

        foreach ($skillNames as $name) {
            $skill = $this->skill($name);
            JobSeekerSkill::create(['job_seeker_id' => $profile->id, 'skill_id' => $skill->id, 'source' => 'cv']);
        }
    }

    private function syncJobSkills(JobPost $job, array $skillNames): void
    {
        JobRequiredSkill::where('job_id', $job->id)->delete();

        foreach ($skillNames as $index => $name) {
            $skill = $this->skill($name);
            JobRequiredSkill::create(['job_id' => $job->id, 'skill_id' => $skill->id, 'is_mandatory' => $index < 4]);
        }
    }

    private function seedParsedCv(JobSeekerProfile $profile, array $skills): void
    {
        CvParsedData::updateOrCreate(
            ['job_seeker_id' => $profile->id],
            [
                'parsed_json' => [
                    'skills' => $skills,
                    'experience_years' => $profile->years_of_experience,
                    'education' => $profile->education_level,
                    'summary' => 'Seeded CV data for local matching and ATS testing.',
                ],
                'parsed_at' => now()->subDays(1),
            ]
        );
    }

    private function seedAdminApplicationSummary(User $admin): void
    {
        $this->notify($admin, 'demo_admin_summary', 'Application pipeline seeded', 'Demo applications include applied, under review, shortlisted, and rejected statuses.', 'analytics');
    }

    private function notify(User $user, string $type, string $title, string $message, string $icon): void
    {
        Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'data' => ['title' => $title, 'message' => $message, 'icon' => $icon],
            'read_at' => null,
            'created_at' => now()->subMinutes(rand(5, 120)),
        ]);
    }

    private function notifyInterview(User $candidate, CompanyProfile $company, JobPost $job, $interviewAt): void
    {
        Notification::create([
            'user_id' => $candidate->id,
            'type' => 'interview_scheduled',
            'data' => [
                'title' => 'Interview scheduled with ' . $company->company_name,
                'message' => 'Interview for ' . $job->title . ' on ' . $interviewAt->toDayDateTimeString() . '.',
                'message_preview' => 'Interview scheduled for ' . $job->title,
                'sender_id' => $company->user_id,
                'sender_name' => $company->company_name,
                'company_name' => $company->company_name,
                'job_id' => $job->id,
                'job_title' => $job->title,
                'interview_at' => $interviewAt->toISOString(),
                'formatted_interview_at' => $interviewAt->toDayDateTimeString(),
            ],
            'read_at' => null,
            'created_at' => now()->subMinutes(rand(5, 60)),
        ]);
    }

    private function skill(string $name): Skill
    {
        return Skill::firstOrCreate(
            ['name' => $name],
            ['type' => in_array($name, ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Attention to Detail', 'Presentation Skills', 'Creativity'], true) ? 'soft' : 'technical']
        );
    }

    private function companyEmailForJob(string $jobKey): string
    {
        return match ($jobKey) {
            'fintech-qa-automation-engineer', 'data-analyst-internship' => 'hr@deltafinance.test',
            'remote-devops-engineer', 'part-time-wordpress-support' => 'talent@remotehub.test',
            default => 'company@test.com',
        };
    }

    private function statusNote(string $status): string
    {
        return match ($status) {
            'under_review' => 'Recruiter is reviewing the candidate profile and AI score.',
            'shortlisted' => 'Candidate moved to interview shortlist.',
            'rejected' => 'Candidate does not match the current requirements.',
            default => 'Candidate submitted an application.',
        };
    }

    private function demoMessageContents(): array
    {
        return [
            'Hi Mona, your React profile looks good. Are you available for a technical interview tomorrow?',
            'Yes, tomorrow works for me after 3 PM. I can walk through my dashboard project.',
            'Perfect. I scheduled it for 4 PM and added the job details to the invite.',
            'Sara, we liked your SQL sample. Can you share when you can start the internship?',
            'I can start next Sunday and I am available on-site three days per week.',
            'I saw the DevOps role and can share examples of Kubernetes deployments I managed.',
            'Great, please send a short summary of your AWS and CI/CD experience before the interview.',
        ];
    }
}

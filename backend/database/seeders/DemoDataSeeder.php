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
    private const PASSWORD = 'password123';

    public function run(): void
    {
        DB::transaction(function () {
            $this->clearExistingJobData();
            $skills = $this->skillsByName();
            $admin = $this->createAdmin();
            $companies = $this->createCompanies();
            $seekers = $this->createJobSeekers($skills);
            $jobs = $this->createJobs($companies, $skills);

            $this->createApplications($admin, $companies, $seekers, $jobs);
            $this->createMessagesAndInterviewNotifications($companies, $seekers, $jobs);
            $this->createSavedJobs($seekers, $jobs);
        });
    }

    private function clearExistingJobData(): void
    {
        ApplicationStatusHistory::query()->delete();
        Application::withTrashed()->forceDelete();
        Message::query()->delete();
        Notification::query()->delete();
        DB::table('saved_jobs')->delete();
        JobRequiredSkill::query()->delete();
        JobPost::withTrashed()->forceDelete();

        $demoEmails = array_merge(
            ['admin@test.com'],
            array_column($this->companyUsers(), 'email'),
            array_column($this->jobSeekerUsers(), 'email'),
        );

        $demoUserIds = User::withTrashed()->whereIn('email', $demoEmails)->pluck('id');
        $demoSeekerIds = JobSeekerProfile::whereIn('user_id', $demoUserIds)->pluck('id');

        CvParsedData::whereIn('job_seeker_id', $demoSeekerIds)->delete();
        JobSeekerSkill::whereIn('job_seeker_id', $demoSeekerIds)->delete();
        JobSeekerProfile::whereIn('user_id', $demoUserIds)->delete();
        CompanyProfile::whereIn('user_id', $demoUserIds)->delete();
        User::withTrashed()->whereIn('email', $demoEmails)->forceDelete();
    }

    private function skillsByName(): array
    {
        return Skill::query()->pluck('id', 'name')->all();
    }

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Demo Admin',
            'email' => 'admin@test.com',
            'password' => self::PASSWORD,
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_banned' => false,
        ]);
    }

    private function createCompanies(): array
    {
        $companies = [];

        foreach ($this->companyUsers() as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => self::PASSWORD,
                'role' => 'company',
                'email_verified_at' => now(),
                'is_banned' => false,
            ]);

            $companies[$data['key']] = CompanyProfile::create([
                'user_id' => $user->id,
                'company_name' => $data['company_name'],
                'description' => $data['description'],
                'logo_url' => $data['logo_url'],
                'website' => $data['website'],
                'location' => $data['location'],
                'phone' => $data['phone'],
                'founded_year' => $data['founded_year'],
                'company_size' => $data['company_size'],
                'industry' => $data['industry'],
            ])->load('user');
        }

        return $companies;
    }

    private function createJobSeekers(array $skills): array
    {
        $seekers = [];

        foreach ($this->jobSeekerUsers() as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => self::PASSWORD,
                'role' => 'job_seeker',
                'email_verified_at' => now(),
                'is_banned' => false,
            ]);

            $profile = JobSeekerProfile::create([
                'user_id' => $user->id,
                'resume_file_url' => $data['resume_file_url'],
                'years_of_experience' => $data['years_of_experience'],
                'education_level' => $data['education_level'],
                'contact_information' => json_encode($data['contact_information']),
                'cv_parse_status' => 'done',
                'phone' => $data['phone'],
                'address' => $data['address'],
            ])->load('user');

            foreach ($data['skills'] as $skillName) {
                if (isset($skills[$skillName])) {
                    JobSeekerSkill::create([
                        'job_seeker_id' => $profile->id,
                        'skill_id' => $skills[$skillName],
                        'source' => 'manual',
                    ]);
                }
            }

            CvParsedData::create([
                'job_seeker_id' => $profile->id,
                'parsed_json' => [
                    'summary' => $data['summary'],
                    'skills' => $data['skills'],
                    'experience_years' => $data['years_of_experience'],
                    'education' => $data['education_level'],
                ],
                'parsed_at' => now()->subDays(2),
            ]);

            $seekers[$data['key']] = $profile;
        }

        return $seekers;
    }

    private function createJobs(array $companies, array $skills): array
    {
        $jobs = [];

        foreach ($this->jobPosts() as $data) {
            $job = JobPost::create([
                'company_id' => $companies[$data['company_key']]->id,
                'title' => $data['title'],
                'category' => $data['category'],
                'description' => $data['description'],
                'responsibilities' => $data['responsibilities'],
                'location' => $data['location'],
                'work_mode' => $data['work_mode'],
                'job_type' => $data['job_type'],
                'salary_range' => $data['salary_range'],
                'salary_min' => $data['salary_min'],
                'salary_max' => $data['salary_max'],
                'experience_level' => $data['experience_level'],
                'education' => $data['education'],
                'status' => $data['status'],
                'views' => $data['views'],
                'is_active' => $data['is_active'],
            ]);

            foreach ($data['skills'] as $index => $skillName) {
                if (isset($skills[$skillName])) {
                    JobRequiredSkill::create([
                        'job_id' => $job->id,
                        'skill_id' => $skills[$skillName],
                        'is_mandatory' => $index < 3,
                    ]);
                }
            }

            $jobs[$data['key']] = $job;
        }

        return $jobs;
    }

    private function createApplications(User $admin, array $companies, array $seekers, array $jobs): void
    {
        foreach ($this->applications() as $data) {
            $application = Application::create([
                'job_id' => $jobs[$data['job_key']]->id,
                'job_seeker_id' => $seekers[$data['seeker_key']]->id,
                'ai_score' => $data['ai_score'],
                'missing_skills_json' => $data['missing_skills'],
                'status' => $data['status'],
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'status' => 'applied',
                'changed_by' => $admin->id,
                'notes' => 'Demo application created for testing.',
                'created_at' => now()->subDays(5),
            ]);

            if ($data['status'] !== 'applied') {
                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => $data['status'],
                    'changed_by' => $companies[$data['company_key']]->user_id,
                    'notes' => $data['history_note'],
                    'created_at' => now()->subDays(2),
                ]);
            }
        }
    }

    private function createMessagesAndInterviewNotifications(array $companies, array $seekers, array $jobs): void
    {
        foreach ($this->messageThreads() as $thread) {
            $companyUser = $companies[$thread['company_key']]->user;
            $seekerUser = $seekers[$thread['seeker_key']]->user;
            $job = $jobs[$thread['job_key']];

            foreach ($thread['messages'] as $index => $message) {
                Message::create([
                    'sender_id' => $message['from'] === 'company' ? $companyUser->id : $seekerUser->id,
                    'receiver_id' => $message['from'] === 'company' ? $seekerUser->id : $companyUser->id,
                    'job_id' => $job->id,
                    'content' => $message['content'],
                    'read_at' => $index === count($thread['messages']) - 1 ? null : now()->subHours(6),
                    'created_at' => now()->subHours(12 - $index),
                    'updated_at' => now()->subHours(12 - $index),
                ]);
            }

            if (isset($thread['interview_at'])) {
                Notification::create([
                    'user_id' => $seekerUser->id,
                    'type' => 'interview_scheduled',
                    'data' => [
                        'title' => 'Interview scheduled with ' . $companies[$thread['company_key']]->company_name,
                        'message' => 'Interview for ' . $job->title . ' on ' . $thread['interview_at'] . '.',
                        'message_preview' => 'Interview scheduled for ' . $job->title,
                        'sender_id' => $companyUser->id,
                        'sender_name' => $companies[$thread['company_key']]->company_name,
                        'company_name' => $companies[$thread['company_key']]->company_name,
                        'job_id' => $job->id,
                        'job_title' => $job->title,
                        'interview_at' => $thread['interview_at'],
                    ],
                    'created_at' => now()->subHours(2),
                ]);
            }
        }
    }

    private function createSavedJobs(array $seekers, array $jobs): void
    {
        DB::table('saved_jobs')->insert([
            ['job_seeker_id' => $seekers['nour']->id, 'job_id' => $jobs['laravel']->id, 'created_at' => now(), 'updated_at' => now()],
            ['job_seeker_id' => $seekers['omar']->id, 'job_id' => $jobs['react']->id, 'created_at' => now(), 'updated_at' => now()],
            ['job_seeker_id' => $seekers['salma']->id, 'job_id' => $jobs['data']->id, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function companyUsers(): array
    {
        return [
            [
                'key' => 'techlabs',
                'name' => 'TechLabs Recruiter',
                'email' => 'company.techlabs@test.com',
                'company_name' => 'TechLabs Egypt',
                'description' => 'Product engineering company building SaaS platforms for regional clients.',
                'logo_url' => 'https://placehold.co/160x160?text=TL',
                'website' => 'https://techlabs.test',
                'location' => 'Cairo, Egypt',
                'phone' => '+201000000101',
                'founded_year' => '2018',
                'company_size' => '51-200',
                'industry' => 'Software Development',
            ],
            [
                'key' => 'nilecommerce',
                'name' => 'Nile Commerce HR',
                'email' => 'company.nile@test.com',
                'company_name' => 'Nile Commerce',
                'description' => 'E-commerce marketplace focused on retail, payments, and logistics.',
                'logo_url' => 'https://placehold.co/160x160?text=NC',
                'website' => 'https://nilecommerce.test',
                'location' => 'Alexandria, Egypt',
                'phone' => '+201000000202',
                'founded_year' => '2020',
                'company_size' => '201-500',
                'industry' => 'E-Commerce',
            ],
            [
                'key' => 'datavision',
                'name' => 'DataVision Talent',
                'email' => 'company.datavision@test.com',
                'company_name' => 'DataVision Analytics',
                'description' => 'Analytics consultancy helping companies turn operational data into decisions.',
                'logo_url' => 'https://placehold.co/160x160?text=DV',
                'website' => 'https://datavision.test',
                'location' => 'Giza, Egypt',
                'phone' => '+201000000303',
                'founded_year' => '2016',
                'company_size' => '11-50',
                'industry' => 'Data Analytics',
            ],
        ];
    }

    private function jobSeekerUsers(): array
    {
        return [
            [
                'key' => 'nour',
                'name' => 'Nour Hassan',
                'email' => 'seeker.nour@test.com',
                'resume_file_url' => '/demo/cvs/nour-hassan.pdf',
                'years_of_experience' => 3,
                'education_level' => 'Bachelor of Computer Science',
                'phone' => '+201111111111',
                'address' => 'Nasr City, Cairo',
                'summary' => 'Backend developer with Laravel and API experience.',
                'skills' => ['PHP', 'Laravel', 'MySQL', 'REST API', 'Git', 'Docker'],
                'contact_information' => ['firstName' => 'Nour', 'lastName' => 'Hassan', 'title' => 'Laravel Developer'],
            ],
            [
                'key' => 'omar',
                'name' => 'Omar Adel',
                'email' => 'seeker.omar@test.com',
                'resume_file_url' => '/demo/cvs/omar-adel.pdf',
                'years_of_experience' => 2,
                'education_level' => 'Bachelor of Information Systems',
                'phone' => '+201222222222',
                'address' => 'Maadi, Cairo',
                'summary' => 'Frontend developer focused on React and TypeScript.',
                'skills' => ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'REST API', 'Git'],
                'contact_information' => ['firstName' => 'Omar', 'lastName' => 'Adel', 'title' => 'Frontend Developer'],
            ],
            [
                'key' => 'salma',
                'name' => 'Salma Mostafa',
                'email' => 'seeker.salma@test.com',
                'resume_file_url' => '/demo/cvs/salma-mostafa.pdf',
                'years_of_experience' => 4,
                'education_level' => 'Bachelor of Statistics',
                'phone' => '+201333333333',
                'address' => 'Dokki, Giza',
                'summary' => 'Data analyst with Python, SQL, and dashboarding experience.',
                'skills' => ['Python', 'PostgreSQL', 'MySQL', 'Communication', 'Problem Solving', 'Presentation Skills'],
                'contact_information' => ['firstName' => 'Salma', 'lastName' => 'Mostafa', 'title' => 'Data Analyst'],
            ],
            [
                'key' => 'youssef',
                'name' => 'Youssef Ali',
                'email' => 'seeker.youssef@test.com',
                'resume_file_url' => '/demo/cvs/youssef-ali.pdf',
                'years_of_experience' => 1,
                'education_level' => 'Bachelor of Business Information Systems',
                'phone' => '+201444444444',
                'address' => 'Mansoura, Egypt',
                'summary' => 'Junior QA tester learning automation and CI/CD workflows.',
                'skills' => ['JavaScript', 'Git', 'TDD', 'Communication', 'Attention to Detail'],
                'contact_information' => ['firstName' => 'Youssef', 'lastName' => 'Ali', 'title' => 'Junior QA Tester'],
            ],
        ];
    }

    private function jobPosts(): array
    {
        return [
            [
                'key' => 'laravel',
                'company_key' => 'techlabs',
                'title' => 'Laravel Backend Developer',
                'category' => 'Backend Development',
                'description' => 'Build APIs, queues, and integrations for a growing SaaS platform.',
                'responsibilities' => 'Develop REST APIs, optimize MySQL queries, write tests, and review pull requests.',
                'location' => 'Cairo, Egypt',
                'work_mode' => 'Hybrid',
                'job_type' => 'full_time',
                'salary_range' => '18000 - 28000 EGP',
                'salary_min' => 18000,
                'salary_max' => 28000,
                'experience_level' => 'Mid Level',
                'education' => 'Bachelor degree preferred',
                'status' => 'active',
                'views' => 43,
                'is_active' => true,
                'skills' => ['PHP', 'Laravel', 'MySQL', 'REST API', 'Git', 'Docker'],
            ],
            [
                'key' => 'react',
                'company_key' => 'nilecommerce',
                'title' => 'React Frontend Engineer',
                'category' => 'Frontend Development',
                'description' => 'Create fast dashboards and storefront experiences for marketplace teams.',
                'responsibilities' => 'Build React components, integrate APIs, improve UX, and support responsive layouts.',
                'location' => 'Remote',
                'work_mode' => 'Remote',
                'job_type' => 'remote',
                'salary_range' => '16000 - 26000 EGP',
                'salary_min' => 16000,
                'salary_max' => 26000,
                'experience_level' => 'Junior to Mid Level',
                'education' => 'Relevant experience accepted',
                'status' => 'active',
                'views' => 61,
                'is_active' => true,
                'skills' => ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'REST API', 'Git'],
            ],
            [
                'key' => 'data',
                'company_key' => 'datavision',
                'title' => 'Data Analyst',
                'category' => 'Data',
                'description' => 'Analyze business data and create reports for product and operations teams.',
                'responsibilities' => 'Write SQL queries, clean datasets, prepare dashboards, and present insights.',
                'location' => 'Giza, Egypt',
                'work_mode' => 'On-site',
                'job_type' => 'full_time',
                'salary_range' => '14000 - 22000 EGP',
                'salary_min' => 14000,
                'salary_max' => 22000,
                'experience_level' => 'Mid Level',
                'education' => 'Statistics, Computer Science, or similar',
                'status' => 'active',
                'views' => 29,
                'is_active' => true,
                'skills' => ['Python', 'PostgreSQL', 'MySQL', 'Problem Solving', 'Presentation Skills'],
            ],
            [
                'key' => 'qa',
                'company_key' => 'techlabs',
                'title' => 'QA Automation Intern',
                'category' => 'Quality Assurance',
                'description' => 'Join the QA team to test web applications and learn automation workflows.',
                'responsibilities' => 'Create test cases, report bugs, help maintain automated test suites.',
                'location' => 'Cairo, Egypt',
                'work_mode' => 'On-site',
                'job_type' => 'internship',
                'salary_range' => '4000 - 6000 EGP',
                'salary_min' => 4000,
                'salary_max' => 6000,
                'experience_level' => 'Entry Level',
                'education' => 'Student or fresh graduate',
                'status' => 'active',
                'views' => 18,
                'is_active' => true,
                'skills' => ['JavaScript', 'Git', 'TDD', 'Attention to Detail', 'Communication'],
            ],
            [
                'key' => 'devops',
                'company_key' => 'nilecommerce',
                'title' => 'DevOps Engineer',
                'category' => 'Infrastructure',
                'description' => 'Support deployment pipelines, cloud infrastructure, and monitoring.',
                'responsibilities' => 'Maintain Docker images, CI/CD pipelines, Linux servers, and cloud resources.',
                'location' => 'Alexandria, Egypt',
                'work_mode' => 'Hybrid',
                'job_type' => 'contract',
                'salary_range' => '25000 - 38000 EGP',
                'salary_min' => 25000,
                'salary_max' => 38000,
                'experience_level' => 'Senior Level',
                'education' => 'Relevant experience accepted',
                'status' => 'active',
                'views' => 35,
                'is_active' => true,
                'skills' => ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Nginx'],
            ],
        ];
    }

    private function applications(): array
    {
        return [
            ['company_key' => 'techlabs', 'job_key' => 'laravel', 'seeker_key' => 'nour', 'ai_score' => 92.50, 'missing_skills' => [], 'status' => 'shortlisted', 'history_note' => 'Strong match. Ready for technical interview.'],
            ['company_key' => 'nilecommerce', 'job_key' => 'react', 'seeker_key' => 'omar', 'ai_score' => 88.00, 'missing_skills' => [], 'status' => 'under_review', 'history_note' => 'Portfolio review in progress.'],
            ['company_key' => 'datavision', 'job_key' => 'data', 'seeker_key' => 'salma', 'ai_score' => 90.25, 'missing_skills' => ['Power BI'], 'status' => 'shortlisted', 'history_note' => 'Good analytics background.'],
            ['company_key' => 'techlabs', 'job_key' => 'qa', 'seeker_key' => 'youssef', 'ai_score' => 76.00, 'missing_skills' => ['Automation framework'], 'status' => 'applied', 'history_note' => 'New application.'],
            ['company_key' => 'nilecommerce', 'job_key' => 'devops', 'seeker_key' => 'nour', 'ai_score' => 54.50, 'missing_skills' => ['Kubernetes', 'AWS'], 'status' => 'rejected', 'history_note' => 'Missing core DevOps requirements.'],
        ];
    }

    private function messageThreads(): array
    {
        return [
            [
                'company_key' => 'techlabs',
                'seeker_key' => 'nour',
                'job_key' => 'laravel',
                'interview_at' => now()->addDays(2)->setTime(13, 0)->toDateTimeString(),
                'messages' => [
                    ['from' => 'company', 'content' => 'Hi Nour, your Laravel application looks strong. Can we schedule a technical interview?'],
                    ['from' => 'seeker', 'content' => 'Sure, I am available this week.'],
                    ['from' => 'company', 'content' => 'Interview scheduled for the Laravel Backend Developer role. Please prepare a recent API project.'],
                ],
            ],
            [
                'company_key' => 'nilecommerce',
                'seeker_key' => 'omar',
                'job_key' => 'react',
                'messages' => [
                    ['from' => 'company', 'content' => 'Hi Omar, thanks for applying. Do you have a live React portfolio?'],
                    ['from' => 'seeker', 'content' => 'Yes, I can share two dashboards and a marketplace UI sample.'],
                ],
            ],
            [
                'company_key' => 'datavision',
                'seeker_key' => 'salma',
                'job_key' => 'data',
                'interview_at' => now()->addDays(3)->setTime(11, 30)->toDateTimeString(),
                'messages' => [
                    ['from' => 'company', 'content' => 'Hello Salma, we liked your SQL and Python background.'],
                    ['from' => 'company', 'content' => 'Interview scheduled for the Data Analyst role. The call will include a short case study.'],
                ],
            ],
        ];
    }
}

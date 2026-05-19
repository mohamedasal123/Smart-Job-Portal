<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillsSeeder extends Seeder
{
    public function run(): void
    {
        $technical = explode(', ', 'PHP, Laravel, Python, JavaScript, TypeScript, React, Vue.js, Angular, Node.js, MySQL, PostgreSQL, Redis, MongoDB, Docker, Kubernetes, Git, REST API, GraphQL, AWS, Azure, Linux, Nginx, TDD, CI/CD, Elasticsearch, Tailwind CSS, Bootstrap, jQuery, Java, C++');
        $soft = explode(', ', 'Communication, Teamwork, Problem Solving, Leadership, Time Management, Critical Thinking, Adaptability, Creativity, Attention to Detail, Conflict Resolution, Mentoring, Presentation Skills, Negotiation, Emotional Intelligence, Self-Management');

        foreach ($technical as $name) {
            Skill::firstOrCreate(['name' => $name], ['type' => 'technical']);
        }

        foreach ($soft as $name) {
            Skill::firstOrCreate(['name' => $name], ['type' => 'soft']);
        }
    }
}

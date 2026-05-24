<?php

namespace App\Jobs;

use App\Models\Application;
use App\Services\MatchingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RefineApplicationScoreJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;
    public int $backoff = 30;

    public function __construct(public int $applicationId)
    {
    }

    public function handle(MatchingService $matcher): void
    {
        $application = Application::with([
            'jobPost.jobRequiredSkills.skill',
            'jobSeekerProfile',
        ])->find($this->applicationId);

        if (!$application || !$application->jobPost || !$application->jobSeekerProfile) {
            return;
        }

        $seekerSkillIds = $application->jobSeekerProfile->jobSeekerSkills()->pluck('skill_id');
        $requiredSkills = $application->jobPost->jobRequiredSkills;

        try {
            $score = $matcher->calculateScore($seekerSkillIds, $requiredSkills);
            $missing = $matcher->getMissingSkills($seekerSkillIds, $requiredSkills);

            $application->update([
                'ai_score' => $score,
                'missing_skills_json' => $missing,
            ]);
        } catch (\Throwable $e) {
            Log::warning('RefineApplicationScoreJob: keeping local score after failure', [
                'application_id' => $this->applicationId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

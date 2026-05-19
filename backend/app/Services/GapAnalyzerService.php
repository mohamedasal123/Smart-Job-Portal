<?php

namespace App\Services;

use App\Models\Application;
use Illuminate\Support\Collection;

class GapAnalyzerService
{
    /**
     * Identify missing skills for a rejected application.
     * Returns array of missing skill name strings.
     */
    public function analyze(Application $application): array
    {
        $application->load(['jobPost.jobRequiredSkills.skill', 'jobSeekerProfile.jobSeekerSkills']);

        $seekerSkillIds  = $application->jobSeekerProfile->jobSeekerSkills->pluck('skill_id');
        $requiredSkills  = $application->jobPost->jobRequiredSkills;

        return $requiredSkills
            ->whereNotIn('skill_id', $seekerSkillIds)
            ->pluck('skill.name')
            ->values()
            ->toArray();
    }
}

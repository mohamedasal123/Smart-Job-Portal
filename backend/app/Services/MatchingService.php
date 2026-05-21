<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Models\Skill;
use Illuminate\Support\Facades\Log;

class MatchingService
{
    protected AiService $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Calculate AI matching score between seeker skills and job required skills.
     */
    public function calculateScore(
        Collection $seekerSkillIds,
        Collection $requiredSkills
    ): float {
        $candidateSkills = Skill::whereIn('id', $seekerSkillIds)->pluck('name')->toArray();
        $jobSkillsStr = $requiredSkills->pluck('skill.name')->implode(', ');

        try {
            $matchData = $this->aiService->matchSkills($candidateSkills, $jobSkillsStr);
            return (float) ($matchData['ai_score'] ?? 0);
        } catch (\Exception $e) {
            Log::error('MatchingService calculateScore fallback', ['error' => $e->getMessage()]);
            // Fallback logic
            $mandatory = $requiredSkills->where('is_mandatory', true);
            $optional  = $requiredSkills->where('is_mandatory', false);

            $matchedMandatory = $mandatory->whereIn('skill_id', $seekerSkillIds)->count();
            $matchedOptional  = $optional->whereIn('skill_id', $seekerSkillIds)->count();

            $mandatoryScore = $mandatory->count() > 0
                ? ($matchedMandatory / $mandatory->count()) * config('matching.mandatory_weight', 70) 
                : config('matching.mandatory_weight', 70);

            $optionalScore = $optional->count() > 0
                ? ($matchedOptional / $optional->count()) * config('matching.optional_weight', 30) 
                : config('matching.optional_weight', 30);

            return round($mandatoryScore + $optionalScore, 2);
        }
    }

    /**
     * Return array of skill names that are required but missing from seeker's profile.
     */
    public function getMissingSkills(
        Collection $seekerSkillIds,
        Collection $requiredSkills
    ): array {
        $candidateSkills = Skill::whereIn('id', $seekerSkillIds)->pluck('name')->toArray();
        $jobSkillsStr = $requiredSkills->pluck('skill.name')->implode(', ');

        try {
            $matchData = $this->aiService->matchSkills($candidateSkills, $jobSkillsStr);
            return $matchData['missing_skills'] ?? [];
        } catch (\Exception $e) {
            return $requiredSkills
                ->whereNotIn('skill_id', $seekerSkillIds)
                ->pluck('skill.name')
                ->toArray();
        }
    }

    /**
     * Sort a collection of applications descending by ai_score.
     */
    public function rankApplications(Collection $applications): Collection {
        return $applications->sortByDesc('ai_score')->values();
    }

    /**
     * Fast, in-process score for browsing/ranking use cases.
     *
     * Computes the same weighted mandatory/optional overlap that the AI
     * service falls back to, but without a per-call HTTP request or a per-call
     * skill-name lookup. Use this for recommendation listings where we score
     * dozens of jobs and AI-level precision isn't worth the latency. Use
     * {@see calculateScore()} when a single application needs the full AI run.
     *
     * @param  Collection<int>             $seekerSkillIds
     * @param  Collection<JobRequiredSkill> $requiredSkills
     */
    public function calculateLocalScore(
        Collection $seekerSkillIds,
        Collection $requiredSkills
    ): float {
        $mandatory = $requiredSkills->where('is_mandatory', true);
        $optional  = $requiredSkills->where('is_mandatory', false);

        $matchedMandatory = $mandatory->whereIn('skill_id', $seekerSkillIds)->count();
        $matchedOptional  = $optional->whereIn('skill_id', $seekerSkillIds)->count();

        $mandatoryWeight = (float) config('matching.mandatory_weight', 70);
        $optionalWeight  = (float) config('matching.optional_weight', 30);

        $mandatoryScore = $mandatory->count() > 0
            ? ($matchedMandatory / $mandatory->count()) * $mandatoryWeight
            : $mandatoryWeight;

        $optionalScore = $optional->count() > 0
            ? ($matchedOptional / $optional->count()) * $optionalWeight
            : $optionalWeight;

        return round($mandatoryScore + $optionalScore, 2);
    }
}

<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Services\MatchingService;
use App\Models\JobPost;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class JobRecommendationController extends Controller
{
    use ApiResponse;

    public function __construct(private MatchingService $matchingService) {}

    public function index(Request $request)
    {
        $profile        = $request->user()->jobSeekerProfile;
        $seekerSkillIds = $profile->jobSeekerSkills()->pluck('skill_id');

        $jobs = JobPost::active()->with(['jobRequiredSkills.skill', 'companyProfile'])->get();

        $recommended = $jobs->map(function ($job) use ($seekerSkillIds) {
            $score = $this->matchingService->calculateScore($seekerSkillIds, $job->jobRequiredSkills);
            $job->setAttribute('ai_score', $score);
            return $job;
        })
        ->filter(fn ($job) => $job->ai_score > 0)
        ->sortByDesc('ai_score')
        ->take(20)
        ->values();

        return $this->success(JobResource::collection($recommended));
    }
}

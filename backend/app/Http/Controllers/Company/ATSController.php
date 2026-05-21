<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Http\Resources\JobResource;
use App\Models\Application;
use App\Models\JobPost;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\ApiResponse;

class ATSController extends Controller
{
    use ApiResponse;

    public function __construct(private MatchingService $matchingService) {}

    public function applicants(Request $request, JobPost $job)
    {
        if ($request->user()->cannot('viewApplicants', $job)) {
            return $this->error('Unauthorized', 403);
        }

        $applications = $job->applications()
            ->with(['jobSeekerProfile.user', 'jobSeekerProfile.skills'])
            ->get();

        $ranked = $this->matchingService->rankApplications($applications);

        // Manual pagination for ranked collection
        $page      = $request->get('page', 1);
        $perPage   = 15;
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $ranked->forPage($page, $perPage)->values(),
            $ranked->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return $this->success(ApplicationResource::collection($paginated));
    }

    public function show(Request $request, Application $application)
    {
        if ($request->user()->id !== $application->jobPost->companyProfile->user_id) {
            return $this->error('Unauthorized', 403);
        }

        return $this->success(
            new ApplicationResource($application->load('jobSeekerProfile.cvParsedData'))
        );
    }

    public function downloadCV(Request $request, Application $application)
    {
        if ($request->user()->id !== $application->jobPost->companyProfile->user_id) {
            return $this->error('Unauthorized', 403);
        }

        $url = $application->jobSeekerProfile->resume_file_url;
        if (!$url || !Storage::disk('local')->exists($url)) {
            return $this->error('CV not found', 404);
        }

        // Suggest a friendly filename rather than the random UUID we store on disk.
        $seekerName = $application->jobSeekerProfile->user->name ?? 'candidate';
        $extension  = pathinfo($url, PATHINFO_EXTENSION);
        $download   = sprintf('%s-cv.%s', \Illuminate\Support\Str::slug($seekerName), $extension);

        return Storage::disk('local')->download($url, $download);
    }
}

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

    public function index(Request $request)
    {
        $companyProfile = $request->user()->companyProfile;
        $search = trim((string) $request->get('query', ''));
        $status = $request->get('status');
        
        $applications = Application::whereHas('jobPost', function ($query) use ($companyProfile) {
            $query->where('company_id', $companyProfile->id);
        })
        ->when($status && $status !== 'all', function ($query) use ($status) {
            $query->where('status', $status);
        })
        ->when($search !== '', function ($query) use ($search) {
            $query->where(function ($inner) use ($search) {
                $inner->where('status', 'like', "%{$search}%")
                    ->orWhereHas('jobPost', function ($jobQuery) use ($search) {
                        $jobQuery->where('title', 'like', "%{$search}%")
                            ->orWhere('location', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%");
                    })
                    ->orWhereHas('jobSeekerProfile.user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('jobSeekerProfile.skills', function ($skillQuery) use ($search) {
                        $skillQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('jobSeekerProfile', function ($profileQuery) use ($search) {
                        $profileQuery->where('education_level', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        })
        ->with(['jobPost.jobRequiredSkills.skill', 'jobSeekerProfile.user', 'jobSeekerProfile.skills'])
        ->orderBy('created_at', 'desc')
        ->get();

        $ranked = $this->matchingService->rankApplications($applications);
        if ($request->get('sort') === 'experience') {
            $ranked = $ranked->sortByDesc(fn ($application) => (int) ($application->jobSeekerProfile?->years_of_experience ?? 0))->values();
        } elseif ($request->get('sort') === 'newest') {
            $ranked = $ranked->sortByDesc('created_at')->values();
        }

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

    public function applicants(Request $request, JobPost $job)
    {
        if ($request->user()->cannot('viewApplicants', $job)) {
            return $this->error('Unauthorized', 403);
        }

        $search = trim((string) $request->get('query', ''));
        $status = $request->get('status');

        $applications = $job->applications()
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('status', 'like', "%{$search}%")
                        ->orWhereHas('jobSeekerProfile.user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('jobSeekerProfile.skills', function ($skillQuery) use ($search) {
                            $skillQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('jobSeekerProfile', function ($profileQuery) use ($search) {
                            $profileQuery->where('education_level', 'like', "%{$search}%")
                                ->orWhere('address', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%");
                        });
                });
            })
            ->with(['jobPost.jobRequiredSkills.skill', 'jobSeekerProfile.user', 'jobSeekerProfile.skills'])
            ->get();

        $ranked = $this->matchingService->rankApplications($applications);
        if ($request->get('sort') === 'experience') {
            $ranked = $ranked->sortByDesc(fn ($application) => (int) ($application->jobSeekerProfile?->years_of_experience ?? 0))->values();
        } elseif ($request->get('sort') === 'newest') {
            $ranked = $ranked->sortByDesc('created_at')->values();
        }

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
            new ApplicationResource($application->load(['jobPost.jobRequiredSkills.skill', 'jobSeekerProfile.user', 'jobSeekerProfile.skills', 'jobSeekerProfile.cvParsedData']))
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

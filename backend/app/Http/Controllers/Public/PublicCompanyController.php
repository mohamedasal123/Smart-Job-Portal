<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\JobResource;
use App\Models\CompanyProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PublicCompanyController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $companies = CompanyProfile::with('user')
            ->when($request->search, fn ($q, $s) =>
                $q->where('company_name', 'like', "%$s%")
                  ->orWhere('location', 'like', "%$s%")
            )
            ->withCount(['jobPosts as active_jobs_count' =>
                fn ($q) => $q->where('is_active', true)
            ])
            ->latest()
            ->paginate(15);

        return $this->success(CompanyResource::collection($companies));
    }

    public function show(CompanyProfile $company)
    {
        $company->load('user')
                ->loadCount(['jobPosts as active_jobs_count' =>
                    fn ($q) => $q->where('is_active', true)
                ]);

        $activeJobs = $company->jobPosts()
            ->where('is_active', true)
            ->with('jobRequiredSkills.skill')
            ->latest()
            ->get();

        return $this->success([
            'company'     => new CompanyResource($company),
            'active_jobs' => JobResource::collection($activeJobs),
        ]);
    }
}

<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function updateStatus(User $user, Application $application): bool
    {
        return $user->companyProfile?->id === $application->jobPost->company_id;
    }

    public function view(User $user, Application $application): bool
    {
        return $user->jobSeekerProfile?->id === $application->job_seeker_id
            || $user->companyProfile?->id === $application->jobPost->company_id;
    }

    public function delete(User $user, Application $application): bool
    {
        return $user->jobSeekerProfile?->id === $application->job_seeker_id;
    }
}

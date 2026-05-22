<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'title'                => $this->title,
            'category'             => $this->category,
            'description'          => $this->description,
            'responsibilities'     => $this->responsibilities,
            'location'             => $this->location,
            'job_type'             => $this->job_type,
            'salary_range'         => $this->salary_range,
            'is_active'            => (bool) $this->is_active,
            'ai_score'             => $this->when(isset($this->ai_score), $this->ai_score),
            'applications_count'   => $this->when(isset($this->applications_count), $this->applications_count),
            'company_profile'      => $this->when(
                $this->relationLoaded('companyProfile'),
                fn () => new CompanyResource($this->companyProfile)
            ),
            'job_required_skills'  => $this->when(
                $this->relationLoaded('jobRequiredSkills'),
                fn () => $this->jobRequiredSkills->map(fn ($row) => [
                    'skill_id'     => $row->skill_id,
                    'is_mandatory' => (bool) $row->is_mandatory,
                    'skill'        => $row->skill ? new SkillResource($row->skill) : null,
                ])
            ),
            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,
        ];
    }
}

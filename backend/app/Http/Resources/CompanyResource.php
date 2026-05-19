<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'company_name'     => $this->company_name,
            'description'      => $this->description,
            'location'         => $this->location,
            'website'          => $this->website,
            'logo_url'         => $this->logo_url,
            'industry'         => $this->industry,
            'active_jobs_count'=> $this->when(
                isset($this->active_jobs_count),
                $this->active_jobs_count
            ),
            'created_at'       => $this->created_at,
        ];
    }
}

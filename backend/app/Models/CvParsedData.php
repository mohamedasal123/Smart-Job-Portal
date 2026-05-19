<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvParsedData extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'parsed_json' => 'array',
            'parsed_at' => 'datetime',
        ];
    }

    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class, 'job_seeker_id');
    }
}

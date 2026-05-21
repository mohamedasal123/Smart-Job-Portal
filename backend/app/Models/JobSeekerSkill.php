<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobSeekerSkill extends Model
{
    protected $fillable = [
        'job_seeker_id',
        'skill_id',
        'source',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class, 'job_seeker_id');
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyProfile extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'description',
        'logo_url',
        'website',
        'location',
        'phone',
        'founded_year',
        'company_size',
        'industry',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosts(): HasMany
    {
        return $this->hasMany(JobPost::class, 'company_id');
    }
}

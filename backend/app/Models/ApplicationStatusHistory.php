<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationStatusHistory extends Model
{
    protected $table = 'application_status_history';
    public $timestamps = false;
    protected $fillable = [
        'application_id',
        'status',
        'changed_by',
        'notes',
        'created_at',
    ];

    // The user schema says 'created_at (timestamp only — no updated_at)',
    // we can manage it manually or map constants but keeping it simple:
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

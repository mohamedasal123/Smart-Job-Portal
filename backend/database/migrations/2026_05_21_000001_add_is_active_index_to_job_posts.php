<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            // Every public/seeker/company job-listing query filters on is_active.
            // Without this index those queries full-scan job_posts.
            $table->index('is_active', 'job_posts_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropIndex('job_posts_is_active_index');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_posts')->cascadeOnDelete();
            $table->foreignId('job_seeker_id')->constrained('job_seeker_profiles')->cascadeOnDelete();
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->json('missing_skills_json')->nullable();
            $table->enum('status', ['applied', 'under_review', 'shortlisted', 'rejected'])->default('applied');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['job_id', 'job_seeker_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};

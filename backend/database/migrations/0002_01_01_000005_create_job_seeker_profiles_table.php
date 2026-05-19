<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_seeker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('resume_file_url', 500)->nullable();
            $table->tinyInteger('years_of_experience')->nullable();
            $table->string('education_level', 100)->nullable();
            $table->text('contact_information')->nullable();
            $table->enum('cv_parse_status', ['pending', 'processing', 'done', 'failed'])->default('pending');
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_seeker_profiles');
    }
};

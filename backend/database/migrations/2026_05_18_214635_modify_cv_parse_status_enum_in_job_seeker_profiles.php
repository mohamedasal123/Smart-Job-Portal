<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'completed' to the enum, and remove 'done' (or just expand it).
        DB::statement("ALTER TABLE job_seeker_profiles MODIFY COLUMN cv_parse_status ENUM('pending', 'processing', 'completed', 'done', 'failed') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE job_seeker_profiles MODIFY COLUMN cv_parse_status ENUM('pending', 'processing', 'done', 'failed') DEFAULT 'pending'");
    }
};

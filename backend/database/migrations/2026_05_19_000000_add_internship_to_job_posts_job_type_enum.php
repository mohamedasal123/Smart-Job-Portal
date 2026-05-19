<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE job_posts MODIFY COLUMN job_type ENUM('full_time', 'part_time', 'remote', 'contract', 'internship') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE job_posts MODIFY COLUMN job_type ENUM('full_time', 'part_time', 'remote', 'contract') NOT NULL");
    }
};

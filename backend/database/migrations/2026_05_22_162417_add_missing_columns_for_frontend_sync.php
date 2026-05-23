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
        Schema::table('job_posts', function (Blueprint $table) {
            $table->string('work_mode')->nullable()->after('location'); // Remote, Hybrid, On-site
            $table->string('experience_level')->nullable()->after('job_type');
            $table->string('education')->nullable()->after('experience_level');
            $table->bigInteger('salary_min')->nullable()->after('salary_range');
            $table->bigInteger('salary_max')->nullable()->after('salary_min');
            $table->string('status')->default('active')->after('is_active'); // draft, active, paused, closed
            $table->integer('views')->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropColumn([
                'work_mode',
                'experience_level',
                'education',
                'salary_min',
                'salary_max',
                'status',
                'views'
            ]);
        });
    }
};

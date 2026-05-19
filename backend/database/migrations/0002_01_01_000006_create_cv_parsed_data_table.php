<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_parsed_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_seeker_id')->unique()->constrained('job_seeker_profiles')->cascadeOnDelete();
            $table->json('parsed_json');
            $table->timestamp('parsed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_parsed_data');
    }
};

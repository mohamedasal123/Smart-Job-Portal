<?php

namespace Tests\Unit;

use App\Services\MatchingService;
use Tests\TestCase;

class MatchingServiceTest extends TestCase
{
    public function test_calculate_score()
    {
        $service = app(MatchingService::class);

        $seekerSkills = collect([1, 2]); // PHP, Laravel
        
        $requiredSkills = collect([
            (object)['skill_id' => 1, 'is_mandatory' => true],
            (object)['skill_id' => 2, 'is_mandatory' => true],
            (object)['skill_id' => 3, 'is_mandatory' => false],
        ]);

        $this->assertSame(70.0, $service->calculateLocalScore($seekerSkills, $requiredSkills));
    }
}

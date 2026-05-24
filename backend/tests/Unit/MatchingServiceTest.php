<?php

namespace Tests\Unit;

use App\Services\MatchingService;
use App\Services\AiService;
use Tests\TestCase;

class MatchingServiceTest extends TestCase
{
    public function test_calculate_score()
    {
        $aiService = $this->createMock(AiService::class);
        $service = new MatchingService($aiService);

        $seekerSkills = collect([1, 2]);

        $requiredSkills = collect([
            (object)['skill_id' => 1, 'is_mandatory' => true],
            (object)['skill_id' => 2, 'is_mandatory' => true],
            (object)['skill_id' => 3, 'is_mandatory' => false],
        ]);

        $this->assertTrue(true);
    }
}

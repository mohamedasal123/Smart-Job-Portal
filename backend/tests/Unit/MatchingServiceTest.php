<?php

namespace Tests\Unit;

use App\Services\AiService;
use App\Services\MatchingService;
use Illuminate\Support\Collection;
use Tests\TestCase;

class MatchingServiceTest extends TestCase
{
    private MatchingService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock AiService — calculateLocalScore never touches it, but the
        // constructor requires it.
        $aiMock = $this->createMock(AiService::class);
        $this->service = new MatchingService($aiMock);
    }

    public function test_perfect_score_when_all_skills_match()
    {
        $seekerSkills = collect([1, 2, 3]);

        $requiredSkills = collect([
            (object)['skill_id' => 1, 'is_mandatory' => true],
            (object)['skill_id' => 2, 'is_mandatory' => true],
            (object)['skill_id' => 3, 'is_mandatory' => false],
        ]);

        $score = $this->service->calculateLocalScore($seekerSkills, $requiredSkills);

        $this->assertIsFloat($score);
        $this->assertEquals(100.0, $score);
    }

    public function test_partial_mandatory_match()
    {
        $seekerSkills = collect([1]); // only one of two mandatory

        $requiredSkills = collect([
            (object)['skill_id' => 1, 'is_mandatory' => true],
            (object)['skill_id' => 2, 'is_mandatory' => true],
            (object)['skill_id' => 3, 'is_mandatory' => false],
        ]);

        $score = $this->service->calculateLocalScore($seekerSkills, $requiredSkills);

        $this->assertIsFloat($score);
        // 1/2 mandatory (35) + 0/1 optional (0) = 35
        $this->assertEquals(35.0, $score);
    }

    public function test_zero_score_when_no_skills_match()
    {
        $seekerSkills = collect([99, 100]); // no overlap

        $requiredSkills = collect([
            (object)['skill_id' => 1, 'is_mandatory' => true],
            (object)['skill_id' => 2, 'is_mandatory' => false],
        ]);

        $score = $this->service->calculateLocalScore($seekerSkills, $requiredSkills);

        $this->assertIsFloat($score);
        $this->assertEquals(0.0, $score);
    }

    public function test_full_score_when_no_required_skills()
    {
        $seekerSkills = collect([1, 2]);
        $requiredSkills = collect([]);

        $score = $this->service->calculateLocalScore($seekerSkills, $requiredSkills);

        // No mandatory and no optional → both weights are awarded in full
        $this->assertIsFloat($score);
        $this->assertEquals(100.0, $score);
    }
}

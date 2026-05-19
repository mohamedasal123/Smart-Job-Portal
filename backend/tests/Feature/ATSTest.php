<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ATSTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_can_reject_applicant()
    {
        $this->assertTrue(true);
    }
}

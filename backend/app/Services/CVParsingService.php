<?php

namespace App\Services;

class CVParsingService
{
    protected AiService $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Parse CV by sending it to the FastAPI microservice.
     */
    public function parse(string $filePath): array
    {
        return $this->aiService->parseCv($filePath);
    }

    /**
     * Extract skill names from the FastAPI parsed output.
     */
    public function extractSkillNames(array $parsedData): array
    {
        // main.py returns 'all_skills', 'technical_skills', 'soft_skills'
        return $parsedData['all_skills'] ?? [];
    }
}

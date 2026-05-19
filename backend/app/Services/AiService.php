<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class AiService
{
    protected string $engineUrl;
    protected string $engineKey;

    public function __construct()
    {
        $this->engineUrl = rtrim(config('ai.engine_url', 'http://127.0.0.1:8000'), '/');
        $this->engineKey = config('ai.engine_key', 'smart_job_secret_key_123');
    }

    /**
     * Send CV file to AI microservice and return parsed data.
     * Gracefully fails by throwing an exception if the service is unreachable.
     */
    public function parseCv(string $filePath): array
    {
        try {
            $fileContent = Storage::disk('local')->get($filePath);
            $fileName = basename($filePath);

            $response = Http::timeout(30)
                ->withHeaders([
                    'X-API-Key' => $this->engineKey,
                ])
                ->attach('file', $fileContent, $fileName)
                ->post("{$this->engineUrl}/parse-cv");

            if ($response->failed()) {
                Log::error('AI Engine Parse-CV Failed', ['status' => $response->status(), 'body' => $response->body()]);
                throw new Exception('AI Engine parse failed: ' . $response->body());
            }

            $json = $response->json();
            if (!isset($json['success']) || !$json['success']) {
                throw new Exception('AI Engine returned unsuccessful response');
            }

            return $json['data'];
        } catch (Exception $e) {
            Log::error('AiService::parseCv Exception', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Call the matching endpoint in the AI microservice.
     */
    public function matchSkills(array $candidateSkills, string $jobSkillsStr): array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-API-Key' => $this->engineKey,
                ])
                ->post("{$this->engineUrl}/match-skills", [
                    'candidate_skills' => $candidateSkills,
                    'job_skills_str' => $jobSkillsStr,
                ]);

            if ($response->failed()) {
                Log::error('AI Engine Match-Skills Failed', ['status' => $response->status(), 'body' => $response->body()]);
                throw new Exception('AI Engine match-skills failed: ' . $response->body());
            }

            $json = $response->json();
            if (!isset($json['success']) || !$json['success']) {
                throw new Exception('AI Engine returned unsuccessful match response');
            }

            return $json['data'];
        } catch (Exception $e) {
            Log::error('AiService::matchSkills Exception', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}

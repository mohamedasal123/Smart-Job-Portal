<?php

return [
    'engine_url' => env('AI_ENGINE_URL', 'http://127.0.0.1:8001'),
    // No default: leaving this unset will cause AI calls to fail authentication,
    // which is the correct behavior — set AI_ENGINE_KEY in .env (must match the
    // value used by the FastAPI AI service).
    'engine_key' => env('AI_ENGINE_KEY'),
];

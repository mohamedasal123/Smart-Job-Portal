# Smart Job Portal AI Service

## Local Setup

1. Create and activate a virtual environment.
2. Install dependencies with `python -m pip install -r requirements.txt`.
3. If the model URL in `requirements.txt` is blocked, install it manually with `python -m spacy download en_core_web_sm`.
4. Start the service with `uvicorn main:app --host 127.0.0.1 --port 8001`.

The Laravel backend expects this service at `AI_ENGINE_URL=http://127.0.0.1:8001` and sends `X-API-Key`. Keep `AI_API_KEY` here equal to `AI_ENGINE_KEY` in the backend environment.

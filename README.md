# Smart Job Portal

Smart Job Portal has three main parts:

- `backend/` — Laravel API, database migrations, queue jobs, and authentication.
- `frontend/` — React/Vite user interface.
- `Ai/` — FastAPI AI service for CV parsing and skill matching.

Helper scripts live in `scripts/`, with Windows shortcuts in the project root.

## Quick Start On Windows/XAMPP

1. Start XAMPP MySQL.
2. Create a MySQL database named `smart_job`.
3. Run setup from the project root:

```bat
setup.cmd
```

4. If setup could not reach MySQL, run this after starting MySQL:

```bat
migrate.cmd
```

5. Start all services:

```bat
start.cmd
```

This opens the backend, queue worker, AI service, and frontend in separate windows.

## Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- AI health check: `http://127.0.0.1:8001/health`

Use `127.0.0.1` consistently. Mixing it with `localhost` can break Sanctum cookies.

## Test Accounts

All seeded test accounts use password `password123`.

- `admin@test.com`
- `company@test.com`
- `jobseeker@test.com`

## Checks

Run all local checks from the project root:

```bat
check.cmd
```

## Notes

- Do not rely on SQL dumps for setup. Use Laravel migrations and seeders.
- Keep the queue worker running when testing CV upload and parsing.
- The tracked project is intentionally limited to source code, docs, scripts, and configuration examples. Generated caches, local `.env` files, and design-reference HTML are ignored or removed.

# Smart Job Portal

Smart Job Portal has three main parts:

- `backend/` — Laravel API, database migrations, queue jobs, and authentication.
- `frontend/` — React/Vite user interface.
- `Ai/` — FastAPI AI service for CV parsing and skill matching.

Helper scripts live in `scripts/`, with Windows shortcuts in the project root.

## Best Way To Send The Project

Use GitHub if possible. It is cleaner than Drive because your friend can pull updates, see commits, and avoid sending heavy generated folders.

Before sending, commit only source files. Do not commit `.env`, `vendor/`, `node_modules/`, `.venv/`, `frontend/dist/`, or SQL dumps. SQL dumps are ignored by `.gitignore`; if you want to share `smart_job.sql`, send it separately on Drive/WhatsApp or put it in the zip manually.

Recommended flow:

```bat
git status
git add .
git commit -m "prepare project setup and demo data"
git push
```

If you must use Drive, zip the project after deleting generated folders: `backend/vendor`, `frontend/node_modules`, `Ai/.venv`, and any local `.env` files. Your friend will regenerate them using `setup.cmd`.

## Quick Start On Windows/XAMPP

1. Start XAMPP MySQL.
2. Create a MySQL database named `smart_job` from phpMyAdmin, or let the import script create it.
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

## If You Want To Use The Exported Database

Put `smart_job.sql` in the project root, then run:

```bat
import-db.cmd
```

If the MySQL username/password are different:

```bat
import-db.cmd -Username root -Password your_password
```

If you import the SQL dump, you usually do not need `migrate.cmd`. Use `migrate.cmd` when you want Laravel to create fresh tables and seed demo data from code.

## Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- AI health check: `http://127.0.0.1:8001/health`

Use `127.0.0.1` consistently. Mixing it with `localhost` can break Sanctum cookies.

## Test Accounts

All seeded test accounts use password `password123`.

- `admin@test.com`
- `company.techlabs@test.com`
- `company.nile@test.com`
- `company.datavision@test.com`
- `seeker.nour@test.com`
- `seeker.omar@test.com`
- `seeker.salma@test.com`
- `seeker.youssef@test.com`

## What Your Friend Needs Installed

- XAMPP with MySQL running.
- PHP 8.2+ available in terminal.
- Composer available in terminal, or `backend/composer.phar` present.
- Node.js and npm.
- Python 3.10+.
- PowerShell or PowerShell 7.

## Checks

Run all local checks from the project root:

```bat
check.cmd
```

## Notes

- Do not rely on SQL dumps for setup. Use Laravel migrations and seeders.
- SQL dumps are useful only if you want exactly the same local data snapshot.
- Keep the queue worker running when testing CV upload and parsing.
- The tracked project is intentionally limited to source code, docs, scripts, and configuration examples. Generated caches, local `.env` files, and design-reference HTML are ignored or removed.

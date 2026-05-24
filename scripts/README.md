# Project Scripts

These scripts are for Windows/XAMPP local development.

## First Setup

1. Start XAMPP MySQL.
2. Create a database named `smart_job`.
3. From the project root, run:

```bat
setup.cmd
```

The setup script installs backend, frontend, and AI dependencies. It creates `.env` files only when missing, generates the Laravel key when missing, creates the storage link, and tries to run migrations and seeders.

If the database step fails because MySQL was not running, start MySQL and run:

```bat
migrate.cmd
```

## Import A SQL Dump

If you have `smart_job.sql`, put it in the project root and run:

```bat
import-db.cmd
```

For custom credentials:

```bat
import-db.cmd -Username root -Password your_password
```

Use this only when you want the exact exported database snapshot. Otherwise prefer `migrate.cmd`, which uses migrations and seeders.

## Start The Project

From the project root, run:

```bat
start.cmd
```

This opens four windows:

- Laravel backend: `http://127.0.0.1:8000`
- Laravel queue worker: `cv-parsing,default`
- AI service: `http://127.0.0.1:8001/health`
- React frontend: `http://127.0.0.1:5173`

## Run Checks

From the project root, run:

```bat
check.cmd
```

This runs frontend lint/build, backend platform/route checks, and AI import checks.

## Useful Direct PowerShell Commands

```powershell
scripts\setup-all.ps1
scripts\start-all.ps1
scripts\check-all.ps1
scripts\db-migrate-seed.ps1
scripts\import-db.ps1
```

## Notes

- Do not mix `localhost` and `127.0.0.1`; use `127.0.0.1` everywhere locally.
- Keep XAMPP MySQL running before database setup.
- Keep the queue worker running while testing CV uploads.
- `setup.cmd` does not overwrite existing `.env` files.

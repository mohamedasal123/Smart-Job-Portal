# Smart Job Portal - API Endpoints

This document maps the integration between the React frontend and the Laravel 12 backend.

## Base URLs
- **API Base URL:** `http://127.0.0.1:8000/api`
- **Backend Base URL:** `http://127.0.0.1:8000`

## Authentication & CSRF
Authentication uses **Laravel Sanctum session-based cookies**.
- **CSRF Token:** Before calling login or register, the frontend issues a `GET /sanctum/csrf-cookie` request to the Backend Base URL.
- **Credentials:** All Axios requests are configured with `withCredentials: true`. No Authorization Bearer headers are used.
- **Roles:** The backend returns user roles as `job_seeker`, `company`, or `admin`.

---

## Confirmed Endpoints (from Postman Collection)

### Authentication
- `GET /sanctum/csrf-cookie` — Initialize CSRF token
- `POST /auth/register` — Register a new account (`name`, `email`, `password`, `password_confirmation`, `role`)
- `POST /auth/login` — Sign in to an account (`email`, `password`)
- `POST /auth/logout` — End session
- `GET /auth/me` — Get current authenticated user
- `GET /auth/verify-email` — Verify email token
- `POST /auth/resend-verification` — Resend verification email
- `POST /auth/forgot-password` — Request password reset email
- `POST /auth/reset-password` — Reset password via token

### Public Jobs
- `GET /jobs` — Browse active jobs (with pagination and optional filters: `keyword`, `location`, `job_type`, `page`)

### Admin
- `GET /admin/jobs?page=1` — List all jobs for admin review
- `DELETE /admin/jobs/:jobId` — Force delete a job

---

## Missing / Unconfirmed Endpoints (Pending Backend Confirmation)

These features have interactive UIs in the frontend, but their API endpoint structure is currently simulated locally. The backend developer must provide the exact endpoint paths and request/response payloads to finalize integration.

### Job Seeker
- **Apply to Job:** `POST /applications`
- **Upload CV:** `POST /cv/upload`
- **Get Seeker Profile:** `GET /seeker/profile`

### Company (Recruiter)
- **Get Company Jobs:** `GET /company/jobs`
- **List Applicants for Job:** `GET /company/jobs/:jobId/applicants`
- **Update Applicant Status (Reject/Shortlist):** `PATCH /company/applicants/:applicationId/status`

### Admin
- **List All Users:** `GET /admin/users`
- **Toggle User Ban (Ban/Unban):** `PATCH /admin/users/:userId/ban`

### Public Pages
- **Contact Us Form:** `POST /contact`

---

## Required Backend Confirmations

1. **Login & Register Response Shape:** Does the backend return `response.data.user`, `response.user`, or something else upon successful authentication?
2. **Empty Bodies:** Are there any endpoints (e.g., `logout` or `reset-password`) that intentionally return empty bodies (204 No Content)?
3. **Pagination Structure:** Confirm if list endpoints wrap data under `data.data` (Laravel standard pagination length).

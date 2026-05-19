# Smart Job Portal — Postman Collection Guide

> **Collection file:** `smart_job_postman_collection.json`  
> Located at: `c:\xampp\htdocs\smart_job\smart_job_postman_collection.json`

---

## How to Import

1. Open Postman → **Import** button (top-left)
2. Drag & drop `smart_job_postman_collection.json`  
3. Click **Import**

---

## Environment Variables (Collection-Level)

| Variable | Default Value | Description |
|---|---|---|
| `base_url` | `http://127.0.0.1:8000/api` | API base URL — change to match your server |
| `job_id` | `1` | Reusable job post ID (auto-updated by tests) |
| `app_id` | `1` | Reusable application ID (auto-updated by tests) |
| `user_id` | `1` | Reusable user ID for admin operations (auto-updated) |
| `skill_id` | `1` | Reusable skill ID (auto-updated by List Skills) |

> [!IMPORTANT]
> These are **collection variables**, not environment variables.  
> To set them: open the collection → **Variables** tab.  
> Tests automatically update `job_id`, `app_id`, `user_id`, and `skill_id` from real API responses.

---

## Authentication Model

This API uses **session-based authentication** (cookie sessions), **not** JWT/Bearer tokens.

**Recommended Postman setup:**
- Enable **"Automatically follow redirects"**
- Enable **"Send cookies"** (cookie jar is on by default)
- For CSRF: Postman handles `XSRF-TOKEN` cookie automatically when using the cookie jar

**Login flow:**
1. Register → verify email → Login  
2. Session cookie is stored automatically  
3. All subsequent requests reuse the session

---

## Folder Structure

```
Smart Job Portal API
├── 01 - Authentication          (11 requests)
├── 02 - Jobs (Public Browse)    (4 requests)
├── 03 - Skills (Lookup)         (1 request)
├── 04 - Job Seeker - Profile    (2 requests)
├── 05 - Job Seeker - CV Mgmt   (4 requests)
├── 06 - Job Seeker - Skills     (2 requests)
├── 07 - Job Seeker - AI Recs   (1 request)
├── 08 - Job Seeker - Applic.   (4 requests)
├── 09 - Company - Profile       (3 requests)
├── 10 - Company - Job Posts     (7 requests)
├── 11 - Company - ATS           (6 requests)
└── 12 - Admin                   (6 requests)
```

---

## Detailed Folder Reference

### 01 — Authentication
Public routes under `/api/auth`. Throttle-limited (`throttle:auth`).

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Register New User | POST | `/auth/register` |
| 2 | Register — Company Account | POST | `/auth/register` |
| 3 | Register — Validation Error (422) | POST | `/auth/register` |
| 4 | Login | POST | `/auth/login` |
| 5 | Login — Invalid Credentials (401) | POST | `/auth/login` |
| 6 | Verify Email | GET | `/auth/verify-email?token=...` |
| 7 | Resend Verification Email | POST | `/auth/resend-verification` |
| 8 | Forgot Password — Send Reset Link | POST | `/auth/forgot-password` |
| 9 | Reset Password | POST | `/auth/reset-password` |
| 10 | Get Current User (Me) | GET | `/auth/me` |
| 11 | Logout | POST | `/auth/logout` |

**Key rules:**
- `password` must have ≥1 uppercase + ≥1 number, min 8 chars
- `role` must be `job_seeker` or `company`
- Always returns 200 on resend-verification to prevent enumeration

---

### 02 — Jobs (Public Browse)
Accessible to all authenticated+verified users (any role).

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Browse Active Jobs | GET | `/jobs?keyword=&location=&job_type=&page=1` |
| 2 | Browse Jobs — No Filters | GET | `/jobs` |
| 3 | Get Job Details | GET | `/jobs/{{job_id}}` |
| 4 | Get Job Details — Not Found (404) | GET | `/jobs/99999` |

**Filter params:** `keyword`, `location`, `job_type` (`full_time|part_time|remote|contract`), `salary_range`, `page`

---

### 03 — Skills (Lookup)
| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | List All Skills | GET | `/skills` |

Returns flat array of all skills. No pagination.

---

### 04 — Job Seeker — Profile
Requires `role:job_seeker` middleware.

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Get My Profile | GET | `/profile` |
| 2 | Update My Profile | PUT | `/profile` |

---

### 05 — Job Seeker — CV Management
Rate-limited upload (`throttle:cv_upload`). Parsing is async (queue).

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Upload CV | POST | `/cv/upload` (multipart/form-data) |
| 2 | Get CV Parsing Status | GET | `/cv/status` |
| 3 | Get Parsed CV Data | GET | `/cv/parsed` |
| 4 | Update Parsed CV Data | PUT | `/cv/parsed` |

**CV Status values:** `pending` → `processing` → `completed` / `failed`  
**Allowed file types:** `.pdf`, `.docx` (max 5MB)

---

### 06 — Job Seeker — Skills
| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Add Skill to Profile | POST | `/seeker/skills` |
| 2 | Remove Skill from Profile | DELETE | `/seeker/skills/{{skill_id}}` |

---

### 07 — Job Seeker — AI Recommendations
Requires CV to be uploaded (`cv.uploaded` middleware).

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Get AI-Recommended Jobs | GET | `/jobs/recommended` |

Returns up to 20 jobs sorted by `ai_score` descending. Only jobs with `ai_score > 0`.

---

### 08 — Job Seeker — Applications
| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Apply to a Job | POST | `/applications` |
| 2 | Apply — Already Applied (409) | POST | `/applications` |
| 3 | List My Applications | GET | `/applications?page=1` |
| 4 | Get Application Details | GET | `/applications/{{app_id}}` |

---

### 09 — Company — Profile
Requires `role:company`. Prefix: `/company`.

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Get Company Profile | GET | `/company/profile` |
| 2 | Update Company Profile | PUT | `/company/profile` |
| 3 | Upload Company Logo | POST | `/company/profile/logo` (multipart) |

---

### 10 — Company — Job Posts
Requires `role:company`. Policy-enforced (company can only manage own jobs).

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | List Company Job Posts | GET | `/company/jobs?page=1` |
| 2 | Create Job Post | POST | `/company/jobs` |
| 3 | Create Job Post — Validation Error (422) | POST | `/company/jobs` |
| 4 | Get Company Job Details | GET | `/company/jobs/{{job_id}}` |
| 5 | Update Job Post | PUT | `/company/jobs/{{job_id}}` |
| 6 | Toggle Job Active Status | PATCH | `/company/jobs/{{job_id}}/toggle` |
| 7 | Delete Job Post (Soft Delete) | DELETE | `/company/jobs/{{job_id}}` |

---

### 11 — Company — ATS (Applicant Tracking)
Requires `role:company`. Policy-enforced on each operation.

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | List Job Applicants (AI Ranked) | GET | `/company/jobs/{{job_id}}/applicants` |
| 2 | Get Applicant Details | GET | `/company/applicants/{{app_id}}` |
| 3 | Download Applicant CV | GET | `/company/applicants/{{app_id}}/cv` |
| 4 | Update Applicant Status | PATCH | `/company/applicants/{{app_id}}/status` |
| 5 | Update Status — Rejected (Triggers Email) | PATCH | `/company/applicants/{{app_id}}/status` |
| 6 | Update Status — Invalid Value (422) | PATCH | `/company/applicants/{{app_id}}/status` |

**Valid statuses:** `under_review` | `shortlisted` | `rejected`  
**Rejection side effects:** GapAnalyzerService + SendRejectionEmailJob (queued) + ApplicationStatusChanged event

---

### 12 — Admin
Requires `role:admin`. Prefix: `/admin`.

| # | Request Name | Method | Endpoint |
|---|---|---|---|
| 1 | Get Platform Statistics | GET | `/admin/stats` |
| 2 | List All Users | GET | `/admin/users?role=&is_banned=&search=&page=1` |
| 3 | List All Users — No Filters | GET | `/admin/users` |
| 4 | Toggle User Ban Status | PATCH | `/admin/users/{{user_id}}/ban` |
| 5 | List All Jobs (Including Deleted) | GET | `/admin/jobs?page=1` |
| 6 | Force Delete Job (Permanent) | DELETE | `/admin/jobs/{{job_id}}` |

---

## Test Coverage Per Request

Every request includes:
- ✅ **Status code assertion** — primary expected code  
- ✅ **Response time check** — under 1000–5000ms depending on operation  
- ✅ **JSON structure validation** — key fields exist  
- ✅ **Field type assertions** — booleans, arrays, integers verified  
- ✅ **Negative case awareness** — comments for 401/403/404/409/422 scenarios  
- ✅ **Auto variable capture** — `job_id`, `app_id`, `user_id`, `skill_id` extracted from responses

---

## Recommended Test Order

```
1. Register (job_seeker) → verify email → Login
2. List Skills            → saves skill_id
3. Add Skill to Profile
4. Upload CV              → poll /cv/status → /cv/parsed
5. Get AI Recommendations
6. Browse Jobs            → saves job_id
7. Apply to Job           → saves app_id
8. Logout

9. Register (company) → verify email → Login
10. Update Company Profile → Upload Logo
11. Create Job Post        → saves job_id
12. List Applicants (ATS)  → saves app_id
13. Update Applicant Status (shortlisted / rejected)
14. Logout

15. Login as admin
16. Get Stats → List Users → Toggle Ban → Force Delete Job
```

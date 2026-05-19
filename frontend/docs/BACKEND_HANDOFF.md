# Backend Handoff — Job Seeker Data Needs

> **Last updated:** 2026-05-08  
> **Frontend status:** All pages are API-ready using a centralized service layer.  
> **Backend:** Laravel 12 + Sanctum session-based auth  
> **API Base URL:** `http://127.0.0.1:8000/api`

---

## Auth Requirements

Before any API call, the frontend will:
1. Call `GET /sanctum/csrf-cookie` to obtain the CSRF token.
2. Send credentials with `withCredentials: true` on all axios requests.
3. Expect the authenticated user to have role `job_seeker`.

---

## Required Endpoints

### 1. Profile

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/seeker/profile` | Get current seeker profile | — | `{ firstName, lastName, title, location, email, phone, bio, expectedSalary, avatar, portfolio, linkedin, education[], experience[], completionPercentage, cvFile }` |
| `PUT` | `/api/seeker/profile` | Update seeker profile | `{ firstName, lastName, title, location, bio, expectedSalary, portfolio, linkedin }` | `{ success: true, data: {...} }` |

### 2. Skills

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/seeker/skills` | Get seeker's skills | — | `[{ id, name, category, source }]` |
| `POST` | `/api/seeker/skills` | Add a skill | `{ name, category }` | `{ success: true, data: { id, name, category, source } }` |
| `DELETE` | `/api/seeker/skills/:id` | Remove a skill | — | `{ success: true }` |
| `GET` | `/api/seeker/skills/suggestions` | Get AI-suggested skills | — | `[{ name, category }]` (optional endpoint) |

### 3. Applications

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/applications` | List seeker's applications | Query: `?status=...&search=...` | `[{ id, jobId, appliedAt, status, matchScore, matchedSkills[], missingSkills[], timeline[], job: {...} }]` |
| `GET` | `/api/applications/:id` | Single application detail | — | Same as above (single object) |
| `POST` | `/api/applications` | Apply to a job | `{ jobId }` | `{ success: true, data: { id, ... } }` |
| `GET` | `/api/applications/:id/feedback` | Rejection feedback (if applicable) | — | `{ score, summary, strengths[], areasForImprovement[], recommendedResources[] }` |

### 4. Jobs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/jobs` | Browse/search jobs | Query: `?search=...&type=...&page=...` | `[{ id, title, company, location, workMode, type, salaryMin, salaryMax, currency, postedAt, description, responsibilities[], requirements[], requiredSkills[], companyInfo: {...} }]` |
| `GET` | `/api/jobs/:id` | Single job detail | — | Same as above (single object) |
| `GET` | `/api/jobs/recommended` | AI-recommended jobs | Query: `?search=...` | `[{ jobId, matchScore, matchedSkills[], missingSkills[], matchSummary, job: {...} }]` |

### 5. Notifications

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/seeker/notifications` | Get notifications | — | `[{ id, type, title, message, time, createdAt, read, icon }]` |
| `PUT` | `/api/seeker/notifications/:id/read` | Mark as read | — | `{ success: true }` |
| `PUT` | `/api/seeker/notifications/read-all` | Mark all as read | — | `{ success: true }` |

### 6. CV Upload & Parsed Data

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `POST` | `/api/cv/upload` | Upload CV file | `FormData` with file | `{ success: true, parsedData: {...} }` |
| `GET` | `/api/cv/parsed` | Get temporary parsed CV data | — | `{ personalInfo, summary, experience[], education[], skills }` |
| `PUT` | `/api/cv/parsed` | Confirm and save parsed CV data | `{ personalInfo, summary, experience[], education[], skills }` | `{ success: true }` |

### 7. Saved Jobs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/seeker/saved-jobs` | List seeker's saved jobs | — | `[{ jobId, title, company, ... }]` |
| `POST` | `/api/seeker/saved-jobs/:id` | Save a job | — | `{ success: true }` |
| `DELETE` | `/api/seeker/saved-jobs/:id` | Remove a saved job | — | `{ success: true }` |

**Please Confirm:**
- What are the exact endpoints for toggling saved jobs?
- What is the exact endpoint for CV upload (`POST /api/seeker/cv` or `POST /api/cv/upload`)?
- What is the expected form field name for the CV upload (e.g., `file`, `cv`, `resume`)?
- Does the CV upload endpoint return the parsed profile immediately, or does it require polling a status endpoint?
- What is the exact response shape for the AI-parsed CV data?
- Should the frontend update `skills`, `experience`, and `education` together in one `PUT /api/cv/parsed` payload, or separately?

---

## Endpoints Needing Confirmation

These endpoints may or may not be in the backend scope. Please confirm:

### 7. Messages (TBD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/seeker/messages` | Get message conversations |
| `POST` | `/api/seeker/messages/:conversationId` | Send a message |

**Note:** If messaging is not in backend scope, the Messages page will remain a frontend-only UI placeholder / future enhancement.

### 8. Settings (TBD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/seeker/settings` | Save notification preferences, privacy settings |
| `PUT` | `/api/seeker/password` | Change password |
| `DELETE` | `/api/seeker/account` | Delete account |

**Note:** If settings persistence is not in backend scope, the Settings page will use local state only.

---

## Integration Notes

1. **Service Layer:** All API calls should be made in `src/services/jobSeekerDataService.js`. Each function has a `TODO` comment with the expected endpoint.
2. **Axios Instance:** Use the pre-configured axios instance at `src/api/axios.js` which handles Sanctum CSRF and `withCredentials`.
3. **Error Handling:** The service layer should throw errors that pages can catch and display via the `useToast()` hook.
4. **Loading States:** All pages already implement loading states with spinners.
5. **Mock Data:** Located in `src/data/jobSeekerMockData.js` — can be deleted once all endpoints are connected.
# Company / Recruiter Backend Handoff

> **Frontend status:** Company pages are unified under `CompanyLayout` and use `src/services/companyDataService.js` with mock-only state.

Please confirm the following endpoint paths, request payloads, response shapes, pagination format, and authorization behavior before frontend wiring replaces the mock service:

| Area | Backend Confirmation Needed |
|------|-----------------------------|
| Company profile | Confirm `GET` endpoint for the authenticated company profile and response fields. |
| Edit company profile | Confirm update endpoint, method (`PUT` or `PATCH`), validation errors, and payload shape. |
| Company logo upload | Confirm logo upload endpoint, form field name, response URL, and file limits. |
| Company jobs CRUD | Confirm list/create/detail/update/delete endpoints and job payload shape. |
| Publish / pause job | Confirm whether status update uses a dedicated endpoint or generic job update. |
| Applicants by job | Confirm endpoint for `/company/jobs/:id/applicants`, filters, sort, and pagination. |
| Applicant details | Confirm applicant/application detail endpoint and whether route id is applicant id or application id. |
| Applicant status update | Confirm endpoint and allowed statuses: `new`, `under_review`, `shortlisted`, `rejected`. |
| Applicant CV download | Confirm whether the CV endpoint returns a blob, a signed URL, or metadata + download URL. |
| Rejection email behavior | Confirm whether the backend sends automated rejection email on status update or via separate endpoint. |
| Company notifications | Confirm list endpoint and mark-read / mark-all-read behavior. |
| Company messages | Confirm whether recruiter messaging is supported in this backend release. |
| Company settings | Confirm settings, password change, and company account deletion endpoints if supported. |

Frontend functions prepared in `src/api/companyApi.js`:

| Function | Backend status |
|----------|----------------|
| `getCompanyProfile()` | Pending endpoint confirmation |
| `updateCompanyProfile(payload)` | Pending endpoint confirmation |
| `getCompanyJobs()` | Pending endpoint confirmation |
| `getCompanyJobById(id)` | Pending endpoint confirmation |
| `createCompanyJob(payload)` | Pending endpoint confirmation |
| `updateCompanyJob(id, payload)` | Pending endpoint confirmation |
| `deleteCompanyJob(id)` | Pending endpoint confirmation |
| `getApplicantsByJob(jobId)` | Pending endpoint confirmation |
| `getApplicantById(id)` | Pending endpoint confirmation |
| `updateApplicantStatus(applicationId, status)` | Pending endpoint confirmation |
| `getApplicantCV(applicantId)` | Pending endpoint confirmation |

---

# Admin Backend Handoff

> **Frontend status:** Admin pages are unified under `AdminLayout` and use `src/services/adminDataService.js` with mock-only state.

Confirmed from backend notes:

| Method | Endpoint | Frontend Function |
|--------|----------|-------------------|
| `GET` | `/admin/jobs?page=1` | `adminApi.getAdminJobs(params)` |
| `DELETE` | `/admin/jobs/:id` | `adminApi.forceDeleteJob(id)` |

Please confirm the remaining endpoint paths, request payloads, response shapes, pagination format, and authorization behavior:

| Area | Backend Confirmation Needed |
|------|-----------------------------|
| Admin metrics | Confirm endpoint for total users, role counts, active jobs, applications, banned users, and reports. |
| Admin users list | Confirm users endpoint, supported filters, search query name, sort, and pagination. |
| Admin user details | Confirm detail endpoint and fields for job seeker/company/admin accounts. |
| Ban / unban user | Confirm endpoint(s), method, body, and whether actions are separate or status update. |
| Admin jobs list | Confirm filters/sort supported on `GET /admin/jobs`. |
| Admin job details | Confirm detail endpoint for `GET /admin/jobs/:id` or equivalent. |
| Force delete job | Confirm whether `DELETE /admin/jobs/:id` is soft delete, force delete, or permanent delete. |
| Activity log | Confirm endpoint, filters, event types, and pagination. |
| Admin settings | Confirm whether admin profile/settings/password endpoints are supported. |

Prepared frontend functions in `src/api/adminApi.js`:

| Function | Backend status |
|----------|----------------|
| `getAdminMetrics()` | Pending endpoint confirmation |
| `getUsers(params)` | Pending endpoint confirmation |
| `getUserById(id)` | Pending endpoint confirmation |
| `banUser(id)` | Pending endpoint confirmation |
| `unbanUser(id)` | Pending endpoint confirmation |
| `getAdminJobs(params)` | Uses confirmed `GET /admin/jobs` |
| `getAdminJobById(id)` | Pending endpoint confirmation |
| `forceDeleteJob(id)` | Uses confirmed `DELETE /admin/jobs/:id` |
| `getActivityLog(params)` | Pending endpoint confirmation |
| `updateAdminSettings(payload)` | Pending endpoint confirmation |

---

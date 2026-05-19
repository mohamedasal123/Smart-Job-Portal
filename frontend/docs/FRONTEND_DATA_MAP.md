# Frontend Data Map — Job Seeker Flow

> **Last updated:** 2026-05-08  
> **Status:** All Job Seeker pages use centralized mock data via `src/services/jobSeekerDataService.js`

## Architecture

```
Pages  →  jobSeekerDataService.js (service layer)  →  jobSeekerMockData.js (data source)
                                                       ↓
                                             (Replace with axios API calls later)
```

## Data Map

| Page | Route | Current Data Source | Expected Backend Endpoint | Notes |
|------|-------|-------------------|--------------------------|-------|
| Dashboard | `/seeker/dashboard` | `getSeekerDashboardData()` → aggregated mock | Multiple endpoints | Aggregates profile, skills, applications, recommended jobs |
| Browse Jobs | `/seeker/jobs` | `getJobs()` → `jobs` mock | `GET /api/jobs` | Search and type filter work locally |
| Recommended Jobs | `/seeker/recommended-jobs` | `getRecommendedJobs()` → `recommendedJobs` + `jobs` mock | `GET /api/jobs/recommended` | Sort and search work locally |
| Job Details | `/seeker/jobs/:jobId` | `getJobById()` → `jobs` mock | `GET /api/jobs/:id` | Apply/Save are local state; company info from `companyInfo` field |
| My Applications | `/seeker/applications` | `getApplications()` → `applications` + `jobs` mock | `GET /api/applications` | Status filter works locally |
| Application Details | `/seeker/applications/:id` | `getApplicationById()` → `applications` + `jobs` mock | `GET /api/applications/:id` | Timeline from mock data |
| Rejection Feedback | `/seeker/rejection-feedback` | `getApplications()` → `rejectionFeedback` field | `GET /api/applications/:id/feedback` | Reads from rejected app's feedback |
| Profile | `/seeker/profile` | `getProfile()` → `seekerProfile` mock | `GET /api/seeker/profile` | Ready to replace |
| Edit Profile | `/seeker/profile/edit` | `getProfile()` + `updateProfile()` | `GET/PUT /api/seeker/profile` | Validates, navigates to profile on save |
| Skills | `/seeker/skills` | `getSkills()` + `getSuggestedSkills()` | `GET /api/seeker/skills`, `GET /api/seeker/skills/suggestions` | Add/remove work locally |
| Messages | `/seeker/messages` | `getMessages()` → `messages` mock (conversation format) | `GET /api/seeker/messages` | **TBD — may be future enhancement** |
| Notifications | `/seeker/notifications` | `getNotifications()` → `notifications` mock | `GET /api/seeker/notifications` | Mark as read is local state |
| Settings | `/seeker/settings` | Local state + `updateSettings()` | `PUT /api/seeker/settings` | **Pending backend endpoint confirmation** |
| CV Upload | `/seeker/cv-upload` | Local file state + `parsedProfile` mock for live preview | `POST /cv/upload` + parsed CV response | File validation works; inline edits are local state until Confirm & Save |
| CV Parsing | `/seeker/cv-parsing` | Local progress state | Triggered by CV upload | AI parsing animation is simulated |
| CV Review | `/seeker/cv-review` | `parsedProfile` mock via `getParsedProfile()` | `GET/PUT /api/cv/parsed` | Currently unused as inline editing was moved to CV Upload page |
| Saved Jobs | `/seeker/saved-jobs` | `savedJobIds` mock via `getSavedJobs()` | TBD, likely `GET/POST/DELETE` saved jobs | Needs backend confirmation |

## Mock Data Objects

All mock data is defined in `src/data/jobSeekerMockData.js`:

| Export | Type | Used By |
|--------|------|---------|
| `currentUser` | Object | Auth context stub |
| `seekerProfile` | Object | Profile, Edit Profile, Dashboard |
| `seekerSkills` | Array of `{id, name, category, source}` | Skills, Dashboard |
| `suggestedSkills` | Array of `{name, category}` | Skills (suggestions sidebar) |
| `jobs` | Array of job objects | Browse Jobs, Job Details, Dashboard, Applications |
| `recommendedJobs` | Array of `{jobId, matchScore, matchedSkills, missingSkills}` | Recommended Jobs, Dashboard |
| `applications` | Array with `rejectionFeedback` field | Applications, App Details, Rejection Feedback |
| `notifications` | Array with `{id, type, title, message, time, read, icon}` | Notifications |
| `messages` | Array of conversation objects `{id, company, role, avatar, messages[]}` | Messages |
| `parsedProfile` | Object | CV Review |

## Pages That Are Frontend-Only / Future Enhancement

| Page | Reason |
|------|--------|
| Messages | Backend messaging endpoint TBD; may not be in MVP scope |
| Settings | Backend settings endpoint needs confirmation from backend developer |

---

# Company / Recruiter Flow Data Map

> **Last updated:** 2026-05-08  
> **Status:** Company pages use centralized mock data via `src/services/companyDataService.js`.

| Page | Current Data Source | Expected Backend Endpoint | Notes |
|------|---------------------|---------------------------|-------|
| Company Dashboard | `getCompanyDashboardData()` from `companyMockData` | Multiple endpoints: company profile, jobs, applicants | Metrics are calculated locally from connected jobs/applicants. |
| Company Profile | `getCompanyProfile()`, `getCompanyJobs({ status: "active" })` | `GET /company/profile`, `GET /company/jobs` | Endpoint path must be confirmed. |
| Edit Company Profile | `getCompanyProfile()`, `updateCompanyProfile(payload)` | `PUT/PATCH /company/profile` | Logo upload endpoint is separate and unconfirmed. |
| Company Profile Preview | `getCompanyProfile()`, active company jobs | `GET /company/profile`, `GET /company/jobs?status=active` | Public preview is frontend-only for now. |
| Manage Jobs | `getCompanyJobs(filters)`, `toggleJobStatus(id)`, `deleteCompanyJob(id)` | Company jobs CRUD endpoints | Search, status filter, sort, publish/pause, delete work locally. |
| Create Job | `createCompanyJob(payload)` | `POST /company/jobs` | Endpoint and payload shape pending confirmation. |
| Edit Job | `getCompanyJobById(id)`, `updateCompanyJob(id, payload)` | `GET/PUT /company/jobs/:id` | Required skills and responsibilities are arrays in frontend data. |
| Job Preview | `getCompanyJobById(id)`, `toggleJobStatus(id)` | `GET /company/jobs/:id`, publish/pause endpoint | Preview uses recruiter-side job data. |
| Job Details | `getCompanyJobById(id)`, `getApplicantsByJob(id)` | `GET /company/jobs/:id`, `GET /company/jobs/:id/applicants` | Average match score is calculated locally. |
| Smart ATS Applicants | `getApplicantsByJob(jobId, filters)` | `GET /company/jobs/:id/applicants` | Search/filter/sort work locally; status actions update mock state. |
| Applicant Profile | `getApplicantById(id)`, `updateApplicantStatus(applicationId, status)` | `GET /company/applicants/:id`, status update endpoint | Uses connected applicant/job data. |
| Applicant CV Viewer | `getApplicantCV(applicantId)` | Applicant CV download endpoint | TODO: replace mock CV preview with real blob/signed URL response. |
| Applicant Matching Details | `getApplicantById(id)`, related job from `getCompanyJobById(jobId)` | Applicant detail + job detail endpoints | Recommendation is derived from match score. |
| Company Notifications | `getCompanyNotifications(filters)`, `markAllNotificationsRead()` | Company notifications endpoint | Filters and mark-all-read are local. |
| Company Messages | `getCompanyMessages(filters)` | Company messages endpoint if supported | Search and read/unread filters are local. |
| Company Settings | Local component state | Settings/password/account endpoints | Save/delete account are mock-only until backend confirmation. |

---

# Admin Flow Data Map

> **Last updated:** 2026-05-08  
> **Status:** Admin pages use centralized mock data via `src/services/adminDataService.js`.

| Page | Current Data Source | Expected Backend Endpoint | Notes |
|------|---------------------|---------------------------|-------|
| Admin Dashboard | `getAdminDashboardData()` from `adminMockData` | Admin metrics, users, jobs, activity endpoints | Metrics are calculated locally from connected users/jobs. |
| Users Management | `getAdminUsers(filters)` | Admin users list endpoint | Search, role/status/verification filters, and sort work locally. |
| Admin User Details | `getAdminUserById(id)`, `banUser(id)`, `unbanUser(id)` | Admin user details + ban/unban endpoints | Company active jobs are calculated from jobs referencing the company user id. |
| Jobs Management | `getAdminJobs(filters)`, `forceDeleteJob(id)` | Confirmed list: `GET /admin/jobs?page=1`; confirmed delete: `DELETE /admin/jobs/:id` | Search, status/reported filters, sort, and mock force-delete work locally. |
| Admin Job Details | `getAdminJobById(id)`, `forceDeleteJob(id)` | Admin job details endpoint, `DELETE /admin/jobs/:id` | Force delete marks mock job as deleted. |
| Activity Log | `getActivityLog(filters)` | Activity log endpoint | Search/filter and details drawer work locally. |
| Admin Settings | `getAdminSettings()`, `updateAdminSettings(payload)` | Admin settings endpoint if supported | Controlled form with mock persistence and validation. |

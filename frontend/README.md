# Smart Job Portal

Smart Job Portal is a modern, responsive web application for job seekers, recruiters, and administrators. It connects exceptional talent with top opportunities using data-driven intelligence.

## Tech Stack
- **Frontend:** React 19, Vite 8, Tailwind CSS
- **Routing:** React Router v7
- **State Management:** React Context API
- **Backend (API):** Laravel 12
- **Authentication:** Laravel Sanctum (Session-based cookie auth)

## Main Features
- **Public Portal:** Browse active jobs, view companies, check salary guides, FAQs, and contact support.
- **Job Seekers:** Manage profiles, upload and parse CVs, track applications, and view recommended jobs.
- **Companies (Recruiters):** Post and manage jobs, track applicants, and update company profiles.
- **Admins:** View analytics, manage users, and moderate job postings.

## User Roles
The application supports three distinct roles:
1. `job_seeker` - Can apply for jobs and manage their resume.
2. `company` - Can post jobs and review applicants.
3. `admin` - Has platform-wide moderation privileges.

## Folder Structure
```
src/
├── api/          # Axios instances and API service modules
├── components/   # Reusable UI components (Modals, Toasts, Route Guards)
├── context/      # Global state context (AuthContext)
├── hooks/        # Custom React hooks
├── i18n/         # Internationalization setup (English default)
├── locales/      # Translation files
├── pages/        # Route components grouped by domain (auth, public, jobSeeker, company, admin)
├── utils/        # Helper functions, constants, validation
└── main.jsx      # Application entry point
```

## Setup Instructions

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure the following variables in `.env`:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   VITE_BACKEND_BASE_URL=http://127.0.0.1:8000
   VITE_USE_MOCK_API=false
   ```

### Installation
Run the following command to install dependencies:
```bash
npm install
```

### Development Server
Start the local development server:
```bash
npm run dev
```

Use Node `20.19+` or `22.12+`. The Laravel backend must run on `127.0.0.1:8000` and the React dev server on `127.0.0.1:5173` unless you update both frontend and backend environment files.

### Developer Preview Mode
Preview mode is for frontend UI testing only and must be disabled before production.

If you need to test protected frontend layouts without a working backend, enable the preview mode in `.env`:
```
VITE_FRONTEND_PREVIEW_MODE=true
```
This will display a set of developer buttons on the Login page allowing you to instantly bypass authentication and simulate a session as a Job Seeker, Company, or Admin.

### Production Build
To create an optimized production build:
```bash
npm run build
```

## API Integration & Authentication
The frontend connects to a Laravel 12 backend using Laravel Sanctum for session-based authentication.

### Authentication Flow
1. **CSRF Initialization:** The frontend first sends a `GET /sanctum/csrf-cookie` request to the backend to initialize CSRF protection.
2. **Login Request:** The frontend sends a `POST /auth/login` request with email and password. Requests include `withCredentials: true` to persist cookies.
3. **Session:** No bearer token is stored on the client. The session is maintained via HTTP-only cookies.
4. **Current User:** The `GET /auth/me` endpoint restores the user session on page load.

## Known Backend Requirements
- The backend must have properly configured CORS settings to allow requests from the frontend domain (e.g., `http://localhost:5173`).
- `withCredentials: true` is required for all Axios requests.

## Test/Verification Checklist
- [x] Application builds successfully without errors.
- [x] Form inputs are controlled and validate correctly.
- [x] Login strictly relies on real API responses (simulated API removed).
- [x] Incorrect login properly handles 401 errors and displays error messages.
- [x] Registration correctly maps the UI role (`recruiter`) to the backend format (`company`).

## Current Status
The UI is fully implemented with interactive state management. The authentication layer is configured for Laravel Sanctum, and several pages simulate backend endpoints while waiting for API finalization. 

## Future Enhancements
- **Full API Integration:** Replace remaining simulated timeouts with the final backend endpoints (see `docs/API_ENDPOINTS.md`).
- **Dark Mode:** Expand the Tailwind setup to include a fully functional dark theme.
- **Arabic Localization:** Fully implement RTL support and Arabic language strings via `react-i18next`.

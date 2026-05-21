export const PRODUCT_NAME = 'Smart Job Portal';

export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  COMPANIES: '/companies',
  SALARIES: '/salaries',
  SALARY_GUIDE: '/salaries',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN: '/login',
  REGISTER: '/register',
  POST_JOB: '/company/jobs/create',
  UNAUTHORIZED: '/403',
  SEEKER_DASHBOARD: '/seeker/dashboard',
  SEEKER_JOBS: '/seeker/jobs',
  SEEKER_RECOMMENDED_JOBS: '/seeker/recommended-jobs',
  SEEKER_SAVED_JOBS: '/seeker/saved-jobs',
  SEEKER_APPLICATIONS: '/seeker/applications',
  SEEKER_PROFILE: '/seeker/profile',
  SEEKER_SKILLS: '/seeker/skills',
  SEEKER_MESSAGES: '/seeker/messages',
  SEEKER_NOTIFICATIONS: '/seeker/notifications',
  SEEKER_SETTINGS: '/seeker/settings',
  SEEKER_PROFILE_EDIT: '/seeker/profile/edit',
  SEEKER_CV_UPLOAD: '/seeker/cv-upload',
  SEEKER_CV_PARSING: '/seeker/cv-parsing',
  SEEKER_CV_REVIEW: '/seeker/cv-review',
  SEEKER_REJECTION_FEEDBACK: '/seeker/applications/:applicationId/rejection-feedback',
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_JOBS: '/company/jobs',
  COMPANY_CREATE_JOB: '/company/jobs/create',
  // There is no global "all applicants" page — applicants live per-job. Sidebar
  // and dashboard CTAs that point at "applicants" route the user to the manage-
  // jobs page so they can pick a job and drill in. Use buildCompanyApplicantsPath
  // when you have a real jobId.
  COMPANY_APPLICANTS: '/company/jobs',
  COMPANY_APPLICANTS_TEMPLATE: '/company/jobs/:jobId/applicants',
  COMPANY_MESSAGES: '/company/messages',
  COMPANY_PROFILE: '/company/profile',
  COMPANY_NOTIFICATIONS: '/company/notifications',
  COMPANY_SETTINGS: '/company/settings',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_ACTIVITY_LOG: '/admin/activity-log',
  ADMIN_SETTINGS: '/admin/settings',
};

export const USER_ROLES = {
  JOB_SEEKER: 'job_seeker',
  COMPANY: 'company',
  ADMIN: 'admin',
};

export const ROLE_LABEL_KEYS = {
  [USER_ROLES.JOB_SEEKER]: 'roles.jobSeeker',
  [USER_ROLES.COMPANY]: 'roles.company',
  [USER_ROLES.ADMIN]: 'roles.admin',
};

export const ROLE_ALIASES = {
  seeker: USER_ROLES.JOB_SEEKER,
  jobseeker: USER_ROLES.JOB_SEEKER,
  job_seeker: USER_ROLES.JOB_SEEKER,
  candidate: USER_ROLES.JOB_SEEKER,
  employer: USER_ROLES.COMPANY,
  company: USER_ROLES.COMPANY,
  admin: USER_ROLES.ADMIN,
};

export const ROLE_REDIRECTS = {
  [USER_ROLES.JOB_SEEKER]: ROUTES.SEEKER_DASHBOARD,
  [USER_ROLES.COMPANY]: ROUTES.COMPANY_DASHBOARD,
  [USER_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

export const normalizeRole = (role) => {
  if (!role) return null;

  const key = String(role).trim().toLowerCase();
  return ROLE_ALIASES[key] || key;
};

export const getRoleRedirect = (role) => ROLE_REDIRECTS[normalizeRole(role)] || ROUTES.HOME;

/**
 * Build the URL for a specific job's applicants list.
 * Use this whenever you have a real jobId; do NOT concatenate ROUTES.COMPANY_APPLICANTS
 * with the id, because COMPANY_APPLICANTS intentionally points at the manage-jobs page.
 */
export const buildCompanyApplicantsPath = (jobId) => `/company/jobs/${jobId}/applicants`;

export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
};

export const APPLICATION_STATUS_LABEL_KEYS = {
  [APPLICATION_STATUSES.APPLIED]: 'statuses.application.applied',
  [APPLICATION_STATUSES.UNDER_REVIEW]: 'statuses.application.underReview',
  [APPLICATION_STATUSES.SHORTLISTED]: 'statuses.application.shortlisted',
  [APPLICATION_STATUSES.REJECTED]: 'statuses.application.rejected',
};

export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
};

export const JOB_TYPE_LABEL_KEYS = {
  [JOB_TYPES.FULL_TIME]: 'jobTypes.fullTime',
  [JOB_TYPES.PART_TIME]: 'jobTypes.partTime',
  [JOB_TYPES.CONTRACT]: 'jobTypes.contract',
  [JOB_TYPES.INTERNSHIP]: 'jobTypes.internship',
  [JOB_TYPES.REMOTE]: 'jobTypes.remote',
};

export const NAV_ITEMS = [
  { to: ROUTES.JOBS, labelKey: 'nav.findJobs' },
  { to: ROUTES.COMPANIES, labelKey: 'nav.companies' },
  { to: ROUTES.SALARY_GUIDE, labelKey: 'nav.salaryGuide' },
];

export const SIDEBAR_ITEMS = {
  seeker: [
    { href: ROUTES.SEEKER_DASHBOARD, labelKey: 'sidebar.dashboard' },
    { href: ROUTES.SEEKER_JOBS, labelKey: 'sidebar.jobs' },
    { href: ROUTES.SEEKER_RECOMMENDED_JOBS, labelKey: 'sidebar.recommendedJobs' },
    { href: ROUTES.SEEKER_APPLICATIONS, labelKey: 'sidebar.applications' },
    { href: ROUTES.SEEKER_PROFILE, labelKey: 'sidebar.profile' },
    { href: ROUTES.SEEKER_SKILLS, labelKey: 'sidebar.skills' },
    { href: ROUTES.SEEKER_MESSAGES, labelKey: 'sidebar.messages' },
    { href: ROUTES.SEEKER_NOTIFICATIONS, labelKey: 'sidebar.notifications' },
    { href: ROUTES.SEEKER_SETTINGS, labelKey: 'sidebar.settings' },
  ],
  company: [
    { href: ROUTES.COMPANY_DASHBOARD, labelKey: 'sidebar.dashboard' },
    { href: ROUTES.COMPANY_JOBS, labelKey: 'sidebar.manageJobs' },
    { href: ROUTES.COMPANY_CREATE_JOB, labelKey: 'sidebar.createJob' },
    { href: ROUTES.COMPANY_APPLICANTS, labelKey: 'sidebar.applicants' },
    { href: ROUTES.COMPANY_MESSAGES, labelKey: 'sidebar.messages' },
    { href: ROUTES.COMPANY_PROFILE, labelKey: 'sidebar.companyProfile' },
    { href: ROUTES.COMPANY_NOTIFICATIONS, labelKey: 'sidebar.notifications' },
    { href: ROUTES.COMPANY_SETTINGS, labelKey: 'sidebar.settings' },
  ],
  admin: [
    { href: ROUTES.ADMIN_DASHBOARD, labelKey: 'sidebar.dashboard' },
    { href: ROUTES.ADMIN_USERS, labelKey: 'sidebar.users' },
    { href: ROUTES.ADMIN_JOBS, labelKey: 'sidebar.jobs' },
    { href: ROUTES.ADMIN_ACTIVITY_LOG, labelKey: 'sidebar.activityLog' },
    { href: ROUTES.ADMIN_SETTINGS, labelKey: 'sidebar.settings' },
  ],
};

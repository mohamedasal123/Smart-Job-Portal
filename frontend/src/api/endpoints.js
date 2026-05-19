const withId = (path, key, value) => path.replace(`:${key}`, encodeURIComponent(value));

export const ENDPOINTS = {
  auth: {
    register:           '/auth/register',
    login:              '/auth/login',
    verifyEmail:        '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword:     '/auth/forgot-password',
    resetPassword:      '/auth/reset-password',
    me:                 '/auth/me',
    logout:             '/auth/logout',
  },
  // Public (unauthenticated) job browsing
  publicJobs: {
    list:   '/public/jobs',
    detail: (jobId) => withId('/public/jobs/:jobId', 'jobId', jobId),
  },
  // Authenticated job browsing / recommendation
  jobs: {
    list:        '/jobs',
    detail:      (jobId) => withId('/jobs/:jobId', 'jobId', jobId),
    recommended: '/seeker/jobs/recommended',
  },
  skills: {
    list: '/skills',
  },
  profile: {
    me: '/profile',
  },
  cv: {
    upload: '/cv/upload',
    status: '/cv/status',
    parsed: '/cv/parsed',
  },
  seekerSkills: {
    add:    '/seeker/skills',
    remove: (skillId) => withId('/seeker/skills/:skillId', 'skillId', skillId),
  },
  savedJobs: {
    list:    '/seeker/saved-jobs',
    save:    (jobId) => withId('/seeker/saved-jobs/:jobId', 'jobId', jobId),
    unsave:  (jobId) => withId('/seeker/saved-jobs/:jobId', 'jobId', jobId),
  },
  applications: {
    list:   '/applications',
    create: '/applications',
    detail: (applicationId) =>
      withId('/applications/:applicationId', 'applicationId', applicationId),
  },
  company: {
    dashboard:      '/company/dashboard',
    profile:        '/company/profile',
    logo:           '/company/profile/logo',
    jobs:           '/company/jobs',
    jobDetail:      (jobId) => withId('/company/jobs/:jobId', 'jobId', jobId),
    toggleJob:      (jobId) => withId('/company/jobs/:jobId/toggle', 'jobId', jobId),
    jobApplicants:  (jobId) => withId('/company/jobs/:jobId/applicants', 'jobId', jobId),
    applicantDetail: (applicationId) =>
      withId('/company/applicants/:applicationId', 'applicationId', applicationId),
    applicantCv:    (applicationId) =>
      withId('/company/applicants/:applicationId/cv', 'applicationId', applicationId),
    applicantStatus: (applicationId) =>
      withId('/company/applicants/:applicationId/status', 'applicationId', applicationId),
  },
  admin: {
    stats:          '/admin/stats',
    users:          '/admin/users',
    userDetail:     (userId) => withId('/admin/users/:userId', 'userId', userId),
    toggleUserBan:  (userId) => withId('/admin/users/:userId/ban', 'userId', userId),
    jobs:           '/admin/jobs',
    forceDeleteJob: (jobId) => withId('/admin/jobs/:jobId', 'jobId', jobId),
  },
  // Public company browsing
  publicCompanies: {
    list:   '/public/companies',
    detail: (companyId) => withId('/public/companies/:companyId', 'companyId', companyId),
  },
};

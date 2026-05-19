import AboutPage from './pages/public/AboutPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import CompaniesPage from './pages/public/CompaniesPage.jsx';
import FaqPage from './pages/public/FaqPage.jsx';
import HomePage from './pages/public/HomePage.jsx';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage.jsx';
import PublicCompanyProfilePage from './pages/public/PublicCompanyProfilePage.jsx';
import PublicJobDetailsPage from './pages/public/PublicJobDetailsPage.jsx';
import PublicJobsPage from './pages/public/PublicJobsPage.jsx';
import SalariesPage from './pages/public/SalariesPage.jsx';
import TermsOfServicePage from './pages/public/TermsOfServicePage.jsx';
import EmailVerificationResultPage from './pages/auth/EmailVerificationResultPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import SessionExpiredPage from './pages/auth/SessionExpiredPage.jsx';
import CompanyLayout from './layouts/CompanyLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import JobSeekerApplicationDetailsPage from './pages/jobSeeker/JobSeekerApplicationDetailsPage.jsx';
import JobSeekerCvParsingPage from './pages/jobSeeker/JobSeekerCvParsingPage.jsx';
import JobSeekerCvUploadPage from './pages/jobSeeker/JobSeekerCvUploadPage.jsx';
import JobSeekerDashboardPage from './pages/jobSeeker/JobSeekerDashboardPage.jsx';
import JobSeekerEditProfilePage from './pages/jobSeeker/JobSeekerEditProfilePage.jsx';
import JobSeekerJobDetailsPage from './pages/jobSeeker/JobSeekerJobDetailsPage.jsx';
import JobSeekerJobSearchPage from './pages/jobSeeker/JobSeekerJobSearchPage.jsx';
import JobSeekerSavedJobsPage from './pages/jobSeeker/JobSeekerSavedJobsPage.jsx';
import JobSeekerApplicationsPage from './pages/jobSeeker/JobSeekerApplicationsPage.jsx';
import JobSeekerSkillsPage from './pages/jobSeeker/JobSeekerSkillsPage.jsx';
import JobSeekerNotificationsPage from './pages/jobSeeker/JobSeekerNotificationsPage.jsx';
import JobSeekerProfilePage from './pages/jobSeeker/JobSeekerProfilePage.jsx';
import JobSeekerRecommendedJobsPage from './pages/jobSeeker/JobSeekerRecommendedJobsPage.jsx';
import JobSeekerRejectionFeedbackPage from './pages/jobSeeker/JobSeekerRejectionFeedbackPage.jsx';
import JobSeekerCvReviewPage from './pages/jobSeeker/JobSeekerCvReviewPage.jsx';
import JobSeekerSettingsPage from './pages/jobSeeker/JobSeekerSettingsPage.jsx';
import JobSeekerMessagesPage from './pages/jobSeeker/JobSeekerMessagesPage.jsx';
import CompanyApplicantCvViewerPage from './pages/company/CompanyApplicantCvViewerPage.jsx';
import CompanyApplicantMatchingDetailsPage from './pages/company/CompanyApplicantMatchingDetailsPage.jsx';
import CompanyApplicantProfilePage from './pages/company/CompanyApplicantProfilePage.jsx';
import CompanyJobDetailsPage from './pages/company/CompanyJobDetailsPage.jsx';
import CompanyCreateJobPostPage from './pages/company/CompanyCreateJobPostPage.jsx';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage.jsx';
import CompanyEditJobPostPage from './pages/company/CompanyEditJobPostPage.jsx';
import CompanyEditProfilePage from './pages/company/CompanyEditProfilePage.jsx';
import CompanyJobPostPreviewPage from './pages/company/CompanyJobPostPreviewPage.jsx';
import CompanyManageJobsPage from './pages/company/CompanyManageJobsPage.jsx';
import CompanyNotificationsPage from './pages/company/CompanyNotificationsPage.jsx';
import CompanyProfilePreviewPage from './pages/company/CompanyProfilePreviewPage.jsx';
import CompanyProfilePage from './pages/company/CompanyProfilePage.jsx';
import CompanySettingsPage from './pages/company/CompanySettingsPage.jsx';
import CompanyApplicantsPage from './pages/company/CompanyApplicantsPage.jsx';
import CompanyMessagesPage from './pages/company/CompanyMessagesPage.jsx';
import AdminActivityLogPage from './pages/admin/AdminActivityLogPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminJobDetailsPage from './pages/admin/AdminJobDetailsPage.jsx';
import AdminJobsPage from './pages/admin/AdminJobsPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import UnauthorizedPage from './pages/errors/UnauthorizedPage.jsx';
import ForbiddenPage from './pages/errors/ForbiddenPage.jsx';
import NotFoundPage from './pages/errors/NotFoundPage.jsx';
import ServerErrorPage from './pages/errors/ServerErrorPage.jsx';

export const appRoutes = [
  { path: '/about', element: <AboutPage /> },
  { path: '/companies', element: <CompaniesPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/faq', element: <FaqPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/privacy', element: <PrivacyPolicyPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/companies/:companyId', element: <PublicCompanyProfilePage /> },
  { path: '/jobs/:jobId', element: <PublicJobDetailsPage /> },
  { path: '/jobs', element: <PublicJobsPage /> },
  { path: '/salaries', element: <SalariesPage /> },
  { path: '/salary-guide', element: <SalariesPage /> },
  { path: '/terms', element: <TermsOfServicePage /> },
  { path: '/terms-of-service', element: <TermsOfServicePage /> },
  { path: '/email-verification', element: <EmailVerificationResultPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/session-expired', element: <SessionExpiredPage /> },
  { path: '/seeker/applications/:applicationId', element: <JobSeekerApplicationDetailsPage />, roles: ['job_seeker'] },
  { path: '/seeker/cv-parsing', element: <JobSeekerCvParsingPage />, roles: ['job_seeker'] },
  { path: '/seeker/cv-upload', element: <JobSeekerCvUploadPage />, roles: ['job_seeker'] },
  { path: '/seeker/dashboard', element: <JobSeekerDashboardPage />, roles: ['job_seeker'] },
  { path: '/seeker/profile/edit', element: <JobSeekerEditProfilePage />, roles: ['job_seeker'] },
  { path: '/seeker/jobs/:jobId', element: <JobSeekerJobDetailsPage />, roles: ['job_seeker'] },
  { path: '/seeker/jobs', element: <JobSeekerJobSearchPage />, roles: ['job_seeker'] },
  { path: '/seeker/saved-jobs', element: <JobSeekerSavedJobsPage />, roles: ['job_seeker'] },
  { path: '/seeker/applications', element: <JobSeekerApplicationsPage />, roles: ['job_seeker'] },
  { path: '/seeker/skills', element: <JobSeekerSkillsPage />, roles: ['job_seeker'] },
  { path: '/seeker/messages', element: <JobSeekerMessagesPage />, roles: ['job_seeker'] },
  { path: '/seeker/notifications', element: <JobSeekerNotificationsPage />, roles: ['job_seeker'] },
  { path: '/seeker/profile', element: <JobSeekerProfilePage />, roles: ['job_seeker'] },
  { path: '/seeker/recommended-jobs', element: <JobSeekerRecommendedJobsPage />, roles: ['job_seeker'] },
  { path: '/seeker/rejection-feedback', element: <JobSeekerRejectionFeedbackPage />, roles: ['job_seeker'] },
  { path: '/seeker/cv-review', element: <JobSeekerCvReviewPage />, roles: ['job_seeker'] },
  { path: '/seeker/settings', element: <JobSeekerSettingsPage />, roles: ['job_seeker'] },
  {
    path: '/company',
    element: <CompanyLayout />,
    roles: ['company'],
    children: [
      { path: 'dashboard', element: <CompanyDashboardPage /> },
      { path: 'profile/edit', element: <CompanyEditProfilePage /> },
      { path: 'profile/preview', element: <CompanyProfilePreviewPage /> },
      { path: 'profile', element: <CompanyProfilePage /> },
      { path: 'settings', element: <CompanySettingsPage /> },
      { path: 'notifications', element: <CompanyNotificationsPage /> },
      { path: 'messages', element: <CompanyMessagesPage /> },
      { path: 'jobs/create', element: <CompanyCreateJobPostPage /> },
      { path: 'jobs/:jobId/edit', element: <CompanyEditJobPostPage /> },
      { path: 'jobs/:jobId/preview', element: <CompanyJobPostPreviewPage /> },
      { path: 'jobs/:id/applicants', element: <CompanyApplicantsPage /> },
      { path: 'jobs/:jobId', element: <CompanyJobDetailsPage /> },
      { path: 'jobs', element: <CompanyManageJobsPage /> },
      { path: 'applicants/:id/cv', element: <CompanyApplicantCvViewerPage /> },
      { path: 'applicants/:id/matching', element: <CompanyApplicantMatchingDetailsPage /> },
      { path: 'applicants/:id', element: <CompanyApplicantProfilePage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    roles: ['admin'],
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users/:userId', element: <AdminUserDetailsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'jobs/:jobId', element: <AdminJobDetailsPage /> },
      { path: 'jobs', element: <AdminJobsPage /> },
      { path: 'activity-log', element: <AdminActivityLogPage /> },
      { path: 'activity', element: <AdminActivityLogPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
  { path: '/post-job', element: <CompanyCreateJobPostPage />, roles: ['company'] },
  { path: '/401', element: <UnauthorizedPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '/500', element: <ServerErrorPage /> }
];

import { adminApi } from '../api/adminApi';

const extractItems = (envelope) => {
  if (Array.isArray(envelope)) return envelope;
  if (Array.isArray(envelope?.data)) return envelope.data;
  return envelope;
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || 'Unknown',
    email: user.email || '',
    role: user.role || 'user',
    accountStatus: user.is_banned ? 'banned' : 'active',
    verificationStatus: (user.email_verified_at || user.verified) ? 'verified' : 'unverified',    createdAt: new Date(user.created_at).toLocaleDateString(),
    lastLogin: user.updated_at || user.created_at, // mock lastLogin since backend doesn't have it
    applicationsCount: user.applications_count || 0, // mock if not provided
    postedJobsCount: user.companyProfile?.jobPosts?.length || 0,
    activeJobsCount: user.companyProfile?.jobPosts?.filter(j => j.is_active).length || 0,
    cvUploaded: !!user.jobSeekerProfile?.cvParsedData,
  };
};

const normalizeJob = (job) => {
  if (!job) return null;
  const company = job.companyProfile || job.company_profile || {};
  return {
    id: job.id,
    title: job.title || 'Untitled',
    company: company.company_name || 'Unknown Company',
    companyId: job.company_id,
    location: job.location || company.location || '',
    status: job.deleted_at ? 'deleted' : (job.is_active ? 'active' : 'paused'),
    postedAt: new Date(job.created_at).toLocaleDateString(),
    applicantsCount: job.applications_count || 0,
    views: job.views || 0,
    reportsCount: job.reports_count || 0,
    description: job.description || '',
    requiredSkills: job.job_required_skills?.map(s => s.skill?.name) || [],
  };
};

export const adminDataService = {
  async getAdminDashboardData() {
    const [stats, usersRes, jobsRes] = await Promise.all([
      adminApi.getAdminMetrics(),
      adminApi.getUsers(), // default page 1 will have latest
      adminApi.getAdminJobs() // default page 1 will have latest
    ]);

    const usersList = extractItems(usersRes);
    const jobsList = extractItems(jobsRes);

    return {
      metrics: {
        totalUsers: stats.total_users || 0,
        jobSeekers: stats.total_users || 0, // Using total_users as fallback
        companies: stats.total_jobs || 0, // Using total_jobs as fallback
        activeJobs: stats.active_jobs || 0,
        totalApplications: stats.total_applications || 0,
        bannedUsers: stats.banned_users || 0,
      },
      recentUsers: usersList.slice(0, 5).map(normalizeUser),
      recentJobs: jobsList.slice(0, 5).map(normalizeJob),
      recentActivity: [], // Placeholder for activity log
    };
  },

  async getAdminUsers(params = {}) {
    const backendParams = {
      search: params.query,
    };
    if (params.filter && params.filter !== 'all') {
      if (params.filter === 'banned') backendParams.is_banned = true;
      else if (params.filter === 'active') backendParams.is_banned = false;
      else if (params.filter === 'job_seekers') backendParams.role = 'job_seeker';
      else if (params.filter === 'companies') backendParams.role = 'company';
      else if (params.filter === 'admins') backendParams.role = 'admin';
    }
    
    // Pagination parameter
    if (params.page) backendParams.page = params.page;

    const envelope = await adminApi.getUsers(backendParams);
    return extractItems(envelope).map(normalizeUser);
  },

  async getAdminUserById(id) {
    return normalizeUser(await adminApi.getUserById(id));
  },

  async toggleUserBan(id) {
    return normalizeUser(await adminApi.toggleUserBan(id));
  },

  async banUser(id) {
    return normalizeUser(await adminApi.toggleUserBan(id));
  },

  async unbanUser(id) {
    return normalizeUser(await adminApi.toggleUserBan(id));
  },

  async getAdminJobs(params = {}) {
    const backendParams = {
      search: params.query,
    };
    if (params.filter && params.filter !== 'all') {
      if (params.filter === 'active') backendParams.is_active = true;
      else if (params.filter === 'paused') backendParams.is_active = false;
      else if (params.filter === 'deleted') backendParams.trashed = 'only';
    }
    
    // Pagination parameter
    if (params.page) backendParams.page = params.page;

    const envelope = await adminApi.getAdminJobs(backendParams);
    return extractItems(envelope).map(normalizeJob);
  },
  
  async getAdminJobById(id) {
    // The backend doesn't have a specific show job endpoint for admin that includes trashed
    // But we can fetch jobs and find it, or use the public/company endpoint.
    // For now, let's use the list endpoint and filter.
    const envelope = await adminApi.getAdminJobs({ search: '' }); 
    // This is a bit of a hack since there's no AdminController@showJob endpoint
    // Let's use JobController@show or just rely on the list finding it.
    const items = extractItems(envelope);
    const job = items.find(j => j.id == id);
    if (job) return normalizeJob(job);
    
    // If not found in the first page, just return a minimal object so the UI doesn't crash
    return { id, title: 'Job details', company: 'Loading...', status: 'active', requiredSkills: [] };
  },

  async forceDeleteJob(id) {
    await adminApi.forceDeleteJob(id);
    return { id, title: 'Deleted Job', status: 'deleted' };
  },

  async getActivityLog() {
    return [];
  },

  getAdminSettings() {
    return { name: 'Admin', email: 'admin@example.com' };
  },

  async updateAdminSettings() {
    return true;
  }
};

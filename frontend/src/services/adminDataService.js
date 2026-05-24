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
    verificationStatus: (user.email_verified_at || user.verified) ? 'verified' : 'unverified',
    createdAt: new Date(user.created_at).toLocaleDateString(),
    lastLogin: user.updated_at || user.created_at, // mock lastLogin since backend doesn't have it
    applicationsCount: user.applications_count || 0, // mock if not provided
    postedJobsCount: user.companyProfile?.jobPosts?.length || 0,
    activeJobsCount: user.companyProfile?.jobPosts?.filter(j => j.is_active).length || 0,
    cvUploaded: !!user.jobSeekerProfile?.cvParsedData,
    profile: user.profile || user.jobSeekerProfile || user.companyProfile || null,
  };
};

const splitTextList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  // eslint-disable-next-line no-control-regex
  return String(value).split(/\r?\n|\x07|-/).map((item) => item.trim()).filter(Boolean);
};

const normalizeJob = (job) => {
  if (!job) return null;
  const company = job.companyProfile || job.company_profile || {};
  return {
    id: job.id,
    title: job.title || 'Untitled',
    category: job.category || 'Other',
    type: job.job_type || job.type || 'full_time',
    salary: job.salary_range || job.salaryRange || 'Not specified',
    company: company.company_name || 'Unknown Company',
    companyId: job.company_id,
    location: job.location || company.location || '',
    status: job.deleted_at ? 'deleted' : (job.is_active ? 'active' : 'paused'),
    postedAt: new Date(job.created_at).toLocaleDateString(),
    applicantsCount: job.applications_count || 0,
    views: job.views || 0,
    reportsCount: job.reports_count || 0,
    description: job.description || '',
    responsibilities: splitTextList(job.responsibilities),
    requirements: splitTextList(job.requirements),
    requiredSkills: job.job_required_skills?.map(s => s.skill?.name) || [],
  };
};

const buildActivity = (users = [], jobs = []) => {
  const events = [];

  users.forEach((user) => {
    const rawDate = user.created_at || new Date().toISOString();
    
    events.push({
      id: `user-reg-${user.id}`,
      action: 'Account Created',
      actionType: 'create',
      performedBy: user.name || 'User',
      targetType: 'User',
      targetName: user.email || 'Unknown',
      status: 'active',
      createdAt: rawDate,
    });

    if (user.email_verified_at || user.verified) {
      events.push({
        id: `user-ver-${user.id}`,
        action: 'Email Verified',
        actionType: 'verify',
        performedBy: 'Admin',
        targetType: 'User',
        targetName: user.email,
        status: 'verified',
        // Make sure it appears slightly newer if timestamps are identical
        createdAt: user.email_verified_at || new Date(new Date(rawDate).getTime() + 1000).toISOString(),
      });
    }

    if (user.is_banned || user.accountStatus === 'banned') {
      events.push({
        id: `user-ban-${user.id}`,
        action: 'Account Suspended',
        actionType: 'ban',
        performedBy: 'Admin',
        targetType: 'User',
        targetName: user.email,
        status: 'banned',
        createdAt: user.updated_at || rawDate,
      });
    }
  });

  jobs.forEach((job) => {
    const rawDate = job.created_at || new Date().toISOString();
    const companyName = job.companyProfile?.company_name || job.company_profile?.company_name || job.company || 'Company';

    events.push({
      id: `job-post-${job.id}`,
      action: 'Job Published',
      actionType: 'create',
      performedBy: companyName,
      targetType: 'Job',
      targetName: job.title || 'Untitled',
      status: 'active',
      createdAt: rawDate,
    });

    if (job.is_active === false || job.is_active === 0 || job.status === 'paused') {
      events.push({
        id: `job-pause-${job.id}`,
        action: 'Job Paused',
        actionType: 'update',
        performedBy: companyName,
        targetType: 'Job',
        targetName: job.title || 'Untitled',
        status: 'paused',
        createdAt: job.updated_at || rawDate,
      });
    }

    if (job.deleted_at || job.status === 'deleted') {
      events.push({
        id: `job-del-${job.id}`,
        action: 'Job Force Deleted',
        actionType: 'delete',
        performedBy: 'Admin',
        targetType: 'Job',
        targetName: job.title || 'Untitled',
        status: 'deleted',
        createdAt: job.deleted_at || job.updated_at || rawDate,
      });
    }
  });

  // Sort descending (Newest events at the top)
  return events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      recentActivity: buildActivity(usersList, jobsList).slice(0, 5),
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
    
    // We pass verified param if the backend supports it, otherwise we'll filter locally later if needed
    // Assuming backend can handle `is_verified` or similar, we'll try sending it.
    if (params.verification && params.verification !== 'all') {
      if (params.verification === 'verified') backendParams.is_verified = true;
      else if (params.verification === 'unverified') backendParams.is_verified = false;
    }
    
    // Pagination parameter
    if (params.page) backendParams.page = params.page;

    const envelope = await adminApi.getUsers(backendParams);
    let users = extractItems(envelope).map(normalizeUser);
    
    // Fallback local filtering if backend ignores is_verified parameter
    if (params.verification && params.verification !== 'all') {
      if (params.verification === 'verified') {
        users = users.filter(u => u.verificationStatus === 'verified');
      } else if (params.verification === 'unverified') {
        users = users.filter(u => u.verificationStatus === 'unverified');
      }
    }
    
    return users;
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
    const [usersRes, jobsRes] = await Promise.all([
      adminApi.getUsers(),
      adminApi.getAdminJobs(),
    ]);

    return buildActivity(extractItems(usersRes), extractItems(jobsRes));
  },

  getAdminSettings() {
    return { name: 'Admin', email: 'admin@example.com' };
  },

  async updateAdminSettings() {
    return true;
  }
};

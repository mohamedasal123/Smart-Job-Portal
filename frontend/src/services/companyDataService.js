import { companyApi } from '../api/companyApi';

const normalizeJob = (j) => {
  if (!j) return null;
  let job = j;
  while (
    job &&
    typeof job === 'object' &&
    !Array.isArray(job) &&
    'data' in job &&
    !('id' in job)
  ) {
    job = job.data;
  }

  return {
    id: job.id,
    title: job.title || 'Untitled',
    category: job.category || '',
    description: job.description || '',
    responsibilities: Array.isArray(job.responsibilities) 
      ? job.responsibilities 
      : (job.responsibilities ? job.responsibilities.split('\n') : []),
    location: job.location || '',
    type: job.job_type || 'full_time',
    workMode: job.work_mode || 'Hybrid',
    salaryMin: job.salary_min ?? (job.salary_range ? parseInt(job.salary_range.split('-')[0]) || 90000 : 90000),
    salaryMax: job.salary_max ?? (job.salary_range && job.salary_range.split('-')[1] ? parseInt(job.salary_range.split('-')[1]) || 130000 : 130000),
    status: job.status || (job.is_active ? 'active' : 'paused'),
    requiredSkills: job.job_required_skills?.map(s => s.skill?.name).filter(Boolean) || [],
    applicationsCount: job.applications_count || 0,
    views: job.views || 0,
    experienceLevel: job.experience_level || 'Mid-Senior',
    education: job.education || 'Bachelor',
    createdAt: job.created_at,
  };
};

const requireJobId = (job, fallbackMessage = 'The saved job response did not include a valid id.') => {
  if (!job?.id) {
    throw new Error(fallbackMessage);
  }
  return job;
};

const normalizeApplicant = (app) => {
  if (!app) return null;
  let applicant = app;
  while (
    applicant &&
    typeof applicant === 'object' &&
    !Array.isArray(applicant) &&
    'data' in applicant &&
    !('id' in applicant)
  ) {
    applicant = applicant.data;
  }
  const profile = applicant.job_seeker_profile || {};
  const user = profile.user || {};
  let contact = {};
  try {
    contact = typeof profile.contact_information === 'string' ? JSON.parse(profile.contact_information) : (profile.contact_information || {});
  } catch {
    contact = {};
  }
  const missingSkills = applicant.missing_skills_json || [];
  const yearsExperience = profile.years_of_experience ? parseInt(profile.years_of_experience) : 0;
  const cvParsedData = profile.cv_parsed_data || null;
  
  return {
    id: applicant.id,
    applicationId: applicant.id,
    userId: user.id,
    jobId: applicant.job_id,
    name: contact.firstName ? `${contact.firstName} ${contact.lastName}` : user.name || 'Unknown',
    email: contact.email || user.email || '',
    title: contact.title || 'Professional',
    phone: profile.phone || contact.phone || '',
    location: profile.address || contact.location || '',
    status: applicant.status || 'new',
    matchScore: applicant.ai_score ? Math.round(Number(applicant.ai_score)) : 0,
    experience: yearsExperience ? `${yearsExperience} years` : 'No experience listed',
    yearsExperience,
    education: profile.education_level || 'Bachelors',
    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'A'),
    skills: profile.skills?.map(s => s.name || s) || [],
    matchedSkills: [], // Need backend details
    missingSkills: missingSkills,
    appliedAt: applicant.created_at,
    cvParsedData,
  };
};

const normalizeProfile = (p) => {
  if (!p) return null;
  const user = p.user || {};
  return {
    id: p.id,
    name: p.company_name || user.name || '',
    description: p.description || '',
    industry: p.industry || '',
    location: p.location || '',
    website: p.website || '',
    contactEmail: user.email || '',
    phone: p.phone || '',
    foundedYear: p.founded_year || '2010',
    companySize: p.company_size || '50-200',
    logo: p.logo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(p.company_name || 'C'),
  };
};

export const addLocalNotification = (notification) => {
  const local = JSON.parse(localStorage.getItem('local_notifications') || '[]');
  local.unshift({
    id: 'loc-' + Date.now() + Math.random().toString(36).substr(2, 5),
    created_at: new Date().toISOString(),
    read_at: null,
    read: false,
    data: {},
    ...notification,
  });
  localStorage.setItem('local_notifications', JSON.stringify(local));
};

// Make it available globally for timers outside react component scope
window.__companyDataService = { addLocalNotification };

export const companyDataService = {
  async getCompanyDashboardData() {
    const data = await companyApi.getDashboard();
    return {
      metrics: {
        totalJobs: data.total_jobs || 0,
        activeJobsCount: data.active_jobs || 0,
        totalApplicants: data.total_applicants || 0,
        underReviewCount: data.new_applicants || 0,
        shortlistedCount: data.shortlisted || 0,
        rejectedCount: data.rejected || 0,
        averageMatchScore: data.average_match_score || 0,
      },
      recentApplicants: (data.recent_applicants || []).map(normalizeApplicant),
      activeJobs: (data.top_jobs || []).map(normalizeJob),
      profile: { name: 'Company Dashboard' },
    };
  },

  async getCompanyProfile() {
    const res = await companyApi.getCompanyProfile();
    return normalizeProfile(res.company_profile || res);
  },

async updateCompanyProfile(payload) {
    const backendPayload = {
      company_name: payload.name,
      description: payload.description,
      industry: payload.industry,
      location: payload.location,
      website: payload.website,
      phone: payload.phone,
      founded_year: payload.foundedYear,
      company_size: payload.companySize,
    };
    const res = await companyApi.updateCompanyProfile(backendPayload);
    return normalizeProfile(res.company_profile || res);
  },

  async uploadCompanyLogo(file) {
    return companyApi.uploadCompanyLogo(file);
  },

  async getCompanyJobs(params = {}) {
    const backendParams = {
      search: params.query,
      status: params.status && params.status !== 'all' ? params.status : undefined,
      is_active: params.status === 'active' ? true : (params.status === 'paused' ? false : undefined),
    };
    const envelope = await companyApi.getCompanyJobs(backendParams);
    const items = Array.isArray(envelope) ? envelope : (Array.isArray(envelope?.data) ? envelope.data : envelope);
    return items.map(normalizeJob);
  },

  async getCompanyJobById(id) {
    return requireJobId(normalizeJob(await companyApi.getCompanyJobById(id)), 'This job post is unavailable.');
  },

  async createCompanyJob(payload) {
    const backendPayload = {
      title: payload.title,
      category: payload.category || 'Other',
      description: payload.description,
      responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities.join('\n') : payload.responsibilities,
      location: payload.location,
      work_mode: payload.workMode,
      job_type: payload.type,
      salary_min: payload.salaryMin,
      salary_max: payload.salaryMax,
      experience_level: payload.experienceLevel,
      education: payload.education,
      status: payload.status,
      skills: payload.requiredSkills || [],
    };
    return requireJobId(normalizeJob(await companyApi.createCompanyJob(backendPayload)));
  },

  async updateCompanyJob(id, payload) {
    const backendPayload = {
      title: payload.title,
      category: payload.category || 'Other',
      description: payload.description,
      responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities.join('\n') : payload.responsibilities,
      location: payload.location,
      work_mode: payload.workMode,
      job_type: payload.type,
      salary_min: payload.salaryMin,
      salary_max: payload.salaryMax,
      experience_level: payload.experienceLevel,
      education: payload.education,
      status: payload.status,
      skills: payload.requiredSkills || [],
    };
    return requireJobId(normalizeJob(await companyApi.updateCompanyJob(id, backendPayload)));
  },

  async deleteCompanyJob(id) {
    return companyApi.deleteCompanyJob(id);
  },

  async toggleJobStatus(id) {
    return normalizeJob(await companyApi.toggleCompanyJob(id));
  },

  async getApplicants(params = {}) {
    const { apiRequest } = await import('../api/httpClient');
    const query = {
      ...params,
      query: params.query || params.search || '',
    };
    const envelope = await apiRequest('/company/applicants', { query });
    const items = Array.isArray(envelope) ? envelope : (Array.isArray(envelope?.data) ? envelope.data : envelope);
    return items.map(normalizeApplicant);
  },

  async getApplicantsByJob(jobId, params = {}) {
    const query = {
      ...params,
      query: params.query || params.search || '',
    };
    const envelope = await companyApi.getApplicantsByJob(jobId, query);
    const items = Array.isArray(envelope) ? envelope : (Array.isArray(envelope?.data) ? envelope.data : envelope);
    return items.map(normalizeApplicant);
  },

  async getApplicantById(applicationId) {
    return normalizeApplicant(await companyApi.getApplicantById(applicationId));
  },

  async updateApplicantStatus(applicationId, status) {
    return normalizeApplicant(await companyApi.updateApplicantStatus(applicationId, status));
  },

  async getApplicantCV(applicationId) {
    return companyApi.getApplicantCV(applicationId);
  },

  async getCompanyNotifications() {
    const { apiRequest } = await import('../api/httpClient');
    const envelope = await apiRequest('/notifications');
    const items = Array.isArray(envelope)
      ? envelope
      : Array.isArray(envelope?.data?.data)
      ? envelope.data.data
      : Array.isArray(envelope?.data)
      ? envelope.data
      : [];
      
    const remote = items.map(n => ({
      id: n.id,
      type: n.type,
      title: n.data?.title || 'Notification',
      message: n.data?.message || '',
      sender_id: n.data?.sender_id,
      job_id: n.data?.job_id,
      read: !!n.read_at,
      read_at: n.read_at,
      created_at: n.created_at,
      data: n.data || {},
    }));

    const local = JSON.parse(localStorage.getItem('local_notifications') || '[]');
    return [...local, ...remote].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markAllNotificationsRead() {
    const { apiRequest } = await import('../api/httpClient');
    
    // Mark local read
    const local = JSON.parse(localStorage.getItem('local_notifications') || '[]');
    const now = new Date().toISOString();
    localStorage.setItem('local_notifications', JSON.stringify(local.map(n => ({ ...n, read_at: now, read: true }))));

    await apiRequest('/notifications/read-all', { method: 'POST' });
    return true;
  },

  async markNotificationRead(id) {
    if (String(id).startsWith('loc-')) {
       const local = JSON.parse(localStorage.getItem('local_notifications') || '[]');
       const next = local.map(n => n.id === id ? { ...n, read_at: new Date().toISOString(), read: true } : n);
       localStorage.setItem('local_notifications', JSON.stringify(next));
       return true;
    }
    const { apiRequest } = await import('../api/httpClient');
    return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  async getCompanyMessages() {
    const { apiRequest } = await import('../api/httpClient');
    const res = await apiRequest('/messages');
    return Array.isArray(res?.data) ? res.data : [];
  },

  async getCompanyConversation(userId, jobId) {
    const { apiRequest } = await import('../api/httpClient');
    const query = jobId ? `?job_id=${jobId}` : '';
    const res = await apiRequest(`/messages/${userId}${query}`);
    return Array.isArray(res?.data) ? res.data : [];
  },

  async markMessagesAsRead(userId) {
    const { apiRequest } = await import('../api/httpClient');
    await apiRequest(`/messages/${userId}/read`, { method: 'PATCH' });
  },

  async deleteCompanyConversation(userId, jobId) {
    const { apiRequest } = await import('../api/httpClient');
    const query = jobId ? { job_id: jobId } : undefined;
    await apiRequest(`/messages/${userId}`, { method: 'DELETE', query });
    return true;
  },

  async sendCompanyMessage(receiverId, content, jobId) {
    const { apiRequest } = await import('../api/httpClient');
    const res = await apiRequest('/messages', {
      method: 'POST',
      body: { receiver_id: receiverId, content, job_id: jobId },
    });
    return res?.data;
  }
};

import { companyApi } from '../api/companyApi';

const normalizeJob = (j) => {
  if (!j) return null;
  return {
    id: j.id,
    title: j.title || 'Untitled',
    description: j.description || '',
    responsibilities: Array.isArray(j.responsibilities) 
      ? j.responsibilities 
      : (j.responsibilities ? j.responsibilities.split('\n') : []),
    location: j.location || '',
    type: j.job_type || 'full_time',
    workMode: 'Hybrid', // Backend doesn't have work_mode natively yet
    salaryMin: j.salary_range ? parseInt(j.salary_range.split('-')[0]) || 90000 : 90000,
    salaryMax: j.salary_range && j.salary_range.split('-')[1] ? parseInt(j.salary_range.split('-')[1]) || 130000 : 130000,
    status: j.is_active ? 'active' : 'paused',
    requiredSkills: j.job_required_skills?.map(s => s.skill?.name) || [],
    applicationsCount: j.applications_count || 0,
    views: j.views || 0,
    experienceLevel: j.experience_level || 'Mid-Senior',
    education: j.education || 'Bachelor',
    createdAt: j.created_at,
  };
};

const normalizeApplicant = (app) => {
  if (!app) return null;
  const profile = app.job_seeker_profile || {};
  const user = profile.user || {};
  const contact = profile.contact_information ? JSON.parse(profile.contact_information) : {};
  const missingSkills = app.missing_skills_json || [];
  
  return {
    id: app.id,
    applicationId: app.id,
    jobId: app.job_id,
    name: contact.firstName ? `${contact.firstName} ${contact.lastName}` : user.name || 'Unknown',
    email: contact.email || user.email || '',
    title: contact.title || 'Professional',
    phone: profile.phone || contact.phone || '',
    location: profile.address || contact.location || '',
    status: app.status || 'new',
    matchScore: app.ai_score ? parseInt(app.ai_score) : 0,
    experience: profile.years_of_experience ? `${profile.years_of_experience} years` : '3 years',
    yearsExperience: profile.years_of_experience ? parseInt(profile.years_of_experience) : 3,
    education: profile.education_level || 'Bachelors',
    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'A'),
    skills: profile.skills?.map(s => s.name || s) || [],
    matchedSkills: [], // Need backend details
    missingSkills: missingSkills,
    appliedAt: app.created_at,
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
      is_active: params.status === 'active' ? true : (params.status === 'paused' ? false : undefined),
    };
    const envelope = await companyApi.getCompanyJobs(backendParams);
    const items = Array.isArray(envelope) ? envelope : (Array.isArray(envelope?.data) ? envelope.data : envelope);
    return items.map(normalizeJob);
  },

  async getCompanyJobById(id) {
    return normalizeJob(await companyApi.getCompanyJobById(id));
  },

  async createCompanyJob(payload) {
    const { lookupService } = await import('../api/lookupService');
    const skillsRes = await lookupService.listSkills();
    const availableSkills = Array.isArray(skillsRes) ? skillsRes : (skillsRes.data?.data || skillsRes.data || []);
    
    const mappedSkills = (payload.requiredSkills || []).map(name => {
      const match = availableSkills.find(s => (s.name || '').toLowerCase() === name.toLowerCase());
      return match ? { id: match.id, is_mandatory: true } : null;
    }).filter(Boolean);

    const backendPayload = {
      title: payload.title,
      description: payload.description,
      responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities.join('\n') : payload.responsibilities,
      location: payload.location,
      job_type: payload.type,
      salary_range: `${payload.salaryMin}-${payload.salaryMax}`,
      skills: mappedSkills,
    };
    return normalizeJob(await companyApi.createCompanyJob(backendPayload));
  },

  async updateCompanyJob(id, payload) {
    const { lookupService } = await import('../api/lookupService');
    const skillsRes = await lookupService.listSkills();
    const availableSkills = Array.isArray(skillsRes) ? skillsRes : (skillsRes.data?.data || skillsRes.data || []);
    
    const mappedSkills = (payload.requiredSkills || []).map(name => {
      const match = availableSkills.find(s => (s.name || '').toLowerCase() === name.toLowerCase());
      return match ? { id: match.id, is_mandatory: true } : null;
    }).filter(Boolean);

    const backendPayload = {
      title: payload.title,
      description: payload.description,
      responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities.join('\n') : payload.responsibilities,
      location: payload.location,
      job_type: payload.type,
      salary_range: `${payload.salaryMin}-${payload.salaryMax}`,
      skills: mappedSkills,
    };
    return normalizeJob(await companyApi.updateCompanyJob(id, backendPayload));
  },

  async deleteCompanyJob(id) {
    return companyApi.deleteCompanyJob(id);
  },

  async toggleJobStatus(id) {
    return normalizeJob(await companyApi.toggleCompanyJob(id));
  },

  async getApplicants(params = {}) {
    const { apiRequest } = await import('../api/httpClient');
    const envelope = await apiRequest('/company/applicants', { params });
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
    return items.map(n => ({
      id: n.id,
      title: n.data?.title || 'Notification',
      message: n.data?.message || '',
      read: !!n.read_at,
    }));
  },

  async markAllNotificationsRead() {
    const { apiRequest } = await import('../api/httpClient');
    await apiRequest('/notifications/read-all', { method: 'POST' });
    return true;
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

  async sendCompanyMessage(receiverId, content, jobId) {
    const { apiRequest } = await import('../api/httpClient');
    const res = await apiRequest('/messages', {
      method: 'POST',
      body: { receiver_id: receiverId, content, job_id: jobId },
    });
    return res?.data;
  }
};

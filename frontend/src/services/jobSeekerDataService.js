import {
  applicationsService,
  cvService,
  jobsService,
  lookupService,
  profileService,
  seekerService,
} from '../api';

// ─── Envelope helpers ─────────────────────────────────────────────────────────

const unwrap = (response) => response?.data ?? response;

const unwrapItems = (response) => {
  const data = unwrap(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ─── Small utilities ──────────────────────────────────────────────────────────

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const splitFullName = (name = '') => {
  const safeName = name || '';
  const parts = safeName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName:  parts.slice(1).join(' '),
  };
};

const splitTextList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\r?\n|•|-/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseSalaryRange = (salaryRange) => {
  const numbers =
    String(salaryRange || '')
      .match(/\d[\d,]*/g)
      ?.map((item) => Number(item.replace(/,/g, ''))) || [];

  return {
    salaryMin: numbers[0] || null,
    salaryMax: numbers[1] || numbers[0] || null,
    currency:  salaryRange
      ? String(salaryRange).replace(/[\d,\s\-–]+/g, '').trim() || 'USD'
      : 'USD',
  };
};

const skillCategory = (type) =>
  type === 'soft' ? 'soft_skill' : 'technical';

// ─── Normalizers ──────────────────────────────────────────────────────────────

const normalizeJob = (job = {}) => {
  const company          = job.company_profile || job.companyProfile || job.company || {};
  const requiredSkillRows = job.job_required_skills || job.jobRequiredSkills || [];
  const requiredSkills    = requiredSkillRows
    .map((row) => row.skill?.name || row.skill_name || row.name)
    .filter(Boolean);
  const salary = parseSalaryRange(job.salary_range || job.salaryRange);

  return {
    id:               job.id,
    title:            job.title || 'Untitled job',
    company:          company.company_name || company.name || 'Company',
    companyLogo:      company.logo_url || company.logo || '',
    location:         job.location || company.location || 'Remote',
    type:             job.job_type || job.type || 'full_time',
    workMode:         job.job_type === 'remote' ? 'Remote' : 'On-site',
    description:      job.description || '',
    responsibilities: splitTextList(job.responsibilities),
    requirements:     splitTextList(job.requirements),
    requiredSkills,
    postedAt:         job.created_at || job.postedAt || new Date().toISOString(),
    status:           job.status || (job.is_active === false ? 'paused' : 'active'),
    matchScore:       job.ai_score ? Number(job.ai_score) : undefined,
    applicationsCount: job.applications_count || job.applicationsCount || 0,
    companyInfo: {
      description: company.description || '',
      website:     company.website     || '',
      employees:   company.employees   || '',
    },
    ...salary,
  };
};

const normalizeRecommendation = (job) => {
  const normalizedJob = normalizeJob(job);
  const matchScore    = Number(job.ai_score || job.matchScore || 0);

  return {
    id:           `rec-${normalizedJob.id}`,
    jobId:        normalizedJob.id,
    job:          normalizedJob,
    matchScore,
    matchedSkills: [],
    matchSummary:  matchScore
      ? `${matchScore}% AI match based on your saved skills.`
      : '',
  };
};

const normalizeApplication = (application = {}) => {
  const job = normalizeJob(
    application.job_post ||
    application.jobPost  ||
    application.job      ||
    {}
  );

  return {
    id:           application.id,
    jobId:        application.job_id || application.jobId || job.id,
    status:       application.status || 'applied',
    appliedAt:    application.created_at || application.appliedAt || new Date().toISOString(),
    matchScore:   application.ai_score ? Number(application.ai_score) : undefined,
    missingSkills: application.missing_skills_json || application.missingSkills || [],
    timeline:     application.application_status_history || application.timeline || [],
    job,
  };
};

const normalizeProfile = (profile = {}) => {
  const user    = profile.user || {};
  const contact = parseJson(profile.contact_information);
  const name    = splitFullName(user.name || contact.name || '');
  const skills  = profile.job_seeker_skills || profile.skills || [];

  const completedFields = [
    user.name,
    contact.title,
    profile.address,
    contact.bio,
    profile.phone,
    profile.resume_file_url,
  ].filter(Boolean).length;

  return {
    id:                 profile.id,
    firstName:          contact.firstName || name.firstName,
    lastName:           contact.lastName  || name.lastName,
    title:              contact.title     || '',
    email:              contact.email     || user.email || '',
    phone:              profile.phone     || contact.phone    || '',
    location:           profile.address   || contact.location || '',
    bio:                contact.bio       || '',
    expectedSalary:     contact.expectedSalary || '',
    portfolio:          contact.portfolio || '',
    linkedin:           contact.linkedin  || '',
    educationLevel:     profile.education_level    || '',
    yearsOfExperience:  profile.years_of_experience || '',
    completionPercentage: Math.round((completedFields / 6) * 100),
    cvFile: profile.resume_file_url
      ? {
          name:       String(profile.resume_file_url).split('/').pop(),
          uploadedAt: profile.updated_at || profile.created_at || new Date().toISOString(),
        }
      : null,
    cvParseStatus: profile.cv_parse_status,
    skills:        skills.map((item) => item.skill || item),
  };
};

const normalizeSkill = (skill, source = 'manual') => ({
  id:       skill.id    || skill.skill_id,
  name:     skill.name  || skill.skill?.name || 'Unnamed skill',
  category: skill.category || skillCategory(skill.type || skill.skill?.type),
  source:   source === 'cv' ? 'cv_parsed' : source,
});

const normalizeParsedProfile = (data, meta = {}) => {
  const parsed = parseJson(data, data || {});

  // Safely coerce a field to an array.
  // If the AI returns a string (e.g. "Bachelor of Science, 2020") we wrap it
  // in an empty array so .map() never crashes; the component will render the
  // raw string via its string-fallback branch instead.
  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    return []; // string / null / undefined / object → empty array; components handle display
  };

  return {
    cvFile: meta.resume_file_url
      ? {
          name:       String(meta.resume_file_url).split('/').pop(),
          uploadedAt: meta.updated_at || new Date().toISOString(),
        }
      : parsed.cvFile || null,
    personalInfo: parsed.personalInfo || parsed.personal_info || {
      firstName: splitFullName(parsed.name).firstName || '',
      lastName: splitFullName(parsed.name).lastName || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      location: parsed.location || '',
      title: parsed.title || ''
    },
    summary:      parsed.summary      || parsed.bio            || '',
    experience:   toArray(parsed.experience),
    education:    toArray(parsed.education),
    // Raw string from AI for display purposes (never used for .map())
    experienceRaw: !Array.isArray(parsed.experience) && parsed.experience ? String(parsed.experience) : null,
    educationRaw:  !Array.isArray(parsed.education)  && parsed.education  ? String(parsed.education)  : null,
    skills:
      parsed.skills && !Array.isArray(parsed.skills)
        ? parsed.skills
        : { 
            hard: Array.isArray(parsed.technical_skills) ? parsed.technical_skills : (Array.isArray(parsed.skills) ? parsed.skills : []), 
            soft: Array.isArray(parsed.soft_skills) ? parsed.soft_skills : [], 
            tools: [] 
          },
  };
};

const parsedPayload = (data) => ({
  ...data,
  skills: [
    ...(data?.skills?.hard  || []),
    ...(data?.skills?.soft  || []),
    ...(data?.skills?.tools || []),
  ],
});

// ─── Exported API ─────────────────────────────────────────────────────────────

export const getParsedProfile = async () => {
  try {
    const parsed = unwrap(await cvService.getParsedCv());
    return normalizeParsedProfile(parsed.parsed_json, parsed);
  } catch (error) {
    if (error.response?.status === 404 || error.status === 404) return null;
    throw error;
  }
};

export const saveParsedProfile = async (data) => {
  await cvService.updateParsedCv({ parsed_json: parsedPayload(data) });

  if (data?.personalInfo) {
    await profileService.updateProfile({
      firstName: data.personalInfo.firstName,
      lastName:  data.personalInfo.lastName,
      title:     data.personalInfo.title,
      email:     data.personalInfo.email,
      phone:     data.personalInfo.phone,
      location:  data.personalInfo.location,
      bio:       data.summary,
    });
  }

  return { success: true };
};

export const uploadCv = async (file) => {
  return cvService.uploadCv(file);
};

export const getSavedJobs = async () => {
  return unwrapItems(await seekerService.listSavedJobs()).map(normalizeJob);
};

export const isJobSaved = async (jobId) => {
  const saved = await getSavedJobs();
  return saved.some((job) => String(job.id) === String(jobId));
};

export const toggleSavedJob = async (jobId) => {
  const already = await isJobSaved(jobId);

  if (already) {
    await seekerService.unsaveJob(jobId);
    return { success: true, isSaved: false };
  }

  await seekerService.saveJob(jobId);
  return { success: true, isSaved: true };
};

export const getSeekerDashboardData = async () => {
  const [profileResult, applicationsResult, recommendationsResult] =
    await Promise.allSettled([
      getProfile(),
      getApplications(),
      getRecommendedJobs(),
    ]);

  const profile         = profileResult.status         === 'fulfilled' ? profileResult.value         : {};
  const userApplications = applicationsResult.status   === 'fulfilled' ? applicationsResult.value    : [];
  const recommendations  = recommendationsResult.status === 'fulfilled' ? recommendationsResult.value : [];

  return {
    stats: {
      totalApplications: userApplications.length,
      underReviewCount:  userApplications.filter((item) => item.status === 'under_review').length,
      shortlistedCount:  userApplications.filter((item) => item.status === 'shortlisted').length,
      rejectedCount:     userApplications.filter((item) => item.status === 'rejected').length,
    },
    profileCompletion:   profile.completionPercentage || 0,
    skillsCount:         profile.skills?.length        || 0,
    recentApplications:  userApplications.slice(0, 3),
    topRecommendedJobs:  recommendations.slice(0, 3),
    profile,
  };
};

export const getJobs = async (filters = {}) => {
  const query = {
    keyword:  filters.search,
    location: filters.location,
    job_type: filters.type !== 'all' ? filters.type : undefined,
  };

  return unwrapItems(await jobsService.listJobs(query)).map(normalizeJob);
};

export const getRecommendedJobs = async (filters = {}) => {
  let result;
  try {
    result = unwrapItems(await jobsService.getRecommendedJobs()).map(
      normalizeRecommendation
    );
  } catch (error) {
    if (error.response?.status === 404 || error.status === 404) {
      return [];
    }
    if (error.response?.status === 403 || error.status === 403) {
      const emptyResult = [];
      emptyResult.needsCvUpload = true;
      return emptyResult;
    }
    throw error;
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (rec) =>
        rec.job.title.toLowerCase().includes(q) ||
        rec.job.company.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => b.matchScore - a.matchScore);
};

export const getJobById = async (id) => {
  return normalizeJob(unwrap(await jobsService.getJob(id)));
};

export const getApplications = async (filters = {}) => {
  let result = unwrapItems(await applicationsService.listApplications()).map(
    normalizeApplication
  );

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (app) =>
        app.job.title.toLowerCase().includes(q) ||
        app.job.company.toLowerCase().includes(q)
    );
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((app) => app.status === filters.status);
  }

  return result;
};

export const getApplicationById = async (id) => {
  return normalizeApplication(unwrap(await applicationsService.getApplication(id)));
};

export const applyToJob = async (jobId) => {
  return applicationsService.applyToJob(jobId);
};

export const getProfile = async () => {
  return normalizeProfile(unwrap(await profileService.getProfile()));
};

export const updateProfile = async (profileData) => {
  return {
    success: true,
    data: normalizeProfile(unwrap(await profileService.updateProfile(profileData))),
  };
};

export const getSkills = async () => {
  const profile   = unwrap(await profileService.getProfile());
  const skillRows = profile.job_seeker_skills || [];

  if (skillRows.length) {
    return skillRows.map((row) =>
      normalizeSkill(row.skill || row, row.source || 'manual')
    );
  }

  return (profile.skills || []).map((skill) => normalizeSkill(skill));
};

export const getSuggestedSkills = async () => {
  return unwrapItems(await lookupService.listSkills()).map((skill) =>
    normalizeSkill(skill)
  );
};

export const addSkill = async (skillData) => {
  const skillId = typeof skillData === 'object' ? skillData.id : skillData;

  if (!skillId || String(skillId).startsWith('sk-')) {
    throw new Error('Select an existing suggested skill before adding it.');
  }

  await seekerService.addSkill(skillId);
  return { success: true, data: skillData };
};

export const removeSkill = async (skillId) => {
  await seekerService.removeSkill(skillId);
  return { success: true };
};

export const getNotifications = async () => {
  // Notifications are fetched via the NotificationController endpoint
  const { apiRequest } = await import('../api/httpClient');
  const envelope = await apiRequest('/notifications');
  return unwrapItems(envelope);
};

export const markNotificationRead = async (id) => {
  const { apiRequest } = await import('../api/httpClient');
  await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
  return { success: true };
};

export const markAllNotificationsRead = async () => {
  const { apiRequest } = await import('../api/httpClient');
  await apiRequest('/notifications/read-all', { method: 'POST' });
  return { success: true };
};

export const getMessages = async () => [];   // No messages endpoint in backend yet

export const updateSettings = async (settingsData) => {
  // Delegated to profileService.updateProfile for account-level settings
  return profileService.updateProfile(settingsData);
};

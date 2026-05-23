import { jobsService } from '../api/jobsService';
import { companyService } from '../api/companyService';

const parseSalaryRange = (salaryRange) => {
  const numbers = String(salaryRange || '').match(/\d[\d,]*/g)?.map((item) => Number(item.replace(/,/g, ''))) || [];
  return {
    salaryMin: numbers[0] || null,
    salaryMax: numbers[1] || numbers[0] || null,
    currency: salaryRange ? String(salaryRange).replace(/[\d,\s\-–]+/g, '').trim() || 'USD' : 'USD',
  };
};

const splitTextList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(/\r?\n|•|-/).map((item) => item.trim()).filter(Boolean);
};

export const normalizePublicJob = (job = {}) => {
  const company = job.company_profile || job.companyProfile || job.company || {};
  const requiredSkillRows = job.job_required_skills || job.jobRequiredSkills || [];
  const requiredSkills = requiredSkillRows.map((row) => row.skill?.name || row.skill_name || row.name).filter(Boolean);
  const salary = parseSalaryRange(job.salary_range || job.salaryRange);

  return {
    id: job.id,
    title: job.title || 'Untitled job',
    category: job.category || 'Other',
    company: company.company_name || company.name || 'Company',
    companyId: company.id || null,
    companyLogo: company.logo_url || company.logo || '',
    location: job.location || company.location || 'Remote',
    type: job.job_type || job.type || 'full_time',
    workMode: job.job_type === 'remote' ? 'Remote' : 'On-site',
    description: job.description || '',
    responsibilities: splitTextList(job.responsibilities),
    requirements: splitTextList(job.requirements),
    requiredSkills,
    postedAt: job.created_at || job.postedAt || new Date().toISOString(),
    status: job.status || (job.is_active === false ? 'paused' : 'active'),
    matchScore: job.ai_score ? Number(job.ai_score) : undefined,
    applicationsCount: job.applications_count || job.applicationsCount || 0,
    salary: job.salary_range || job.salaryRange || '',
    tags: requiredSkills,
    posted: new Date(job.created_at || new Date()).toLocaleDateString(),
    companyInfo: {
      description: company.description || '',
      website: company.website || '',
      employees: company.employees || '',
    },
    ...salary,
  };
};

export const normalizePublicCompany = (company = {}) => {
  return {
    id: company.id,
    name: company.company_name || company.name || 'Company',
    logo: company.logo_url || company.logo || '',
    industry: company.industry || 'Technology',
    location: company.location || 'Remote',
    description: company.description || '',
    website: company.website || '',
    employees: company.employees || '',
    openPositions: company.jobs_count || company.openPositions || 0,
    rating: company.rating || 0,
    reviewCount: company.reviewCount || 0,
    benefits: splitTextList(company.benefits),
  };
};

export const getPublicJobs = async (filters = {}) => {
  const data = await jobsService.listPublicJobs(filters);
  const items = Array.isArray(data) ? data : (data?.data || []);
  return items.map(normalizePublicJob);
};

export const getPublicJobById = async (id) => {
  const data = await jobsService.getPublicJob(id);
  return normalizePublicJob(data);
};

export const getPublicCompanies = async (filters = {}) => {
  const data = await companyService.listPublicCompanies(filters);
  const items = Array.isArray(data) ? data : (data?.data || []);
  return items.map(normalizePublicCompany);
};

export const getPublicCompanyById = async (id) => {
  const response = await companyService.getPublicCompany(id);
  // Safely extract the nested payload from Laravel's ApiResponse format
  let payload = response;
  
  // Unwrap nested `data` properties safely until we hit the actual object with `company` or primitive fallback.
  while (payload && typeof payload === 'object' && !Array.isArray(payload) && ('data' in payload)) {
     if (payload.company !== undefined) {
         break; // Found the target payload directly inside
     }
     payload = payload.data;
  }

  if (payload?.company) {
    return {
      company: normalizePublicCompany(payload.company),
      activeJobs: (payload.active_jobs || []).map(normalizePublicJob)
    };
  }
  
  // Fallback if company wrapper doesn't exist
  return { company: normalizePublicCompany(payload), activeJobs: [] };
};

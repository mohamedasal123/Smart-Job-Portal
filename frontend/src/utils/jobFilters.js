const normalize = (value) => String(value || '').trim().toLowerCase();

const EXPERIENCE_GROUPS = {
  entry: ['entry', 'junior', 'entry level', '0-1', '0-2'],
  mid: ['mid', 'intermediate', '2-4', '3-5'],
  senior: ['senior', '5+', '5-8'],
  lead: ['lead', 'principal', 'staff', '8+'],
  executive: ['executive', 'director', 'head', 'vp', 'c-level'],
};

const EXPERIENCE_LABELS = {
  'Entry Level': 'entry',
  'Mid Level': 'mid',
  Senior: 'senior',
  Lead: 'lead',
  Executive: 'executive',
};

const TYPE_ALIASES = {
  'full-time': 'full_time',
  'full time': 'full_time',
  full_time: 'full_time',
  contract: 'contract',
  'part-time': 'part_time',
  'part time': 'part_time',
  part_time: 'part_time',
  internship: 'internship',
  remote: 'remote',
};

export const normalizeJobType = (value) => TYPE_ALIASES[normalize(value)] || normalize(value);

export const normalizeExperienceLevel = (value) => {
  const normalized = normalize(value);
  if (!normalized) return '';

  const directKey = EXPERIENCE_LABELS[value] || EXPERIENCE_LABELS[value?.trim?.()] || normalized;
  if (EXPERIENCE_GROUPS[directKey]) return directKey;

  return Object.entries(EXPERIENCE_GROUPS).find(([, tokens]) =>
    tokens.some((token) => normalized.includes(token)),
  )?.[0] || normalized;
};

export const parseSalaryRange = (job) => {
  const explicitMin = Number(job.salaryMin);
  const explicitMax = Number(job.salaryMax);

  if (Number.isFinite(explicitMin) || Number.isFinite(explicitMax)) {
    return {
      salaryMin: Number.isFinite(explicitMin) ? explicitMin : 0,
      salaryMax: Number.isFinite(explicitMax) ? explicitMax : explicitMin || 0,
    };
  }

  const salaryText = String(job.salary || '');
  const numbers = [...salaryText.matchAll(/(\d+(?:\.\d+)?)\s*k?/gi)].map((match) => {
    const value = Number(match[1]);
    return /k/i.test(match[0]) ? value * 1000 : value;
  });

  if (!numbers.length) return { salaryMin: 0, salaryMax: 0 };

  return {
    salaryMin: Math.min(...numbers),
    salaryMax: Math.max(...numbers),
  };
};

export const matchesExperienceLevel = (job, selectedLevels = []) => {
  if (!selectedLevels.length) return true;

  const jobLevel = normalizeExperienceLevel(job.experienceLevel || job.level || '');
  const normalizedSelected = selectedLevels.map(normalizeExperienceLevel);

  return normalizedSelected.some((selected) => {
    if (jobLevel === selected) return true;
    const rawLevel = normalize(job.experienceLevel || job.level || '');
    return EXPERIENCE_GROUPS[selected]?.some((token) => rawLevel.includes(token));
  });
};

export const matchesSalaryRange = (job, selectedSalary) => {
  if (!selectedSalary) return true;

  const threshold = Number(String(selectedSalary).replace(/[^\d]/g, '')) * 1000;
  if (!threshold) return true;

  return parseSalaryRange(job).salaryMax >= threshold;
};

export const filterJobs = (jobs, filters = {}) => {
  const search = normalize(filters.search ?? filters.searchQuery);
  const location = normalize(filters.location ?? filters.locationQuery);
  const selectedTypes = filters.selectedTypes || (filters.type && filters.type !== 'all' ? [filters.type] : []);
  const selectedExperienceLevels = filters.selectedExperienceLevels || filters.experienceLevels || [];
  const selectedSalary = filters.selectedSalary || filters.salaryRange || '';
  const normalizedTypes = selectedTypes.map(normalizeJobType);

  return jobs.filter((job) => {
    const searchText = normalize([
      job.title,
      job.company,
      job.description,
      ...(job.tags || []),
      ...(job.requiredSkills || []),
    ].join(' '));
    const locationText = normalize(job.location);
    const jobType = normalizeJobType(job.type);
    const isRemoteType = normalizedTypes.includes('remote') && normalize(job.workMode).includes('remote');

    const matchesSearch = !search || searchText.includes(search);
    const matchesLocation = !location || locationText.includes(location) || normalize(job.workMode).includes(location);
    const matchesType = !normalizedTypes.length || normalizedTypes.includes(jobType) || isRemoteType;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesExperienceLevel(job, selectedExperienceLevels) &&
      matchesSalaryRange(job, selectedSalary)
    );
  });
};

export const sortJobs = (jobs, sortBy = 'relevant') => {
  const sorted = [...jobs];

  if (['newest', 'Newest'].includes(sortBy)) {
    return sorted.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
  }

  if (['salary-high', 'Salary high to low'].includes(sortBy)) {
    return sorted.sort((a, b) => parseSalaryRange(b).salaryMax - parseSalaryRange(a).salaryMax);
  }

  if (sortBy === 'salary-low') {
    return sorted.sort((a, b) => parseSalaryRange(a).salaryMin - parseSalaryRange(b).salaryMin);
  }

  return sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

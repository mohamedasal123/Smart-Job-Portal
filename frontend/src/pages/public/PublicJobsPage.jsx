import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { jobsApi } from '../../api/jobsApi';
import { normalizeApiError } from '../../utils/apiError';

export default function PublicJobsPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    try {
      let backendType = selectedType;
      if (selectedType === 'Full-time') backendType = 'full_time';
      if (selectedType === 'Part-time') backendType = 'part_time';
      if (selectedType === 'Contract') backendType = 'contract';
      if (selectedType === 'Remote') backendType = 'remote';
      if (selectedType === 'Internship') backendType = 'internship';

      const payload = await jobsApi.getPublicJobs({
        page,
        keyword: searchQuery,
        location: locationQuery,
        job_type: backendType || undefined
      });

      if (isMounted) {
        const resultData = Array.isArray(payload.data) ? payload.data : payload.data?.data || [];
        const resultMeta = payload.data?.meta || null;
        setData(resultData);
        setMeta(resultMeta);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted) {
        setError(normalizeApiError(err));
        setLoading(false);
      }
    }
  }, [page, searchQuery, locationQuery, selectedType]);

  useEffect(() => {
    let isMounted = true;
    
    // We create a wrapper to handle cleanup properly
    const loadData = async () => {
      if (isMounted) {
        await fetchJobs();
      }
    };
    
    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const toggleType = (type) => {
    setSelectedType((prev) => (prev === type ? '' : type));
    setPage(1);
  };

  const toggleExperienceLevel = (level) => {
    setSelectedExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedType('');
    setSelectedExperienceLevels([]);
    setSelectedSalary('');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    locationQuery ||
    selectedType ||
    selectedExperienceLevels.length > 0 ||
    selectedSalary;

  const total = meta?.total || data.length;
  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  const getJobTags = (job) => {
    return job.job_required_skills?.map(r => r.skill?.name).filter(Boolean) || [];
  };

  const getCompanyName = (job) => {
    return job.company_profile?.company_name || 'Unknown Company';
  };

  const getCompanyLogo = (job) => {
    return job.company_profile?.logo_url;
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen">
      <div>
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest dark:bg-surface-dim sticky top-0 z-50 w-full shadow-sm shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex justify-between items-center w-full px-margin-desktop py-stack-md max-w-container-max-width mx-auto">
            <div className="flex items-center gap-stack-lg">
              <Link className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed" to={ROUTES.HOME}>Smart Job Portal</Link>
              <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
                <Link className="text-secondary font-h3 text-h3 font-semibold px-3 py-2 rounded-lg bg-surface-container-low" to={ROUTES.JOBS}>Browse Jobs</Link>
                <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low duration-200 px-3 py-2 rounded-lg" to={ROUTES.COMPANIES}>Companies</Link>
                <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low duration-200 px-3 py-2 rounded-lg" to={ROUTES.SALARY_GUIDE}>Salaries</Link>
              </nav>
            </div>
            <div className="flex items-center gap-stack-md">
              <Link className="hidden md:flex items-center justify-center px-4 py-2 border border-outline text-on-surface font-body-md font-semibold rounded-lg hover:bg-surface-container-low transition-colors" to={ROUTES.LOGIN}>Sign In</Link>
              <Link className="flex items-center justify-center px-4 py-2 bg-secondary text-on-secondary font-body-md font-bold rounded-lg hover:bg-secondary-container transition-colors shadow-sm" to={ROUTES.POST_JOB}>Post a Job</Link>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center w-full">
          {/* Search Header */}
          <section className="w-full bg-surface-container-lowest py-10 px-margin-desktop border-b border-surface-container-high">
            <div className="max-w-container-max-width mx-auto">
              <h1 className="font-h1 text-h1 text-primary mb-2">Browse Jobs</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Discover {total.toLocaleString()}+ open positions from leading companies.
              </p>

              <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSearchSubmit}>
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined text-outline absolute left-3 top-1/2 -translate-y-1/2 text-[20px]">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    placeholder="Job title, keywords, or company"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined text-outline absolute left-3 top-1/2 -translate-y-1/2 text-[20px]">location_on</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    placeholder="City, state, or remote"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-secondary text-on-secondary font-body-md font-bold rounded-lg hover:bg-secondary-container transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> : 'Search'}
                </button>
              </form>
            </div>
          </section>

          {/* Filters + Results */}
          <section className="w-full max-w-container-max-width mx-auto px-margin-desktop py-8 flex flex-col md:flex-row gap-gutter">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-[280px] shrink-0">
              <div className="sticky top-[100px] bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high">
                <h3 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  Filters
                </h3>

                {/* Job Type */}
                <div className="mb-stack-md">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-stack-sm">Job Type</h4>
                  <div className="flex flex-col gap-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
                      <label key={type} className="flex items-center gap-2 font-body-md text-on-surface cursor-pointer hover:text-secondary transition-colors">
                        <input 
                          type="checkbox" 
                          className="accent-[#2563EB] w-4 h-4 rounded" 
                          checked={selectedType === type} 
                          onChange={() => toggleType(type)} 
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-stack-md">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-stack-sm">Experience Level</h4>
                  <div className="flex flex-col gap-2">
                    {['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'].map((level) => (
                      <label key={level} className="flex items-center gap-2 font-body-md text-on-surface cursor-pointer hover:text-secondary transition-colors">
                        <input
                          type="checkbox"
                          className="accent-[#2563EB] w-4 h-4 rounded opacity-50 cursor-not-allowed"
                          checked={selectedExperienceLevels.includes(level)}
                          onChange={() => toggleExperienceLevel(level)}
                          disabled
                        />
                        <span className="opacity-50">{level} (Coming Soon)</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button className="mt-stack-md w-full py-2 text-center font-body-md text-error hover:bg-error-container/20 rounded-lg transition-colors" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Job Listings */}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-6">
                <p className="font-body-md text-on-surface-variant">
                  Showing <span className="font-semibold text-primary">{data.length}</span> of {total} results
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="p-4 bg-error-container text-on-error-container rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((skeleton) => (
                      <div key={skeleton} className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high shadow-sm animate-pulse flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high shrink-0"></div>
                        <div className="flex-grow">
                          <div className="h-6 bg-surface-container-high rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-surface-container-high rounded w-1/4 mb-4"></div>
                          <div className="flex gap-4 mb-4">
                            <div className="h-4 bg-surface-container-high rounded w-16"></div>
                            <div className="h-4 bg-surface-container-high rounded w-16"></div>
                            <div className="h-4 bg-surface-container-high rounded w-16"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-surface-container-high rounded-full w-16"></div>
                            <div className="h-6 bg-surface-container-high rounded-full w-20"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data.length === 0 && !error ? (
                  <div className="text-center py-16">
                    <span className="material-symbols-outlined text-outline text-[48px] mb-4">search_off</span>
                    <h3 className="font-h3 text-h3 text-primary mb-2">No jobs match your search</h3>
                    <p className="font-body-md text-on-surface-variant mb-4">Try adjusting your filters or search terms.</p>
                    <button className="px-4 py-2 text-secondary font-body-md font-semibold hover:underline" onClick={clearFilters}>Clear All Filters</button>
                  </div>
                ) : (
                  <>
                    {data.map((job) => (
                      <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 transition-all group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              {getCompanyLogo(job) ? (
                                <img src={getCompanyLogo(job) || undefined} alt={getCompanyName(job)} className="w-10 h-10 rounded-lg object-cover border border-outline-variant" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center font-h3 text-secondary font-bold">
                                  {getCompanyName(job).charAt(0) ?? '?'}
                                </div>
                              )}
                              <div>
                                <h3 className="font-h3 text-h3 text-primary group-hover:text-secondary transition-colors">{job.title}</h3>
                                <p className="font-body-md text-on-surface-variant">{getCompanyName(job)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              <span className="flex items-center gap-1 font-body-md text-on-surface-variant">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {job.location || 'Remote'}
                              </span>
                              <span className="flex items-center gap-1 font-body-md text-on-surface-variant">
                                <span className="material-symbols-outlined text-[16px]">work</span>
                                {job.job_type?.replace('_', ' ') || 'Full time'}
                              </span>
                              {job.salary_range && (
                                <span className="flex items-center gap-1 font-body-md text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[16px]">payments</span>
                                  {job.salary_range}
                                </span>
                              )}
                              <span className="flex items-center gap-1 font-body-md text-outline">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              {getJobTags(job).map((tag) => (
                                <span key={tag} className="px-2.5 py-1 bg-surface-container-low rounded-full font-label-sm text-label-sm text-on-surface-variant border border-surface-container-high">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {job.ai_score !== undefined && job.ai_score !== null && (
                            <div className="shrink-0 flex flex-col items-center">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-ai-score text-ai-score font-bold border-3 ${job.ai_score >= 85
                                  ? 'border-match-green/30 text-match-green bg-match-green/5'
                                  : job.ai_score >= 70
                                    ? 'border-secondary/30 text-secondary bg-secondary/5'
                                    : 'border-outline-variant text-on-surface-variant bg-surface-container-low'
                                }`}>
                                {job.ai_score}%
                              </div>
                              <span className="font-label-sm text-label-sm text-outline mt-1">Match</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                    
                    {/* Pagination Controls */}
                    {lastPage > 1 && (
                      <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant mt-4">
                        <button 
                          className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50 hover:bg-surface-container-low transition-colors" 
                          disabled={currentPage <= 1 || loading} 
                          onClick={() => setPage(p => p - 1)}
                        >
                          Previous
                        </button>
                        <span className="text-on-surface-variant font-label-md">
                          Page {currentPage} of {lastPage}
                        </span>
                        <button 
                          className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50 hover:bg-surface-container-low transition-colors" 
                          disabled={currentPage >= lastPage || loading} 
                          onClick={() => setPage(p => p + 1)}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant w-full py-stack-lg px-margin-desktop">
          <div className="flex justify-between items-center max-w-container-max-width mx-auto flex-col md:flex-row gap-4">
            <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center md:text-left">
              © 2024 Smart Job Portal. Intelligence in Recruitment.
            </div>
            <nav className="flex gap-6">
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.PRIVACY || '#'}>Privacy</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.TERMS || '#'}>Terms</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.HOME}>API</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.CONTACT || '#'}>Support</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
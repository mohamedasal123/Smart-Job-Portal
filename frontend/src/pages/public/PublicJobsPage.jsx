import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PublicNavBar from '../../components/PublicNavBar';
import { ROUTES } from '../../utils/constants';
import { jobsApi } from '../../api/jobsApi';
import { adminApi } from '../../api/adminApi';
import { normalizeApiError } from '../../utils/apiError';
import { useAuth } from '../../context/useAuth';

import PublicFooter from '../../components/PublicFooter';

export default function PublicJobsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [locationQuery, setLocationQuery] = useState(queryParams.get('location') || '');
  const [categoryQuery, setCategoryQuery] = useState(queryParams.get('category') || '');
  const [selectedType, setSelectedType] = useState('');
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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
        category: categoryQuery || undefined,
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
  }, [page, searchQuery, locationQuery, categoryQuery, selectedType]);

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
    setCategoryQuery('');
    setSelectedType('');
    setSelectedExperienceLevels([]);
    setSelectedSalary('');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    locationQuery ||
    categoryQuery ||
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

  const handleForceDelete = async (e, jobId, jobTitle) => {
    e.preventDefault(); // Prevent navigating to job details
    if (!window.confirm(`Force delete ${jobTitle}? This marks the job as permanently deleted.`)) return;
    try {
      await adminApi.forceDeleteJob(jobId);
      setData(prev => prev.filter(j => j.id !== jobId));
      alert('Job force deleted successfully');
    } catch (err) {
      alert('Failed to force delete job');
    }
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen">
      <div>
        <PublicNavBar />

        <main className="flex-grow w-full max-w-container mx-auto px-gutter py-margin-desktop space-y-gutter">
          {/* Search Header */}
          <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-stack-sm">Job Search</p>
              <h1 className="font-display text-display text-primary mb-stack-sm">Browse jobs that match your goals</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-gutter">
                Discover {total.toLocaleString()}+ open positions from leading companies.
              </p>

              <form className="mt-gutter grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-stack-md" onSubmit={handleSearchSubmit}>
                <label className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                    placeholder="Job title, keywords, or company"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </label>
                <label className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">location_on</span>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                    placeholder="City, state, or remote"
                    type="search"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={loading} className="bg-secondary text-on-secondary font-h3 text-h3 px-gutter py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> : 'Search Jobs'}
                </button>
              </form>
          </section>

          {/* Filters + Results */}
          <section className="w-full flex flex-col md:flex-row gap-gutter">
            
            {/* Mobile Filters Toggle */}
            <div className="md:hidden mb-4">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-h3 text-primary shadow-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="material-symbols-outlined text-[20px]">{showFilters ? 'close' : 'tune'}</span>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`w-full md:w-[280px] shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="sticky top-[100px] bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high">
                <h3 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  Filters
                </h3>

                {/* Category */}
                <div className="mb-stack-md">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-stack-sm">Category</h4>
                  <div className="flex flex-col gap-2">
                    {['Engineering', 'Design', 'Marketing', 'Data Science', 'Finance', 'Customer Success', 'Operations', 'Human Resources', 'Other'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 font-body-md text-on-surface cursor-pointer hover:text-secondary transition-colors">
                        <input 
                          type="checkbox" 
                          className="accent-[#2563EB] w-4 h-4 rounded" 
                          checked={categoryQuery === cat} 
                          onChange={() => {
                            setCategoryQuery(prev => prev === cat ? '' : cat);
                            setPage(1);
                          }} 
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

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
                <div className="flex flex-col gap-2">
                  <p className="font-body-md text-on-surface-variant">
                    Showing <span className="font-semibold text-primary">{data.length}</span> of {total} results
                  </p>
                  {categoryQuery && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm flex items-center gap-1">
                        Category: {categoryQuery}
                        <button onClick={() => setCategoryQuery('')} className="material-symbols-outlined text-[14px] hover:text-error transition-colors">close</button>
                      </span>
                    </div>
                  )}
                </div>
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
                                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center font-h3 text-secondary font-bold">
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
                          
                          {isAdmin && (
                            <div className="shrink-0 flex flex-col items-end gap-2 ml-4 border-l border-outline-variant pl-4">
                              <button 
                                onClick={(e) => handleForceDelete(e, job.id, job.title)}
                                className="bg-error-container text-on-error-container px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-error hover:text-on-error transition-colors flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                                Force Delete
                              </button>
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
        <PublicFooter />
      </div>
    </div>
  );
}

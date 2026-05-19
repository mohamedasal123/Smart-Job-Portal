import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import SeekerJobCard from '../../components/jobSeeker/SeekerJobCard';
import SeekerEmptyState from '../../components/jobSeeker/SeekerEmptyState';

export default function JobSeekerSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '' });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [sortBy, setSortBy] = useState('Newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seeker/saved-jobs');
      let result = res.data?.data?.data || res.data?.data || [];
      
      // Filter by search
      if (activeFilters.search) {
        const query = activeFilters.search.toLowerCase();
        result = result.filter(job => 
          job.title?.toLowerCase().includes(query) || 
          job.companyProfile?.company_name?.toLowerCase().includes(query)
        );
      }
      
      // Sort
      if (sortBy === 'Newest') {
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortBy === 'Salary high to low') {
        result.sort((a, b) => {
           const getSal = (sal) => sal ? parseInt(sal.split('-')[1]) : 0;
           return getSal(b.salary_range) - getSal(a.salary_range);
        });
      }
      
      setSavedJobs(result);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, sortBy]);

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    const reset = { search: '' };
    setFilters(reset);
    setActiveFilters(reset);
    setPage(1);
  };

  // Called when a job is unsaved directly from this page
  const handleSavedStateChange = () => {
    fetchJobs(); // Re-fetch to remove the job from the list
  };

  return (
    <div className="p-margin-desktop max-w-7xl mx-auto flex flex-col h-full">
      <SeekerPageHeader 
        title="Saved Jobs" 
        subtitle="Keep track of jobs you're interested in applying for later." 
        icon="bookmark"
      />
      
      <div className="mb-stack-lg flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center bg-surface-container-lowest rounded-lg px-3 border border-outline-variant focus-within:border-secondary transition-colors w-full">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input 
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-transparent border-none focus:ring-0 text-body-md py-3 text-on-surface placeholder-on-surface-variant outline-none" 
            placeholder="Search saved jobs..." 
            type="text" 
          />
        </div>
        <button 
          onClick={handleSearch}
          className="bg-secondary text-on-secondary font-body-md font-bold px-6 py-3 rounded-lg hover:bg-secondary-container transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-gutter flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-stack-md">
            <span className="font-body-md text-on-surface-variant">Showing <strong className="text-primary">{savedJobs.length}</strong> saved jobs</span>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-on-surface-variant">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-primary py-1 px-3 focus:ring-secondary focus:border-secondary outline-none"
              >
                <option>Newest</option>
                <option>Salary high to low</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex-1 flex justify-center items-center py-12">
              <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
            </div>
          ) : savedJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {savedJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(job => {
                  const normalizedJob = {
                    id: job.id,
                    title: job.title,
                    company: job.companyProfile?.company_name || 'Company',
                    location: job.location,
                    salaryMin: job.salary_range ? parseInt(job.salary_range.split('-')[0]) : null,
                    salaryMax: job.salary_range ? parseInt(job.salary_range.split('-')[1]) : null,
                    type: job.job_type,
                    postedAt: job.created_at,
                    skills: job.jobRequiredSkills?.map(s => s.skill?.name) || []
                  };
                  return <SeekerJobCard key={job.id} job={normalizedJob} onSavedStateChange={handleSavedStateChange} />;
                })}
              </div>
              
              <div className="flex justify-between items-center mt-stack-md bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant">
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span className="text-on-surface-variant font-label-md">Page {page} of {Math.max(1, Math.ceil(savedJobs.length / itemsPerPage))}</span>
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page * itemsPerPage >= savedJobs.length} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </>
          ) : (
            <SeekerEmptyState 
              icon="bookmark_border"
              title={activeFilters.search ? "No saved jobs found" : "Your wishlist is empty"}
              description={activeFilters.search ? "No saved jobs match your search criteria." : "You haven't saved any jobs yet. Browse jobs and click the bookmark icon to save them here."}
              action={
                activeFilters.search ? (
                  <button onClick={clearFilters} className="px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container">
                    Clear Filters
                  </button>
                ) : null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

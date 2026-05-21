import { useState, useEffect } from 'react';
import { getJobs } from '../../services/jobSeekerDataService';
import SeekerJobCard from '../../components/jobSeeker/SeekerJobCard';
import SeekerEmptyState from '../../components/jobSeeker/SeekerEmptyState';

export default function JobSeekerJobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
  });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [sortBy, setSortBy] = useState('Best match');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const result = await getJobs(activeFilters);
        // Simple sort implementation
        if (sortBy === 'Newest') {
          result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        } else if (sortBy === 'Salary high to low') {
          result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        }
        setJobs(result);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [activeFilters, sortBy]);

  const handleSearch = () => {
    setActiveFilters(filters);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For simplicity, checkboxes just update 'type' in this demo
    if (type === 'checkbox') {
      if (checked) {
        setFilters(prev => ({ ...prev, type: name }));
        setActiveFilters(prev => ({ ...prev, type: name }));
      } else {
        setFilters(prev => ({ ...prev, type: 'all' }));
        setActiveFilters(prev => ({ ...prev, type: 'all' }));
      }
      setPage(1);
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const clearFilters = () => {
    const reset = { search: '', location: '', type: 'all' };
    setFilters(reset);
    setActiveFilters(reset);
    setPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-7xl mx-auto flex flex-col h-full">
      <div className="mb-stack-lg">
        <h1 className="font-h1 text-h1 text-primary mb-stack-md">Search Jobs</h1>
        <div className="flex flex-col md:flex-row gap-stack-sm bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex-1 flex items-center bg-surface-variant/30 rounded-[8px] px-3 focus-within:border-secondary border border-outline-variant transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input 
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none focus:ring-0 text-body-md py-3 text-on-surface placeholder-on-surface-variant outline-none" 
              placeholder="Job title, keywords, or company" 
              type="text" 
            />
          </div>
          <div className="flex-1 flex items-center bg-surface-variant/30 rounded-[8px] px-3 focus-within:border-secondary border border-outline-variant transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">location_on</span>
            <input 
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none focus:ring-0 text-body-md py-3 text-on-surface placeholder-on-surface-variant outline-none" 
              placeholder="City, state, or remote" 
              type="text" 
            />
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-secondary text-on-secondary font-body-md font-bold px-6 py-3 rounded-lg hover:bg-secondary-container transition-colors flex items-center gap-2 justify-center"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-gutter flex-1">
        {/* Filters Panel */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-stack-md">
          <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-h3 text-h3 text-primary">Filters</h3>
              <button onClick={clearFilters} className="text-secondary font-label-sm text-label-sm hover:underline">Clear all</button>
            </div>
            {/* Job Type */}
            <div className="mb-stack-md border-b border-outline-variant pb-stack-md">
              <h4 className="font-body-md font-semibold text-primary mb-stack-sm">Job Type</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="full_time" checked={filters.type === 'full_time'} onChange={handleFilterChange} className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                  <span className="font-body-md text-on-surface-variant break-words">Full-time</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="contract" checked={filters.type === 'contract'} onChange={handleFilterChange} className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                  <span className="font-body-md text-on-surface-variant break-words">Contract</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="part_time" checked={filters.type === 'part_time'} onChange={handleFilterChange} className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                  <span className="font-body-md text-on-surface-variant break-words">Part-time</span>
                </label>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Job Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-stack-md">
            <span className="font-body-md text-on-surface-variant">Showing <strong className="text-primary">{jobs.length}</strong> jobs</span>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-on-surface-variant whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-primary py-1 px-3 focus:ring-secondary focus:border-secondary outline-none"
              >
                <option>Best match</option>
                <option>Newest</option>
                <option>Salary high to low</option>
              </select>
            </div>
          </div>
          
          {/* Results List */}
          {loading ? (
            <div className="flex-1 flex justify-center items-center py-12">
              <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {jobs.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(job => (
                  <SeekerJobCard key={job.id} job={job} />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-stack-md bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant">
                <button className="w-full sm:w-auto px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span className="text-on-surface-variant font-label-md">Page {page} of {Math.max(1, Math.ceil(jobs.length / itemsPerPage))}</span>
                <button className="w-full sm:w-auto px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page * itemsPerPage >= jobs.length} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </>
          ) : (
            <SeekerEmptyState 
              icon="search_off"
              title="No jobs found"
              description="We couldn't find any jobs matching your current filters. Try adjusting your search criteria."
              action={
                <button onClick={clearFilters} className="px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container">
                  Clear Filters
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

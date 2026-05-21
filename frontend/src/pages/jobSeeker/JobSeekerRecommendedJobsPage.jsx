import { useState, useEffect } from 'react';
import { getRecommendedJobs } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import SeekerJobCard from '../../components/jobSeeker/SeekerJobCard';
import SeekerEmptyState from '../../components/jobSeeker/SeekerEmptyState';

export default function JobSeekerRecommendedJobsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
  });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [sortBy, setSortBy] = useState('Best match');
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const result = await getRecommendedJobs(activeFilters);
        
        if (result.needsCvUpload) {
          setErrorStatus(403);
          setRecommendations([]);
        } else {
          // Sort
          if (sortBy === 'Newest') {
            result.sort((a, b) => new Date(b.job.postedAt) - new Date(a.job.postedAt));
          } else if (sortBy === 'Salary high to low') {
            result.sort((a, b) => (b.job.salaryMax || 0) - (a.job.salaryMax || 0));
          } else {
            // Best match
            result.sort((a, b) => b.matchScore - a.matchScore);
          }
          setRecommendations(result);
          setErrorStatus(null);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        setErrorStatus(500);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
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
  };

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-7xl mx-auto flex flex-col h-full">
      <SeekerPageHeader 
        title="Recommended Jobs" 
        subtitle="Jobs matched specifically to your skills and preferences." 
        icon="auto_awesome"
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
            placeholder="Search within your recommendations..." 
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
        {/* Results */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-stack-md">
            <span className="font-body-md text-on-surface-variant">Showing <strong className="text-primary">{recommendations.length}</strong> matches</span>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-on-surface-variant">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-primary py-1 px-3 focus:ring-secondary focus:border-secondary outline-none"
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
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {recommendations.map(rec => (
                <SeekerJobCard key={rec.id} job={{...rec.job, recommendation: rec}} />
              ))}
            </div>
          ) : errorStatus === 403 ? (
            <SeekerEmptyState 
              icon="lock"
              title="Recommendations Locked"
              description="Please upload your CV and fill your profile to unlock personalized AI job recommendations."
              action={
                <a href="/seeker/cv-upload" className="px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container">
                  Upload CV
                </a>
              }
            />
          ) : (
            <SeekerEmptyState 
              icon="search_off"
              title="No recommendations found"
              description="We couldn't find any job recommendations matching your criteria."
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

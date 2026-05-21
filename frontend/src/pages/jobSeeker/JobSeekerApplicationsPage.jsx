import { useState, useEffect } from 'react';
import { getApplications } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import SeekerApplicationCard from '../../components/jobSeeker/SeekerApplicationCard';
import SeekerEmptyState from '../../components/jobSeeker/SeekerEmptyState';

export default function JobSeekerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const result = await getApplications({ status: filterStatus });
        // Sort by applied date (newest first)
        result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(result);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [filterStatus]);

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-7xl mx-auto flex flex-col h-full">
      <SeekerPageHeader 
        title="My Applications" 
        subtitle="Track the status of your job applications." 
        icon="work_history"
      />
      
      <div className="mb-stack-md flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => { setFilterStatus('all'); setPage(1); }}
          className={`px-4 py-2 rounded-full font-label-md whitespace-nowrap border transition-colors ${filterStatus === 'all' ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
        >
          All Applications
        </button>
        <button 
          onClick={() => { setFilterStatus('under_review'); setPage(1); }}
          className={`px-4 py-2 rounded-full font-label-md whitespace-nowrap border transition-colors ${filterStatus === 'under_review' ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
        >
          Under Review
        </button>
        <button 
          onClick={() => { setFilterStatus('shortlisted'); setPage(1); }}
          className={`px-4 py-2 rounded-full font-label-md whitespace-nowrap border transition-colors ${filterStatus === 'shortlisted' ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
        >
          Shortlisted
        </button>
        <button 
          onClick={() => { setFilterStatus('rejected'); setPage(1); }}
          className={`px-4 py-2 rounded-full font-label-md whitespace-nowrap border transition-colors ${filterStatus === 'rejected' ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
        >
          Rejected
        </button>
      </div>
      
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-gutter">
            {applications.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(app => (
              <SeekerApplicationCard key={app.id} application={app} />
            ))}
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-stack-md bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant">
              <button className="w-full sm:w-auto px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span className="text-on-surface-variant font-label-md">Page {page} of {Math.max(1, Math.ceil(applications.length / itemsPerPage))}</span>
              <button className="w-full sm:w-auto px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page * itemsPerPage >= applications.length} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        ) : (
          <SeekerEmptyState 
            icon="description"
            title="No applications found"
            description={filterStatus === 'all' ? "You haven't applied to any jobs yet." : `You don't have any applications with status: ${filterStatus.replace('_', ' ')}.`}
            action={
              <button onClick={() => setFilterStatus('all')} className="px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container">
                View All Applications
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}

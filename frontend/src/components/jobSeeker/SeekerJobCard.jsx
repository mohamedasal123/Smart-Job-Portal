import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isJobSaved, toggleSavedJob } from '../../services/jobSeekerDataService';
import { useToast } from '../useToast';
import MatchScoreBadge from './MatchScoreBadge';

export default function SeekerJobCard({ job, onSavedStateChange }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const checkSaved = async () => {
      const saved = await isJobSaved(job.id);
      setIsSaved(saved);
    };
    checkSaved();
  }, [job.id]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const result = await toggleSavedJob(job.id);
      setIsSaved(result.isSaved);
      addToast({
        title: result.isSaved ? 'Job Saved' : 'Job Removed',
        message: result.isSaved ? 'Added to your saved jobs wishlist.' : 'Removed from your saved jobs wishlist.',
        type: 'success',
      });
      if (onSavedStateChange) {
        onSavedStateChange(job.id, result.isSaved);
      }
    } catch {
      addToast({
        title: 'Error',
        message: 'Could not update saved status.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified';
    return `${min ? min.toLocaleString() : ''} - ${max ? max.toLocaleString() : ''} ${currency || ''}`;
  };

  const matchScore = job.recommendation?.matchScore || job.matchScore;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col h-full relative group overflow-hidden">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-xl">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
            ) : (
              job.company.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-h3 text-h3 text-primary truncate pr-2" title={job.title}>{job.title}</h3>
            <p className="font-body-md text-body-md text-secondary truncate">{job.company}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {matchScore && (
            <MatchScoreBadge score={matchScore} size="sm" showLabel={false} />
          )}
          <button 
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-secondary hover:bg-secondary/10' : 'text-on-surface-variant hover:text-secondary hover:bg-surface-variant/50'}`}
            title={isSaved ? "Remove from saved jobs" : "Save this job"}
          >
            <span className={`material-symbols-outlined text-[22px] ${isSaved ? 'fill-current' : ''}`} style={{ fontVariationSettings: isSaved ? '"FILL" 1' : '"FILL" 0' }}>
              bookmark
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant text-xs font-medium">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant text-xs font-medium">
          <span className="material-symbols-outlined text-[14px]">work</span>
          {job.type === 'full_time' ? 'Full Time' : job.type}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant text-xs font-medium">
          <span className="material-symbols-outlined text-[14px]">payments</span>
          {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
        </span>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-6 flex-1">
        {job.description}
      </p>

      <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between">
        <span className="font-body-sm text-xs text-on-surface-variant">
          Posted {new Date(job.postedAt).toLocaleDateString()}
        </span>
        <Link
          to={`/seeker/jobs/${job.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-label-md border border-secondary text-secondary hover:bg-secondary/10 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

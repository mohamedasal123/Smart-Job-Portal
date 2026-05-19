import { Link } from 'react-router-dom';
import SeekerStatusBadge from './SeekerStatusBadge';
import MatchScoreBadge from './MatchScoreBadge';

export default function SeekerApplicationCard({ application }) {
  const { job } = application;
  
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-xl">
            {job?.companyLogo ? (
              <img src={job.companyLogo} alt={job?.company} className="w-full h-full object-cover rounded-lg" />
            ) : (
              job?.company?.charAt(0) || 'C'
            )}
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-primary">{job?.title || 'Unknown Job'}</h3>
            <p className="font-body-md text-body-md text-secondary">{job?.company || 'Unknown Company'}</p>
          </div>
        </div>
        <div>
          <SeekerStatusBadge status={application.status} />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-6 text-sm text-on-surface-variant">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Applied {new Date(application.appliedAt).toLocaleDateString()}
          </span>
          {application.matchScore && (
            <MatchScoreBadge score={application.matchScore} size="sm" showLabel={true} />
          )}
        </div>
        
        <Link
          to={`/seeker/applications/${application.id}`}
          className="text-secondary font-label-md hover:underline flex items-center gap-1"
        >
          View Details
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

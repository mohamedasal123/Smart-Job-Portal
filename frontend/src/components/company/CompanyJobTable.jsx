import { Link } from 'react-router-dom';
import CompanyEmptyState from './CompanyEmptyState';
import CompanyStatusBadge from './CompanyStatusBadge';

export default function CompanyJobTable({ jobs, onToggleStatus, onDeleteRequest }) {
  if (!jobs.length) {
    return <CompanyEmptyState title="No jobs match your filters" message="Try a different search, status, or sort option." />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
      <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-sm bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        <div className="col-span-4">Job</div>
        <div className="col-span-2 flex justify-center">Status</div>
        <div className="col-span-2 text-center">Applicants</div>
        <div className="col-span-2 text-center">Views</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>
      {jobs.map((job) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-t border-outline-variant items-center" key={job.id}>
          <div className="col-span-4 min-w-0">
            <Link className="font-h3 text-h3 text-primary hover:text-secondary truncate block" to={`/company/jobs/${job.id}`}>{job.title}</Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{job.location} · {job.type}</p>
          </div>
          <div className="col-span-2 flex justify-center"><CompanyStatusBadge status={job.status} /></div>
          <div className="col-span-2 text-center">
            <Link className="text-secondary font-semibold hover:underline" to={`/company/jobs/${job.id}/applicants`}>{job.applicationsCount}</Link>
          </div>
          <div className="col-span-2 text-center text-on-surface-variant">{job.views}</div>
          <div className="col-span-2 flex justify-center gap-2">
            <Link className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" title="View details" to={`/company/jobs/${job.id}`}><span className="material-symbols-outlined text-[20px]">visibility</span></Link>
            <Link className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" title="Edit" to={`/company/jobs/${job.id}/edit`}><span className="material-symbols-outlined text-[20px]">edit</span></Link>
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" title={job.status === 'active' ? 'Pause' : 'Publish'} onClick={() => onToggleStatus(job.id)}>
              <span className="material-symbols-outlined text-[20px]">{job.status === 'active' ? 'pause' : 'publish'}</span>
            </button>
            <button className="p-2 rounded-lg text-error hover:bg-error-container transition-colors" title="Delete" onClick={() => onDeleteRequest(job)}>
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

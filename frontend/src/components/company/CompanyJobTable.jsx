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
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Applicants</div>
        <div className="col-span-2">Views</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {jobs.map((job) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-t border-outline-variant items-center" key={job.id}>
          <div className="col-span-4">
            <Link className="font-h3 text-h3 text-primary hover:text-secondary" to={`/company/jobs/${job.id}`}>{job.title}</Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{job.location} · {job.type}</p>
          </div>
          <div className="col-span-2"><CompanyStatusBadge status={job.status} /></div>
          <div className="col-span-2">
            <Link className="text-secondary font-semibold hover:underline" to={`/company/jobs/${job.id}/applicants`}>{job.applicationsCount}</Link>
          </div>
          <div className="col-span-2 text-on-surface-variant">{job.views}</div>
          <div className="col-span-2 flex justify-end gap-unit">
            <Link className="p-2 rounded-lg hover:bg-surface-container-high" title="View" to={`/company/jobs/${job.id}`}><span className="material-symbols-outlined">visibility</span></Link>
            <Link className="p-2 rounded-lg hover:bg-surface-container-high" title="Edit" to={`/company/jobs/${job.id}/edit`}><span className="material-symbols-outlined">edit</span></Link>
            <Link className="p-2 rounded-lg hover:bg-surface-container-high" title="Preview" to={`/company/jobs/${job.id}/preview`}><span className="material-symbols-outlined">preview</span></Link>
            <button className="p-2 rounded-lg hover:bg-surface-container-high" title={job.status === 'active' ? 'Pause' : 'Publish'} onClick={() => onToggleStatus(job.id)}>
              <span className="material-symbols-outlined">{job.status === 'active' ? 'pause' : 'publish'}</span>
            </button>
            <button className="p-2 rounded-lg text-error hover:bg-error-container" title="Delete" onClick={() => onDeleteRequest(job)}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

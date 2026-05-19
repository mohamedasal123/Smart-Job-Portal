import { Link } from 'react-router-dom';
import AdminEmptyState from './AdminEmptyState';
import AdminStatusBadge from './AdminStatusBadge';

export default function AdminJobTable({ jobs, onDeleteRequest }) {
  if (!jobs.length) {
    return <AdminEmptyState title="No jobs match your filters" message="Try a different search, status, reported, or sort option." />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
      <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-sm bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        <div className="col-span-3">Job</div>
        <div className="col-span-2">Company</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-1">Applicants</div>
        <div className="col-span-1">Reports</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {jobs.map((job) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-t border-outline-variant items-center" key={job.id}>
          <div className="col-span-3">
            <Link className="font-h3 text-h3 text-primary hover:text-secondary" to={`/admin/jobs/${job.id}`}>{job.title}</Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{job.postedAt}</p>
          </div>
          <div className="col-span-2 text-on-surface-variant">{job.company}</div>
          <div className="col-span-2 text-on-surface-variant">{job.location}</div>
          <div className="col-span-1 text-on-surface-variant">{job.applicantsCount}</div>
          <div className="col-span-1 text-on-surface-variant">{job.reportsCount || 0}</div>
          <div className="col-span-1"><AdminStatusBadge status={job.status} /></div>
          <div className="col-span-2 flex justify-end gap-unit">
            <Link className="p-2 rounded-lg hover:bg-surface-container-high" title="View details" to={`/admin/jobs/${job.id}`}>
              <span className="material-symbols-outlined">visibility</span>
            </Link>
            <button className="p-2 rounded-lg text-error hover:bg-error-container" onClick={() => onDeleteRequest(job)} title="Force delete">
              <span className="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

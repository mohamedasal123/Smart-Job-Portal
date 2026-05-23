import { Link } from 'react-router-dom';

export default function ApplicantStatusActions({ applicant, onShortlist, onReject, onApprove, compact = false }) {
  const normalizedStatus = String(applicant.status || '').toLowerCase();
  const isShortlisted = normalizedStatus === 'shortlisted';
  const buttonClass = compact
    ? 'p-2 rounded-lg hover:bg-surface-container-high'
    : 'inline-flex items-center gap-unit px-3 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-low font-label-md text-label-md';

  return (
    <div className={`flex flex-wrap gap-unit ${compact ? 'justify-end' : 'mt-stack-md'}`}>
      <Link className={buttonClass} to={`/company/applicants/${applicant.id}`}>
        <span className="material-symbols-outlined text-[18px]">person</span>{!compact && 'Profile'}
      </Link>
      <Link className={buttonClass} to={`/company/applicants/${applicant.id}/matching`}>
        <span className="material-symbols-outlined text-[18px]">analytics</span>{!compact && 'Matching'}
      </Link>
      <Link className={buttonClass} to={`/company/applicants/${applicant.id}/cv`}>
        <span className="material-symbols-outlined text-[18px]">download</span>{!compact && 'CV'}
      </Link>
      <button className={`${buttonClass} ${isShortlisted ? 'text-[#F59E0B]' : 'text-[#15803D]'}`} onClick={() => onShortlist({ ...applicant, nextStatus: isShortlisted ? 'under_review' : 'shortlisted' })}>
        <span className="material-symbols-outlined text-[18px]">{isShortlisted ? 'undo' : 'check_circle'}</span>{!compact && (isShortlisted ? 'Unshortlist' : 'Shortlist')}
      </button>
      <button className={`${buttonClass} text-[#0284C7]`} onClick={() => onApprove?.(applicant)}>
        <span className="material-symbols-outlined text-[18px]">verified</span>{!compact && 'Approve'}
      </button>
      <button className={`${buttonClass} text-error`} onClick={() => onReject(applicant)}>
        <span className="material-symbols-outlined text-[18px]">cancel</span>{!compact && 'Reject'}
      </button>
    </div>
  );
}

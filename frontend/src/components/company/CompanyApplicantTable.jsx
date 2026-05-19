import { Link } from 'react-router-dom';
import ApplicantMatchScore from './ApplicantMatchScore';
import ApplicantStatusActions from './ApplicantStatusActions';
import CompanyEmptyState from './CompanyEmptyState';
import CompanyStatusBadge from './CompanyStatusBadge';

export default function CompanyApplicantTable({ applicants, onShortlist, onReject }) {
  if (!applicants.length) {
    return <CompanyEmptyState title="No applicants match your filters" message="Try a different search, status, or sort option." />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
      {applicants.map((applicant) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-b border-outline-variant items-center" key={applicant.id}>
          <div className="col-span-4 flex items-center gap-stack-md">
            <img alt={applicant.name} className="w-11 h-11 rounded-full object-cover" src={applicant.avatar || undefined} />
            <div>
              <Link className="font-h3 text-h3 text-primary hover:text-secondary" to={`/company/applicants/${applicant.id}`}>{applicant.name}</Link>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{applicant.title}</p>
            </div>
          </div>
          <div className="col-span-2"><ApplicantMatchScore score={applicant.matchScore} /></div>
          <div className="col-span-2"><CompanyStatusBadge status={applicant.status} /></div>
          <div className="col-span-1 text-on-surface-variant">{applicant.yearsExperience} yrs</div>
          <div className="col-span-3">
            <ApplicantStatusActions applicant={applicant} compact onReject={onReject} onShortlist={onShortlist} />
          </div>
        </div>
      ))}
    </div>
  );
}

const statusStyles = {
  active: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30',
  paused: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  draft: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
  closed: 'bg-error-container text-error border-error/20',
  new: 'bg-[#3B82F6]/10 text-[#2563EB] border-[#3B82F6]/30',
  under_review: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  shortlisted: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30',
  rejected: 'bg-error-container text-error border-error/20',
};

const labels = {
  active: 'Active',
  paused: 'Paused',
  draft: 'Draft',
  closed: 'Closed',
  new: 'New',
  under_review: 'Under review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
};

export default function CompanyStatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-label-sm text-label-sm ${statusStyles[normalized] || statusStyles.draft}`}>
      {labels[normalized] || status}
    </span>
  );
}

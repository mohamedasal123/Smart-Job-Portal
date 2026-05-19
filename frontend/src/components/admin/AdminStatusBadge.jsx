const styles = {
  active: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30',
  banned: 'bg-error-container text-error border-error/20',
  verified: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30',
  unverified: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  paused: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  draft: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
  deleted: 'bg-error-container text-error border-error/20',
  success: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/30',
  pending: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  warning: 'bg-error-container text-error border-error/20',
};

const labels = {
  active: 'Active',
  banned: 'Banned',
  verified: 'Verified',
  unverified: 'Unverified',
  paused: 'Paused',
  draft: 'Draft',
  deleted: 'Deleted',
  success: 'Success',
  pending: 'Pending',
  warning: 'Warning',
};

export default function AdminStatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-label-sm text-label-sm ${styles[key] || styles.draft}`}>
      {labels[key] || status}
    </span>
  );
}

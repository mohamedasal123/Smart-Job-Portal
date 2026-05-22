export default function SeekerStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'applied':
        return { bg: 'bg-[#2563EB]/10 border border-[#2563EB]/30', text: 'text-[#2563EB]', label: 'Applied', icon: 'send' };
      case 'under_review':
        return { bg: 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30', text: 'text-[#8B5CF6]', label: 'Under Review', icon: 'visibility' };
      case 'shortlisted':
        return { bg: 'bg-[#22C55E]/10 border border-[#22C55E]/30', text: 'text-[#22C55E]', label: 'Shortlisted', icon: 'star' };
      case 'rejected':
        return { bg: 'bg-[#EF4444]/10 border border-[#EF4444]/30', text: 'text-[#EF4444]', label: 'Rejected', icon: 'cancel' };
      default:
        return { bg: 'bg-surface-variant', text: 'text-on-surface-variant', label: status, icon: 'info' };
    }
  };

  const styles = getStatusStyles();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-sm ${styles.bg} ${styles.text}`}>
      <span className="material-symbols-outlined text-[14px]">{styles.icon}</span>
      {styles.label}
    </span>
  );
}

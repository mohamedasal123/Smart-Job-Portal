export default function SeekerStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'applied':
        return { bg: 'bg-primary-container', text: 'text-on-primary-container', label: 'Applied', icon: 'send' };
      case 'under_review':
        return { bg: 'bg-secondary-container', text: 'text-on-secondary-container', label: 'Under Review', icon: 'visibility' };
      case 'shortlisted':
        return { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', label: 'Shortlisted', icon: 'star' }; // Using custom colors to match success tone
      case 'rejected':
        return { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Rejected', icon: 'cancel' };
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

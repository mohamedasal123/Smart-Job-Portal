import AdminStatusBadge from './AdminStatusBadge';

export default function AdminActivityItem({ item, onClick }) {
  return (
    <button
      className="w-full text-left flex items-start gap-stack-md border-b border-outline-variant py-stack-md last:border-b-0 hover:bg-surface-container-low transition-colors rounded-lg px-stack-sm"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined">history</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-h3 text-h3 text-primary">{item.action}</p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {item.performedBy} · {item.targetType} · {item.targetName}
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{new Date(item.createdAt).toLocaleString()}</p>
      </div>
      <AdminStatusBadge status={item.status} />
    </button>
  );
}

import { Link } from 'react-router-dom';

export default function AdminStatsCard({ icon, label, value, to }) {
  const content = (
    <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-ambient hover:shadow-hover transition-all">
      <div className="flex items-center justify-between">
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        <span className="font-display text-[34px] leading-none text-primary">{value}</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mt-stack-md">{label}</p>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

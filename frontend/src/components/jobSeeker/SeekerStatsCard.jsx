export default function SeekerStatsCard({ title, value, icon, description, onClick }) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-left ${
        onClick ? 'hover:border-secondary hover:shadow-sm cursor-pointer transition-all' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <div>
          <h3 className="font-h1 text-h1 text-primary">{value}</h3>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
        </div>
      </div>
      {description && <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
    </Component>
  );
}

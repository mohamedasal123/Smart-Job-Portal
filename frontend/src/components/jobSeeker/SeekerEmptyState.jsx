export default function SeekerEmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed">
      <div className="w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[32px]">{icon || 'inbox'}</span>
      </div>
      <h3 className="font-h2 text-h2 text-primary mb-2">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}

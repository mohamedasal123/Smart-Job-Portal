export default function AdminEmptyState({ title = 'Nothing found', message = 'Try adjusting your filters.' }) {
  return (
    <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-stack-lg text-center">
      <span className="material-symbols-outlined text-[48px] text-outline mb-stack-sm">manage_search</span>
      <h3 className="font-h2 text-h2 text-primary">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mt-unit">{message}</p>
    </div>
  );
}

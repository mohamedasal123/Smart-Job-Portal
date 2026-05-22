export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8 pb-6 border-b border-outline-variant">
      <div className="flex-1">
        {eyebrow && <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-2">{eyebrow}</p>}
        <h1 className="font-h1 text-h1 text-primary break-words">{title}</h1>
        {description && <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-3xl break-words">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

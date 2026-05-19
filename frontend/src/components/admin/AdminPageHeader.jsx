export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-stack-md md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-unit">{eyebrow}</p>}
        <h1 className="font-h1 text-h1 text-primary">{title}</h1>
        {description && <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm max-w-3xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-stack-sm">{actions}</div>}
    </div>
  );
}

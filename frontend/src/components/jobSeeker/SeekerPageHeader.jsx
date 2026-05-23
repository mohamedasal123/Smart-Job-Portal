import { Link } from 'react-router-dom';

export default function SeekerPageHeader({ title, subtitle, actionLabel, actionTo, actionOnClick, icon }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8 pb-6 border-b border-outline-variant">
      <div className="flex-1">
        {icon && (
          <p className="inline-flex items-center gap-unit font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-2">
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            Job Seeker
          </p>
        )}
        <h1 className="font-h1 text-h1 text-primary break-words">{title}</h1>
        {subtitle && <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-3xl break-words">{subtitle}</p>}
      </div>
      {(actionLabel && (actionTo || actionOnClick)) && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center justify-center w-full sm:w-auto gap-unit bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 shadow-sm hover:opacity-90 transition-opacity"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center justify-center w-full sm:w-auto gap-unit bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 shadow-sm hover:opacity-90 transition-opacity"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

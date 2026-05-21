import { Link } from 'react-router-dom';

export default function SeekerPageHeader({ title, subtitle, actionLabel, actionTo, actionOnClick, icon }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg border-b border-outline-variant pb-stack-md">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
          </div>
        )}
        <div>
          <h1 className="font-h1 text-h1 text-primary">{title}</h1>
          {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
      </div>
      {(actionLabel && (actionTo || actionOnClick)) && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 rounded-lg font-label-md bg-secondary text-on-secondary hover:bg-secondary-container transition-all hover:-translate-y-0.5 shadow-sm"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 rounded-lg font-label-md bg-secondary text-on-secondary hover:bg-secondary-container transition-all hover:-translate-y-0.5 shadow-sm"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

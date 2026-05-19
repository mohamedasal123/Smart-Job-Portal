import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const salaryCards = [
  { role: 'Product Designer', range: '$92k - $138k', trend: '+8%' },
  { role: 'Frontend Engineer', range: '$105k - $162k', trend: '+11%' },
  { role: 'Data Analyst', range: '$78k - $119k', trend: '+6%' },
];

export default function SalariesPage() {
  return (
    <div className="stitch-page bg-background text-on-background font-body-md text-body-md min-h-screen">
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
        <div className="max-w-container mx-auto px-gutter h-20 flex items-center justify-between">
          <Link className="font-h2 text-h2 font-bold text-primary flex items-center gap-2" to={ROUTES.HOME}>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>work</span>
            Smart Job Portal
          </Link>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.JOBS}>Browse Jobs</Link>
            <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.COMPANIES}>Companies</Link>
            <Link className="font-h3 text-h3 font-semibold text-secondary border-b-2 border-secondary pb-1" to={ROUTES.SALARIES}>Salaries</Link>
          </nav>
          <Link className="hidden md:inline-flex items-center justify-center font-body-md font-bold bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity" to={ROUTES.LOGIN}>
            Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-container mx-auto px-gutter py-margin-desktop space-y-gutter">
        <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-stack-sm">Salary Guide</p>
          <h1 className="font-display text-display text-primary mb-stack-sm">Compare pay by role and market</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Explore compensation benchmarks so candidates and hiring teams can make clearer decisions.
          </p>
          <div className="mt-gutter grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-stack-md">
            <input className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary" placeholder="Job title or skill" type="search" />
            <input className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary" placeholder="Location" type="search" />
            <button className="bg-secondary text-on-secondary font-h3 text-h3 px-gutter py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {salaryCards.map((item) => (
            <article className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-ambient" key={item.role}>
              <div className="flex items-center justify-between mb-stack-md">
                <span className="material-symbols-outlined text-secondary">payments</span>
                <span className="font-label-md text-label-md text-secondary bg-secondary-container px-stack-sm py-unit rounded-full">{item.trend}</span>
              </div>
              <h2 className="font-h2 text-h2 text-primary">{item.role}</h2>
              <p className="font-display text-[32px] leading-tight text-primary mt-stack-md">{item.range}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Estimated annual base salary</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

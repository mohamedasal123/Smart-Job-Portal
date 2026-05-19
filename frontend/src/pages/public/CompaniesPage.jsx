import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { getPublicCompanies } from '../../services/publicDataService';

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    getPublicCompanies().then((data) => {
      setAllCompanies(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setPage(1);
  };

  const filteredCompanies = allCompanies.filter(c => {
    if (!activeSearch) return true;
    const s = activeSearch.toLowerCase();
    return c.name?.toLowerCase().includes(s) || c.industry?.toLowerCase().includes(s) || c.location?.toLowerCase().includes(s);
  });
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
            <Link className="font-h3 text-h3 font-semibold text-secondary border-b-2 border-secondary pb-1" to={ROUTES.COMPANIES}>Companies</Link>
            <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.SALARIES}>Salaries</Link>
          </nav>
          <Link className="hidden md:inline-flex items-center justify-center font-body-md font-bold bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity" to={ROUTES.LOGIN}>
            Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-container mx-auto px-gutter py-margin-desktop space-y-gutter">
        <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-stack-sm">Company Directory</p>
          <h1 className="font-display text-display text-primary mb-stack-sm">Explore companies hiring now</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Search organizations by industry, location, and open roles to find teams that match your career goals.
          </p>
          <div className="mt-gutter grid grid-cols-1 md:grid-cols-[1fr_auto] gap-stack-md">
            <label className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary" 
                placeholder="Search by company, industry, or city" 
                type="search" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </label>
            <button 
              className="bg-secondary text-on-secondary font-h3 text-h3 px-gutter py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              onClick={handleSearch}
            >
              Search Companies
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-outline text-[48px] mb-4">domain_disabled</span>
            <h3 className="font-h3 text-h3 text-primary mb-2">No companies match your search</h3>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((company) => (
                <Link
                  className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-ambient hover:shadow-hover hover:-translate-y-1 transition-all"
                  key={company.id}
                  to={`/companies/${company.id}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-stack-md overflow-hidden">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>domain</span>
                    )}
                  </div>
                  <h2 className="font-h2 text-h2 text-primary mb-unit">{company.name}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{company.industry || 'Tech'}</p>
                  <div className="mt-stack-md flex items-center justify-between text-on-surface-variant">
                    <span>{company.location || 'Remote'}</span>
                    <span className="font-label-md text-label-md text-secondary">{company.openPositions} jobs</span>
                  </div>
                </Link>
              ))}
            </section>
            
            {filteredCompanies.length > itemsPerPage && (
              <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant mt-4">
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span className="text-on-surface-variant font-label-md">Page {page} of {Math.ceil(filteredCompanies.length / itemsPerPage)}</span>
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page * itemsPerPage >= filteredCompanies.length} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
        
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { getPublicCompanyById, getPublicJobs } from '../../services/publicDataService';

export default function PublicCompanyProfilePage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      try {
        const data = await getPublicCompanyById(id);
        setCompany(data);
        
        // Fetch jobs for this company if possible
        // The backend might support filtering by company_id, so we try:
        try {
          const jobsData = await getPublicJobs({ company_id: id });
          // If the backend doesn't filter, we'll manually filter them
          const companyJobs = jobsData.filter(j => String(j.companyId) === String(id) || String(j.company) === String(data.name));
          setJobs(companyJobs);
        } catch (e) {
          console.error("Failed to fetch company jobs", e);
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchCompanyAndJobs();
  }, [id]);

  if (loading) return (
    <div className="stitch-page bg-background flex flex-col min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      </div>
    </div>
  );

  if (!company) return (
    <div className="stitch-page bg-background flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">domain_disabled</span>
        <p className="text-on-surface-variant font-body-lg">Company not found or is no longer available.</p>
        <Link to={ROUTES.COMPANIES} className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-bold">Browse Companies</Link>
      </div>
    </div>
  );

  return (
    <div className="stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen">
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

      <main className="max-w-container mx-auto px-gutter py-margin-desktop space-y-gutter flex-grow w-full">
        <nav className="flex items-center gap-2 text-on-surface-variant font-body-md mb-6">
          <Link className="hover:text-secondary transition-colors" to={ROUTES.COMPANIES}>Companies</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-semibold">{company.name}</span>
        </nav>

        <section className="bg-surface-container-lowest rounded-xl p-stack-xl shadow-ambient border border-outline-variant flex flex-col md:flex-row items-start md:items-center gap-stack-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: '"FILL" 1' }}>domain</span>
          </div>
          
          <div className="w-24 h-24 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center p-2 shrink-0 z-10 overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">domain</span>
            )}
          </div>
          
          <div className="flex-grow z-10">
            <h1 className="font-display text-display text-primary mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant font-body-md">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">category</span> {company.industry}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {company.location}</span>
              {company.employees && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">group</span> {company.employees} Employees</span>}
              {company.website && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">language</span> <a href={company.website} target="_blank" rel="noreferrer" className="text-secondary hover:underline text-body-sm">{company.website.replace(/^https?:\/\//, '')}</a></span>}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 space-y-gutter">
            <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">About {company.name}</h2>
              <p className="font-body-lg text-on-surface-variant whitespace-pre-wrap">{company.description || "No description provided."}</p>
            </section>

            {jobs.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
                <div className="flex items-center justify-between mb-stack-md">
                  <h2 className="font-h2 text-h2 text-primary">Open Positions ({jobs.length})</h2>
                </div>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="block border border-outline-variant rounded-lg p-4 hover:border-secondary transition-colors group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-h3 text-h3 text-primary group-hover:text-secondary transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-on-surface-variant font-body-sm">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {job.location}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {job.type?.replace('_', '-')}</span>
                          </div>
                        </div>
                        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-gutter">
            {company.benefits?.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-ambient border border-outline-variant">
                <h2 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">verified</span>
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {company.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-on-surface-variant font-body-md">
                      <span className="material-symbols-outlined text-[18px] text-success shrink-0 mt-0.5">check_circle</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="bg-secondary-container/30 rounded-xl p-stack-lg border border-secondary/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">notifications_active</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary mb-2">Get Job Alerts</h3>
              <p className="font-body-md text-on-surface-variant mb-4">
                Receive notifications when {company.name} posts new jobs.
              </p>
              <Link to={ROUTES.LOGIN} className="w-full py-2 bg-secondary text-on-secondary rounded-lg font-bold hover:bg-secondary-container transition-colors">
                Log in to Subscribe
              </Link>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant w-full py-stack-lg px-margin-desktop mt-auto">
        <div className="flex justify-between items-center max-w-container-max-width mx-auto flex-col md:flex-row gap-4">
          <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
          <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center md:text-left">
            © 2024 Smart Job Portal. Intelligence in Recruitment.
          </div>
        </div>
      </footer>
    </div>
  );
}

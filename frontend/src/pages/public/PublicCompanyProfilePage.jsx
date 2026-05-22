import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import PublicNavBar from '../../components/PublicNavBar';
import { getPublicCompanyById, getPublicJobs } from '../../services/publicDataService';
import { useAuth } from '../../context/useAuth';

import PublicFooter from '../../components/PublicFooter';

export default function PublicCompanyProfilePage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      try {
        const data = await getPublicCompanyById(id);
        if (data && data.company) {
          setCompany(data.company);
          setJobs(data.activeJobs || []);
        } else {
          setCompany(data);
          
          try {
            const jobsData = await getPublicJobs({ company_id: id });
            const companyJobs = jobsData.filter(j => String(j.companyId) === String(id) || String(j.company) === String(data.name));
            setJobs(companyJobs);
          } catch (e) {
            console.error("Failed to fetch company jobs", e);
          }
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
      <PublicNavBar />
      
      {isAdmin && (
        <div className="bg-error-container text-on-error-container w-full py-2 px-4 flex items-center justify-between shadow-sm z-40">
          <div className="flex items-center gap-2 font-bold font-body-sm">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            Admin Controls
          </div>
          <div className="flex gap-2">
            <Link to={`/admin/users/${id}`} className="bg-surface text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-surface-container transition-colors border border-outline-variant">
              View Company in Dashboard
            </Link>
          </div>
        </div>
      )}

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
      <PublicFooter />
    </div>
  );
}

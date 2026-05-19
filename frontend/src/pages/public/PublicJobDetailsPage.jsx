import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { getPublicJobById } from '../../services/publicDataService';

export default function PublicJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getPublicJobById(jobId);
        setJob(data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApplyClick = () => {
    // Login-to-apply flow
    navigate(ROUTES.LOGIN, { state: { returnUrl: `/jobs/${jobId}` } });
  };

  if (loading) return (
    <div className="stitch-page bg-background flex flex-col min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      </div>
    </div>
  );

  if (!job) return (
    <div className="stitch-page bg-background flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">search_off</span>
        <p className="text-on-surface-variant font-body-lg">Job not found or is no longer available.</p>
        <Link to={ROUTES.JOBS} className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-bold">Browse Jobs</Link>
      </div>
    </div>
  );

  return (
    <div className="stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen">
      <header className="bg-surface-container-lowest dark:bg-surface-dim sticky top-0 z-50 w-full shadow-sm shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex justify-between items-center w-full px-margin-desktop py-stack-md max-w-container-max-width mx-auto">
          <div className="flex items-center gap-stack-lg">
            <Link className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed" to={ROUTES.HOME}>Smart Job Portal</Link>
            <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
              <Link className="text-secondary font-h3 text-h3 font-semibold px-3 py-2 rounded-lg bg-surface-container-low" to={ROUTES.JOBS}>Browse Jobs</Link>
              <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low duration-200 px-3 py-2 rounded-lg" to={ROUTES.COMPANIES}>Companies</Link>
              <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low duration-200 px-3 py-2 rounded-lg" to={ROUTES.SALARY_GUIDE}>Salaries</Link>
            </nav>
          </div>
          <div className="flex items-center gap-stack-md">
            <Link className="hidden md:flex items-center justify-center px-4 py-2 border border-outline text-on-surface font-body-md font-semibold rounded-lg hover:bg-surface-container-low transition-colors" to={ROUTES.LOGIN}>Sign In</Link>
            <Link className="flex items-center justify-center px-4 py-2 bg-[#2563EB] text-on-primary font-body-md font-bold rounded-lg hover:bg-secondary-container transition-colors shadow-sm" to={ROUTES.POST_JOB}>Post a Job</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-margin-desktop py-12 flex flex-col gap-8">
        <nav className="flex items-center gap-2 text-on-surface-variant font-body-md">
          <Link className="hover:text-secondary transition-colors" to={ROUTES.JOBS}>Jobs</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-semibold">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-stack-lg">
            {/* Header Card */}
            <div className="bg-surface-container-lowest rounded-[16px] p-stack-xl shadow-sm border border-outline-variant flex flex-col gap-stack-md">
              <div className="flex items-center gap-stack-md">
                <div className="w-16 h-16 rounded-lg border border-surface-variant bg-surface flex items-center justify-center p-2 font-bold text-2xl text-on-surface-variant">
                  {job.companyLogo ? <img alt="Logo" className="w-full h-full object-contain" src={job.companyLogo} /> : job.company?.charAt(0)}
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="font-h1 text-h1 text-primary">{job.title}</h1>
                  <h2 className="font-h3 text-h3 text-on-surface-variant">
                    <Link to={job.companyId ? `/companies/${job.companyId}` : '#'} className="hover:text-secondary transition-colors">{job.company}</Link>
                  </h2>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-stack-md mt-2">
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">location_on</span> {job.location} ({job.workMode})</div>
                <div className="w-1 h-1 rounded-full bg-outline-variant" />
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">payments</span> {job.currency} {job.salaryMin?.toLocaleString() || 0} - {job.salaryMax?.toLocaleString() || 0}</div>
                <div className="w-1 h-1 rounded-full bg-outline-variant" />
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">schedule</span> {job.type?.replace('_', '-')}</div>
              </div>
              
              <div className="flex flex-wrap items-center gap-stack-md mt-4 pt-4 border-t border-surface-variant">
                <button className="bg-secondary text-on-secondary font-body-lg font-bold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-secondary-container transition-colors" onClick={handleApplyClick}>
                  Log in to Apply <span className="material-symbols-outlined">login</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-container-lowest rounded-[16px] p-stack-xl shadow-sm border border-outline-variant flex flex-col gap-stack-lg">
              <div>
                <h3 className="font-h2 text-h2 text-primary">Job Description</h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed mt-4 whitespace-pre-wrap">{job.description}</p>
              </div>
              
              {job.responsibilities?.length > 0 && (
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-3">Responsibilities</h3>
                  <ul className="list-disc pl-5 text-on-surface-variant flex flex-col gap-2">
                    {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              
              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-3">Requirements</h3>
                  <ul className="list-disc pl-5 text-on-surface-variant flex flex-col gap-2">
                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              
              {job.requiredSkills?.length > 0 && (
                <div className="pt-stack-md border-t border-surface-variant">
                  <h3 className="font-h3 text-h3 text-primary mb-3">Skills Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-surface-variant/50 text-on-surface-variant border border-outline-variant rounded-full font-label-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-stack-lg">
            <div className="bg-surface-container-lowest rounded-[16px] p-stack-lg shadow-sm border border-outline-variant flex flex-col gap-stack-md">
              <h3 className="font-h3 text-h3 text-primary">About {job.company}</h3>
              <p className="font-body-md text-on-surface-variant">{job.companyInfo?.description || 'No company info available.'}</p>
              <div className="flex flex-col gap-2 mt-2">
                {job.companyInfo?.employees && <div className="flex items-center gap-2 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-[16px]">business</span> {job.companyInfo.employees} Employees</div>}
                {job.companyInfo?.website && <div className="flex items-center gap-2 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-[16px]">link</span> {job.companyInfo.website}</div>}
              </div>
              {job.companyId && (
                <Link to={`/companies/${job.companyId}`} className="text-secondary font-bold mt-2 hover:underline">
                  View Company Profile
                </Link>
              )}
            </div>
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

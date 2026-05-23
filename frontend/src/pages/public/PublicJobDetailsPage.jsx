import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PublicNavBar from '../../components/PublicNavBar';
import { ROUTES } from '../../utils/constants';
import { getPublicJobById } from '../../services/publicDataService';
import { isJobSaved, toggleSavedJob, trackJobView } from '../../services/jobSeekerDataService';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/useAuth';

import PublicFooter from '../../components/PublicFooter';

export default function PublicJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isJobSeeker = user?.role === 'job_seeker';
  const isOwner = user?.role === 'company' && String(user.profile?.id) === String(job?.companyId);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getPublicJobById(jobId);
        setJob(data);
        if (user?.role === 'job_seeker') {
          trackJobView(jobId).catch(console.error);
          setSaved(await isJobSaved(jobId));
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchJob();
  }, [jobId, user?.role]);

  const salaryText = (() => {
    const min = Number(job?.salaryMin || 0);
    const max = Number(job?.salaryMax || 0);
    const currency = job?.currency === 'USD' || !job?.currency ? '$' : job.currency;

    if (!min && !max) return '';
    if (min && max) return `${Math.round(min / 1000)}K ${currency} - ${Math.round(max / 1000)}K ${currency}`;
    return `${Math.round((min || max) / 1000)}K ${currency}`;
  })();

  const handleApplyClick = () => {
    // Login-to-apply flow
    navigate(ROUTES.LOGIN, { state: { from: { pathname: `/seeker/jobs/${jobId}` } } });
  };

  const handleForceDelete = async () => {
    if (!window.confirm(`Force delete ${job.title}? This marks the job as permanently deleted.`)) return;
    try {
      await adminApi.forceDeleteJob(job.id);
      alert('Job force deleted successfully');
      navigate(ROUTES.JOBS);
    } catch (err) {
      alert('Failed to force delete job');
    }
  };

  const handleSave = async () => {
    if (!isJobSeeker) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/jobs/${jobId}` } } });
      return;
    }

    setSaving(true);
    try {
      const result = await toggleSavedJob(job.id);
      setSaved(result.isSaved);
    } finally {
      setSaving(false);
    }
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
      <PublicNavBar />
      
      {isAdmin && (
        <div className="bg-error-container text-on-error-container w-full py-2 px-4 flex items-center justify-between shadow-sm z-40">
          <div className="flex items-center gap-2 font-bold font-body-sm">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            Admin Controls
          </div>
          <div className="flex gap-2">
            <button onClick={handleForceDelete} className="bg-error text-on-error px-3 py-1 rounded-md text-xs font-bold hover:opacity-90 transition-opacity">
              Force Delete Job
            </button>
            <Link to={`/admin/jobs/${job.id}`} className="bg-surface text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-surface-container transition-colors border border-outline-variant">
              View in Dashboard
            </Link>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="bg-secondary-container text-on-secondary-container w-full py-2 px-4 flex items-center justify-between shadow-sm z-40">
          <div className="flex items-center gap-2 font-bold font-body-sm">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Public View Mode
          </div>
          <div className="flex gap-2">
            <Link to={`/company/jobs/${job.id}/edit`} className="bg-surface text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-surface-container transition-colors border border-outline-variant">
              Edit Job
            </Link>
            <Link to={`/company/jobs/${job.id}/applicants`} className="bg-secondary text-on-secondary px-3 py-1 rounded-md text-xs font-bold hover:opacity-90 transition-opacity">
              Manage Applicants
            </Link>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-7xl mx-auto px-gutter lg:px-margin-desktop py-12 flex flex-col gap-8">
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
                {salaryText && (
                  <>
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">payments</span> {salaryText}</div>
                    <div className="w-1 h-1 rounded-full bg-outline-variant" />
                  </>
                )}
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">schedule</span> {job.type?.replace('_', '-')}</div>
              </div>
              
              <div className="flex flex-wrap items-center gap-stack-md mt-4 pt-4 border-t border-surface-variant">
                <button className="bg-secondary text-on-secondary font-body-lg font-bold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-secondary-container transition-colors" onClick={handleApplyClick}>
                  Log in to Apply <span className="material-symbols-outlined">login</span>
                </button>
                <button className={`border border-outline-variant font-body-lg font-bold py-3 px-5 rounded-lg flex items-center gap-2 transition-colors ${saved ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface text-primary hover:border-secondary hover:text-secondary'}`} disabled={saving} onClick={handleSave} type="button">
                  <span className="material-symbols-outlined">{saved ? 'bookmark' : 'bookmark_add'}</span>
                  {saved ? 'Saved' : 'Save Job'}
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
                <Link to={`/companies/${job.companyId}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 font-label-md text-on-secondary hover:opacity-90 mt-2">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  View Company Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { applyToJob, getApplications, getJobById, isJobSaved, toggleSavedJob } from '../../services/jobSeekerDataService';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../components/useToast';
import MatchScoreBadge from '../../components/jobSeeker/MatchScoreBadge';


export default function JobSeekerJobDetailsPage() {
  const { jobId } = useParams();
  const { addToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
        const isSaved = await isJobSaved(jobId);
        setSaved(isSaved);
        const apps = await getApplications();
        if (apps.some(a => String(a.jobId) === String(jobId))) {
          setHasApplied(true);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    try {
      await applyToJob(jobId);
      setHasApplied(true);
      setShowApplyModal(false);
      addToast({ title: 'Application Submitted', message: `Your application has been sent to ${job?.company}.`, type: 'success' });
    } catch (error) {
      addToast({ title: 'Application failed', message: error.message || 'Could not submit your application.', type: 'error' });
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await toggleSavedJob(jobId);
      setSaved(result.isSaved);
      addToast({ title: result.isSaved ? 'Job Saved' : 'Job Unsaved', message: result.isSaved ? 'Added to saved.' : 'Removed from saved.', type: result.isSaved ? 'success' : 'info' });
    } catch {
      addToast({ title: 'Error', message: 'Could not update saved status.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-margin-desktop flex justify-center items-center h-full"><span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span></div>;
  if (!job) return <div className="p-margin-desktop text-center text-on-surface-variant"><p>Job not found.</p><Link to={ROUTES.SEEKER_JOBS} className="text-secondary hover:underline mt-4 inline-block">Browse Jobs</Link></div>;

  const matchScore = job.recommendation?.matchScore || job.matchScore;
  const matchedSkills = job.recommendation?.matchedSkills || [];

  return (
    <div className="p-margin-desktop max-w-5xl mx-auto flex flex-col h-full pb-12">
      <div className="flex flex-col gap-stack-lg">
        <nav className="flex items-center gap-2 text-on-surface-variant font-body-md">
          <Link className="hover:text-secondary transition-colors" to={ROUTES.SEEKER_JOBS}>Jobs</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-semibold">{job.title}</span>
        </nav>

        {hasApplied && (
          <div className="bg-success-container/20 border border-success rounded-lg p-stack-md flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-success" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span className="font-body-md font-medium text-success">You applied for this job. Your application is under review.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-stack-lg">
            {/* Header Card */}
            <div className="bg-surface-container-lowest rounded-[16px] p-stack-xl shadow-sm border border-outline-variant flex flex-col gap-stack-md relative overflow-hidden">
              <div className="flex items-center gap-stack-md">
                <div className="w-16 h-16 rounded-lg border border-surface-variant bg-surface flex items-center justify-center p-2 font-bold text-2xl text-on-surface-variant">
                  {job.companyLogo ? <img alt="Logo" className="w-full h-full object-contain" src={job.companyLogo} /> : job.company?.charAt(0)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h1 className="font-h1 text-h1 text-primary">{job.title}</h1>
                    {matchScore && <MatchScoreBadge score={matchScore} size="md" showLabel={true} />}
                  </div>
                  <h2 className="font-h3 text-h3 text-on-surface-variant">{job.company}</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-stack-md mt-2">
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">location_on</span> {job.location} ({job.workMode})</div>
                <div className="w-1 h-1 rounded-full bg-outline-variant" />
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">payments</span> {job.currency} {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}</div>
                <div className="w-1 h-1 rounded-full bg-outline-variant" />
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-[18px]">schedule</span> {job.type?.replace('_', '-')}</div>
              </div>
              <div className="flex flex-wrap items-center gap-stack-md mt-4 pt-4 border-t border-surface-variant">
                {hasApplied ? (
                  <button className="bg-success-container/20 text-success font-body-lg font-bold py-3 px-6 rounded-lg flex items-center gap-2 cursor-default border border-success" disabled>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span> Already Applied
                  </button>
                ) : (
                  <button className="bg-secondary text-on-secondary font-body-lg font-bold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-secondary-container transition-colors" onClick={() => setShowApplyModal(true)}>
                    Apply with One Click <span className="material-symbols-outlined">send</span>
                  </button>
                )}
                <button className={`bg-transparent border ${saved ? 'border-secondary text-secondary' : 'border-outline-variant text-on-surface'} font-body-lg font-bold py-3 px-6 rounded-lg hover:bg-surface-variant/30 transition-colors flex items-center gap-2`} onClick={handleSave}>
                  <span className="material-symbols-outlined">{saved ? 'bookmark' : 'bookmark_border'}</span> {saved ? 'Saved' : 'Save Job'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-container-lowest rounded-[16px] p-stack-xl shadow-sm border border-outline-variant flex flex-col gap-stack-lg">
              <div><h3 className="font-h2 text-h2 text-primary">Job Description</h3><p className="font-body-lg text-on-surface-variant leading-relaxed mt-2">{job.description}</p></div>
              {job.responsibilities?.length > 0 && (
                <div><h3 className="font-h3 text-h3 text-primary">Responsibilities</h3><ul className="list-disc pl-5 text-on-surface-variant flex flex-col gap-2 mt-2">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              )}
              {job.requirements?.length > 0 && (
                <div><h3 className="font-h3 text-h3 text-primary">Requirements</h3><ul className="list-disc pl-5 text-on-surface-variant flex flex-col gap-2 mt-2">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              )}
              {job.requiredSkills?.length > 0 && (
                <div className="pt-stack-md border-t border-surface-variant">
                  <h3 className="font-h3 text-h3 text-primary mb-3">Your Skills Match</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((s, i) => {
                      const matched = matchedSkills.includes(s);
                      return <span key={i} className={`px-3 py-1 rounded-full font-label-md flex items-center gap-1 border ${matched ? 'bg-success-container/20 text-success border-success/30' : 'bg-surface-variant/50 text-on-surface-variant border-outline-variant'}`}>
                        {matched && <span className="material-symbols-outlined text-[14px]">check</span>} {s}
                      </span>;
                    })}
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
            </div>

            {matchScore && (
              <div className="bg-surface-container-lowest rounded-[16px] p-stack-lg shadow-sm border border-outline-variant flex flex-col gap-stack-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-[64px] text-primary">smart_toy</span></div>
                <h3 className="font-h3 text-h3 text-primary">AI Match Analysis</h3>
                <div className="flex items-center gap-4 py-2">
                   <MatchScoreBadge score={matchScore} size="lg" variant="ring" />
                   <div>
                     <p className="font-bold text-primary">{matchScore}% Match</p>
                     <p className="text-xs text-on-surface-variant">Based on your skills</p>
                   </div>
                </div>
                {job.recommendation?.matchSummary && <p className="font-body-sm text-on-surface-variant mt-2 border-t border-outline-variant pt-3">{job.recommendation.matchSummary}</p>}
                <p className="text-[10px] text-on-surface-variant mt-2 italic">AI match score is based on your skills and the job requirements.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ConfirmModal isOpen={showApplyModal} title={`Apply for ${job.title}`}
          message="You are about to apply using your default CV profile. Are you sure?"
          confirmText="Yes, Apply" cancelText="Cancel"
          onConfirm={handleApply} onCancel={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}

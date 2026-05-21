import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import ApplicantMatchScore from '../../components/company/ApplicantMatchScore';
import CompanyApplicantCard from '../../components/company/CompanyApplicantCard';
import CompanyApplicantTable from '../../components/company/CompanyApplicantTable';
import CompanyEmptyState from '../../components/company/CompanyEmptyState';
import CompanyJobCard from '../../components/company/CompanyJobCard';
import CompanyJobTable from '../../components/company/CompanyJobTable';
import CompanyPageHeader from '../../components/company/CompanyPageHeader';
import CompanySkillTag from '../../components/company/CompanySkillTag';
import CompanyStatsCard from '../../components/company/CompanyStatsCard';
import CompanyStatusBadge from '../../components/company/CompanyStatusBadge';
import { useToast } from '../../components/useToast';
import { useValidationErrors } from '../../hooks/useValidationErrors';
import { companyDataService } from '../../services/companyDataService';
import { companyApi } from '../../api/companyApi';
import { api, getListItems } from '../../api/axios';
import { ROUTES } from '../../utils/constants';

const salary = (job) => `$${Math.round(job.salaryMin / 1000)}k - $${Math.round(job.salaryMax / 1000)}k`;
const jobParam = (params) => params.jobId || params.id;
const toText = (value) => (Array.isArray(value) ? value.join('\n') : value || '');
const toList = (value) => String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);

const buttonPrimary = 'inline-flex items-center justify-center gap-unit bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
const buttonSecondary = 'inline-flex items-center justify-center gap-unit border border-outline-variant text-primary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const buttonDanger = 'inline-flex items-center justify-center gap-unit border border-error/30 text-error px-stack-md py-stack-sm rounded-lg font-h3 text-h3 hover:bg-error-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export function FullPageSpinner() {
  return (
    <div className="flex w-full min-h-[400px] items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-4xl text-secondary">progress_activity</span>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-label-md text-label-md text-primary">{label}</span>
      <div className="mt-unit">{children}</div>
      {error && <p className="font-body-sm text-body-sm text-error mt-unit">{error}</p>}
    </label>
  );
}

function TextInput(props) {
  return <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-50" {...props} />;
}

function TextArea(props) {
  return <textarea className="w-full min-h-32 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-50" {...props} />;
}

function SelectInput(props) {
  return <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-50" {...props} />;
}

function Section({ title, children }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-stack-lg space-y-stack-md">
      <h2 className="font-h2 text-h2 text-primary">{title}</h2>
      {children}
    </section>
  );
}

function PaginationControls({ page, setPage, itemsCount }) {
  return (
    <div className="flex justify-between items-center mt-stack-md bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant">
      <button className={buttonSecondary} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
      <span className="text-on-surface-variant font-label-md">Page {page}</span>
      <button className={buttonSecondary} disabled={itemsCount < 15} onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}

function ApplicantActionModals({ shortlistTarget, rejectTarget, setShortlistTarget, setRejectTarget, onComplete }) {
  const { addToast } = useToast();
  const [sendEmail, setSendEmail] = useState(true);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [rejectJob, setRejectJob] = useState(null);

  useEffect(() => {
    if (rejectTarget) {
      companyDataService.getCompanyJobById(rejectTarget.jobId).then(setRejectJob).catch(console.error);
    }
  }, [rejectTarget]);

  const updateStatus = async (target, status) => {
    try {
      setSaving(true);
      await companyDataService.updateApplicantStatus(target.applicationId, status);
      addToast({
        title: status === 'shortlisted' ? 'Candidate shortlisted' : 'Candidate rejected',
        message: `${target.name} was moved to ${status === 'shortlisted' ? 'shortlisted' : 'rejected'}.`,
      });
      onComplete?.();
    } catch (e) {
      addToast({ title: 'Error', message: 'Failed to update applicant status.', type: 'error' });
    } finally {
      setSaving(false);
      setShortlistTarget(null);
      setRejectTarget(null);
    }
  };

  return (
    <>
      <ConfirmModal
        confirmLabel={saving ? "Saving..." : "Shortlist Candidate"}
        message={shortlistTarget ? `Move ${shortlistTarget.name} to the shortlist for recruiter follow-up?` : ''}
        onCancel={() => setShortlistTarget(null)}
        onConfirm={() => updateStatus(shortlistTarget, 'shortlisted')}
        open={Boolean(shortlistTarget)}
        title="Shortlist candidate"
      />

      {rejectTarget && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40">
          <div className="bg-surface-container-lowest rounded-xl shadow-overlay border border-outline-variant p-stack-lg w-full max-w-2xl mx-4">
            <h3 className="font-h2 text-h2 text-primary">Reject candidate</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-unit">
              Review the rejection details for {rejectTarget.name} on {rejectJob?.title || 'this job'}.
            </p>
            <div className="mt-stack-md flex flex-wrap gap-unit">
              {rejectTarget.missingSkills?.length ? rejectTarget.missingSkills.map((skill) => (
                <CompanySkillTag tone="missing" key={skill}>{skill}</CompanySkillTag>
              )) : <CompanySkillTag tone="matched">No missing skills</CompanySkillTag>}
            </div>
            <label className="mt-stack-md flex items-center gap-stack-sm text-on-surface-variant">
              <input checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} type="checkbox" disabled={saving} />
              Send automated rejection email
            </label>
            {sendEmail && (
              <div className="mt-stack-md bg-surface-container-low rounded-lg p-stack-md border border-outline-variant">
                <p className="font-label-md text-label-md text-primary mb-unit">Email preview</p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Hi {rejectTarget.name}, thank you for applying to {rejectJob?.title || 'our role'}. After review, we will not move forward at this time. We were specifically looking for stronger coverage in {rejectTarget.missingSkills?.join(', ') || 'the required role criteria'}.
                </p>
                <textarea
                  className="mt-stack-md w-full min-h-24 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 disabled:opacity-50"
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add an optional recruiter note"
                  value={note}
                  disabled={saving}
                />
              </div>
            )}
            <div className="mt-stack-lg flex justify-end gap-stack-sm">
              <button className={buttonSecondary} disabled={saving} onClick={() => setRejectTarget(null)}>Cancel</button>
              <button className={buttonDanger} disabled={saving} onClick={() => { updateStatus(rejectTarget, 'rejected'); setSendEmail(true); setNote(''); }}>
                {saving ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function useApplicantActions(refresh) {
  const [shortlistTarget, setShortlistTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const modals = (
    <ApplicantActionModals
      onComplete={refresh}
      rejectTarget={rejectTarget}
      setRejectTarget={setRejectTarget}
      setShortlistTarget={setShortlistTarget}
      shortlistTarget={shortlistTarget}
    />
  );

  return { setShortlistTarget, setRejectTarget, modals };
}

function NotFoundState({ title = 'Item not found', message = 'The record may have been removed or is unavailable.' }) {
  return <CompanyEmptyState title={title} message={message} />;
}

function JobForm({ initialJob, mode }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { errors, serverError, handleApiError, clearErrors, setErrors } = useValidationErrors();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initialJob?.title || '',
    location: initialJob?.location || '',
    workMode: initialJob?.workMode || 'Hybrid',
    type: initialJob?.type || '',
    salaryMin: initialJob?.salaryMin || 90000,
    salaryMax: initialJob?.salaryMax || 130000,
    description: initialJob?.description || '',
    responsibilities: toText(initialJob?.responsibilities),
    requiredSkills: toText(initialJob?.requiredSkills),
    experienceLevel: initialJob?.experienceLevel || '',
    education: initialJob?.education || '',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    clearErrors();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Job title is required.';
    if (!form.location.trim()) nextErrors.location = 'Location is required.';
    if (!form.type.trim()) nextErrors.type = 'Job type is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!toList(form.requiredSkills).length) nextErrors.requiredSkills = 'Add at least one required skill.';
    
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return false;
    }
    return true;
  };

  const payload = (status) => ({
    ...form,
    salaryMin: Number(form.salaryMin),
    salaryMax: Number(form.salaryMax),
    responsibilities: toList(form.responsibilities),
    requiredSkills: toList(form.requiredSkills),
    status,
  });

  const save = async (status) => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === 'edit') {
        const updated = await companyDataService.updateCompanyJob(initialJob.id, payload(initialJob.status));
        addToast({ title: 'Job updated', message: `${updated.title} was saved.` });
        navigate(`/company/jobs/${updated.id}`);
      } else {
        const created = await companyDataService.createCompanyJob(payload(status));
        addToast({ title: status === 'draft' ? 'Draft saved' : 'Job published', message: `${created.title} is now ${status}.` });
        navigate(status === 'draft' ? `/company/jobs/${created.id}/preview` : `/company/jobs/${created.id}`);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-gutter" onSubmit={(event) => event.preventDefault()}>
      {serverError && (
        <div className="bg-error-container text-on-error-container p-stack-sm rounded-lg border border-error">
          <p>{serverError}</p>
        </div>
      )}
      <Section title="Basic info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <Field error={errors.title} label="Job title"><TextInput disabled={saving} onChange={(event) => update('title', event.target.value)} value={form.title} /></Field>
          <Field error={errors.type} label="Job type">
            <SelectInput disabled={saving} onChange={(event) => update('type', event.target.value)} value={form.type}>
              <option value="">Select type</option>
              <option value="full_time">Full time</option>
              <option value="part_time">Part time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </SelectInput>
          </Field>
          <Field error={errors.location} label="Location"><TextInput disabled={saving} onChange={(event) => update('location', event.target.value)} value={form.location} /></Field>
          <Field error={errors.workMode} label="Work mode">
            <SelectInput disabled={saving} onChange={(event) => update('workMode', event.target.value)} value={form.workMode}>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </SelectInput>
          </Field>
        </div>
      </Section>

      <Section title="Description">
        <Field error={errors.description} label="Job description"><TextArea disabled={saving} onChange={(event) => update('description', event.target.value)} value={form.description} /></Field>
      </Section>

      <Section title="Responsibilities">
        <Field error={errors.responsibilities} label="One responsibility per line"><TextArea disabled={saving} onChange={(event) => update('responsibilities', event.target.value)} value={form.responsibilities} /></Field>
      </Section>

      <Section title="Required skills">
        <Field error={errors.requiredSkills} label="One skill per line"><TextArea disabled={saving} onChange={(event) => update('requiredSkills', event.target.value)} value={form.requiredSkills} /></Field>
        <div className="flex flex-wrap gap-unit">
          {toList(form.requiredSkills).map((skill) => <CompanySkillTag key={skill}>{skill}</CompanySkillTag>)}
        </div>
      </Section>

      <Section title="Salary, experience, and education">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <Field error={errors.salaryMin} label="Salary min"><TextInput disabled={saving} onChange={(event) => update('salaryMin', event.target.value)} type="number" value={form.salaryMin} /></Field>
          <Field error={errors.salaryMax} label="Salary max"><TextInput disabled={saving} onChange={(event) => update('salaryMax', event.target.value)} type="number" value={form.salaryMax} /></Field>
          <Field error={errors.experienceLevel} label="Experience level"><TextInput disabled={saving} onChange={(event) => update('experienceLevel', event.target.value)} value={form.experienceLevel} /></Field>
          <Field error={errors.education} label="Education"><TextInput disabled={saving} onChange={(event) => update('education', event.target.value)} value={form.education} /></Field>
        </div>
      </Section>

      <div className="flex flex-wrap justify-end gap-stack-sm">
        <button disabled={saving} className={buttonSecondary} onClick={() => navigate(mode === 'edit' ? `/company/jobs/${initialJob.id}` : ROUTES.COMPANY_JOBS)}>Cancel</button>
        {mode !== 'edit' && <button disabled={saving} className={buttonSecondary} onClick={() => save('draft')}>Save Draft</button>}
        {mode !== 'edit' && <button disabled={saving} className={buttonSecondary} onClick={() => save('draft')}>Preview</button>}
        <button disabled={saving} className={buttonPrimary} onClick={() => save(mode === 'edit' ? initialJob.status : 'active')}>
          {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Publish Job')}
        </button>
      </div>
    </form>
  );
}

export function CompanyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToast } = useToast();
  const [shortlistTarget, setShortlistTarget] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    companyApi.getDashboard()
      .then(res => setStats(res.data || res)) // Depending on axios interceptor unwrapping
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (target, status) => {
    try {
      await companyApi.updateApplicantStatus(target.application_id, status);
      addToast({
        title: status === 'shortlisted' ? 'Candidate shortlisted' : 'Candidate rejected',
        message: `${target.applicant_name} was moved to ${status}.`,
      });
      fetchData();
    } catch (e) {
      addToast({ title: 'Error', message: 'Failed to update applicant status.', type: 'error' });
    } finally {
      setShortlistTarget(null);
    }
  };

  const modals = (
    <ConfirmModal
      confirmLabel="Shortlist Candidate"
      message={shortlistTarget ? `Move ${shortlistTarget.applicant_name} to the shortlist for recruiter follow-up?` : ''}
      onCancel={() => setShortlistTarget(null)}
      onConfirm={() => updateStatus(shortlistTarget, 'shortlisted')}
      open={Boolean(shortlistTarget)}
      title="Shortlist candidate"
    />
  );

  if (loading) return <FullPageSpinner />;
  if (error) return <CompanyEmptyState title="Error loading dashboard" message={error} />;
  if (!stats) return null;

  return (
    <>
      <CompanyPageHeader
        eyebrow="Company Dashboard"
        title="Welcome back"
        description="Track job performance, applicant quality, and recruiter actions from one connected workspace."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-gutter">
        <CompanyStatsCard icon="work" label="Total jobs" to={ROUTES.COMPANY_JOBS} value={stats.total_jobs} />
        <CompanyStatsCard icon="work_outline" label="Active jobs" to={ROUTES.COMPANY_JOBS} value={stats.active_jobs} />
        <CompanyStatsCard icon="group" label="Total applicants" to={ROUTES.COMPANY_APPLICANTS} value={stats.total_applicants} />
        <CompanyStatsCard icon="new_releases" label="New this week" to={ROUTES.COMPANY_APPLICANTS} value={stats.new_applicants_this_week} />
        <CompanyStatsCard icon="hourglass_top" label="Under review" to={ROUTES.COMPANY_APPLICANTS} value={stats.under_review} />
        <CompanyStatsCard icon="check_circle" label="Shortlisted" to={ROUTES.COMPANY_APPLICANTS} value={stats.shortlisted} />
        <CompanyStatsCard icon="cancel" label="Rejected" to={ROUTES.COMPANY_APPLICANTS} value={stats.rejected} />
      </div>
      <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-gutter">
        <Section title="Recent applicants">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
            {stats.recent_applicants?.map((applicant) => (
              <div key={applicant.application_id} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant flex flex-col gap-2">
                 <p className="font-h3 text-primary">{applicant.applicant_name}</p>
                 <p className="text-sm text-on-surface-variant">{applicant.job_title} · Score: {applicant.ai_score}</p>
                 <div className="flex gap-2 mt-2">
                    <button onClick={() => setShortlistTarget(applicant)} className="text-sm text-secondary hover:underline">Shortlist</button>
                 </div>
              </div>
            ))}
            {!stats.recent_applicants?.length && <p className="text-on-surface-variant p-4">No recent applicants.</p>}
          </div>
        </Section>
        <Section title="Quick actions">
          <div className="grid gap-stack-sm">
            <Link className={buttonPrimary} to={ROUTES.COMPANY_CREATE_JOB}>Create Job</Link>
            <Link className={buttonSecondary} to={ROUTES.COMPANY_JOBS}>Manage Jobs</Link>
            <Link className={buttonSecondary} to={ROUTES.COMPANY_APPLICANTS}>View Applicants</Link>
            <Link className={buttonSecondary} to={ROUTES.COMPANY_PROFILE + '/edit'}>Edit Company Profile</Link>
          </div>
        </Section>
      </section>
      <Section title="Top performing jobs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
          {stats.top_jobs?.map((job) => (
            <div key={job.id} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
              <p className="font-h3 text-primary">{job.title}</p>
              <p className="text-sm text-on-surface-variant">Applicants: {job.applicants_count}</p>
              <CompanyStatusBadge status={job.is_active ? 'active' : 'paused'} />
            </div>
          ))}
          {!stats.top_jobs?.length && <p className="text-on-surface-variant p-4">No top jobs.</p>}
        </div>
      </Section>
      {modals}
    </>
  );
}

export function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyDataService.getCompanyProfile(),
      companyDataService.getCompanyJobs({ status: 'active' })
    ]).then(([p, j]) => {
      setProfile(p);
      setActiveJobs(j);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;
  if (!profile) return <NotFoundState title="Profile not found" />;

  return (
    <>
      <CompanyPageHeader
        actions={<><Link className={buttonSecondary} to={ROUTES.COMPANY_PROFILE + '/preview'}>Public Preview</Link><Link className={buttonPrimary} to={ROUTES.COMPANY_PROFILE + '/edit'}>Edit Profile</Link></>}
        eyebrow="Company Profile"
        title={profile.name}
        description={profile.description}
      />
      <Section title="Company details">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-gutter">
          <img alt={profile.name} className="w-36 h-36 rounded-2xl object-cover border border-outline-variant" src={profile.logo} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {[
              ['Industry', profile.industry],
              ['Website', profile.website],
              ['Location', profile.location],
              ['Contact email', profile.contactEmail],
              ['Phone', profile.phone],
              ['Founded', profile.foundedYear],
              ['Company size', profile.companySize],
              ['Active jobs', activeJobs.length],
            ].map(([label, value]) => (
              <div className="bg-surface-container-low rounded-lg p-stack-md" key={label}>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</p>
                <p className="font-h3 text-h3 text-primary mt-unit">{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export function CompanyEditProfile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { errors, serverError, handleApiError, clearErrors, setErrors } = useValidationErrors();
  
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    companyDataService.getCompanyProfile().then(p => {
      setForm(p);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const validate = () => {
    clearErrors();
    const nextErrors = {};
    if (!form.name?.trim()) nextErrors.name = 'Company name is required.';
    if (!form.industry?.trim()) nextErrors.industry = 'Industry is required.';
    if (!form.location?.trim()) nextErrors.location = 'Location is required.';
    
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await companyDataService.updateCompanyProfile(form);
      addToast({ title: 'Profile saved', message: 'Company profile changes were saved.' });
      navigate(ROUTES.COMPANY_PROFILE);
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FullPageSpinner />;
  if (!form) return <NotFoundState />;

  return (
    <>
      <CompanyPageHeader eyebrow="Company Profile" title="Edit company profile" description="Keep your public employer brand and recruiter contact information current." />
      {serverError && (
        <div className="bg-error-container text-on-error-container p-stack-sm rounded-lg border border-error">
          <p>{serverError}</p>
        </div>
      )}
      <Section title="Profile information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <Field error={errors.name} label="Company name"><TextInput disabled={saving} onChange={(event) => update('name', event.target.value)} value={form.name || ''} /></Field>
          <Field error={errors.industry} label="Industry"><TextInput disabled={saving} onChange={(event) => update('industry', event.target.value)} value={form.industry || ''} /></Field>
          <Field error={errors.website} label="Website"><TextInput disabled={saving} onChange={(event) => update('website', event.target.value)} value={form.website || ''} /></Field>
          <Field error={errors.location} label="Location"><TextInput disabled={saving} onChange={(event) => update('location', event.target.value)} value={form.location || ''} /></Field>
          <Field error={errors.contactEmail} label="Contact email"><TextInput disabled={saving} onChange={(event) => update('contactEmail', event.target.value)} value={form.contactEmail || ''} /></Field>
          <Field error={errors.phone} label="Phone"><TextInput disabled={saving} onChange={(event) => update('phone', event.target.value)} value={form.phone || ''} /></Field>
          <Field error={errors.foundedYear} label="Founded year"><TextInput disabled={saving} onChange={(event) => update('foundedYear', event.target.value)} type="number" value={form.foundedYear || ''} /></Field>
          <Field error={errors.companySize} label="Company size"><TextInput disabled={saving} onChange={(event) => update('companySize', event.target.value)} value={form.companySize || ''} /></Field>
        </div>
        <Field error={errors.description} label="Description"><TextArea disabled={saving} onChange={(event) => update('description', event.target.value)} value={form.description || ''} /></Field>
        <Field label="Logo upload">
          <input
            className="block w-full text-on-surface-variant disabled:opacity-50"
            disabled={saving}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              setLogoFile(file?.name || '');
              if (file) {
                try {
                  await companyDataService.uploadCompanyLogo(file);
                  addToast({ title: 'Logo uploaded', message: 'Logo was updated successfully.' });
                } catch(e) {
                  addToast({ title: 'Error', message: 'Failed to upload logo.', type: 'error' });
                }
              }
            }}
            type="file"
          />
          {logoFile && <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Selected: {logoFile}</p>}
        </Field>
      </Section>
      <div className="flex justify-end gap-stack-sm mt-stack-md">
        <button disabled={saving} className={buttonSecondary} onClick={() => navigate(ROUTES.COMPANY_PROFILE)}>Cancel</button>
        <button disabled={saving} className={buttonPrimary} onClick={save}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </>
  );
}

export function CompanyProfilePreview() {
  const [profile, setProfile] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyDataService.getCompanyProfile(),
      companyDataService.getCompanyJobs({ status: 'active' })
    ]).then(([p, j]) => {
      setProfile(p);
      setActiveJobs(j);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;
  if (!profile) return <NotFoundState />;

  return (
    <>
      <CompanyPageHeader
        actions={<><Link className={buttonSecondary} to={ROUTES.COMPANY_PROFILE}>Back to Profile</Link><Link className={buttonPrimary} to={ROUTES.COMPANY_PROFILE + '/edit'}>Edit Profile</Link></>}
        eyebrow="Public Preview"
        title={profile.name}
        description={profile.description}
      />
      <Section title="Employer profile">
        <div className="flex flex-col md:flex-row gap-gutter">
          <img alt={profile.name} className="w-32 h-32 rounded-2xl object-cover border border-outline-variant" src={profile.logo} />
          <div className="space-y-unit text-on-surface-variant">
            <p>{profile.industry} · {profile.location}</p>
            <p>{profile.companySize} · Founded {profile.foundedYear}</p>
            <p>{profile.website}</p>
          </div>
        </div>
      </Section>
      <Section title="Open jobs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
          {activeJobs.map((job) => <CompanyJobCard job={job} key={job.id} />)}
        </div>
      </Section>
    </>
  );
}

export function CompanyManageJobs() {
  const { addToast } = useToast();
  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyDataService.getCompanyJobs({ ...filters, page });
      setJobs(res);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateFilters = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <>
      <CompanyPageHeader actions={<Link className={buttonPrimary} to={ROUTES.COMPANY_CREATE_JOB}>Create Job</Link>} eyebrow="Manage Jobs" title="Job board" description="Search, filter, publish, pause, edit, preview, and remove job posts." />
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-stack-md grid grid-cols-1 md:grid-cols-[1fr_180px_200px] gap-stack-md">
        <TextInput onChange={(event) => updateFilters('query', event.target.value)} placeholder="Search by title, location, skill, or status" value={filters.query} />
        <SelectInput onChange={(event) => updateFilters('status', event.target.value)} value={filters.status}>
          <option value="all">All</option><option value="active">Active</option><option value="paused">Paused</option><option value="closed">Closed</option>
        </SelectInput>
        <SelectInput onChange={(event) => updateFilters('sort', event.target.value)} value={filters.sort}>
          <option value="newest">Newest</option><option value="applicants">Most applicants</option><option value="views">Most views</option>
        </SelectInput>
      </div>
      
      {loading ? <FullPageSpinner /> : (
        <>
          <CompanyJobTable
            jobs={jobs}
            onDeleteRequest={setDeleteTarget}
            onToggleStatus={async (id) => {
              try {
                const updated = await companyDataService.toggleJobStatus(id);
                addToast({ title: 'Job status updated', message: `${updated.title} is now ${updated.status}.` });
                refresh();
              } catch (e) {
                addToast({ title: 'Error', message: 'Failed to update job status.', type: 'error' });
              }
            }}
          />
          <PaginationControls page={page} setPage={setPage} itemsCount={jobs.length} />
        </>
      )}

      <ConfirmModal
        confirmLabel={saving ? "Deleting..." : "Delete Job"}
        message={deleteTarget ? `Delete ${deleteTarget.title}? Applicants for this job will also be removed.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          setSaving(true);
          try {
            await companyDataService.deleteCompanyJob(deleteTarget.id);
            addToast({ title: 'Job deleted', message: `${deleteTarget.title} was removed.` });
            setDeleteTarget(null);
            refresh();
          } catch(e) {
            addToast({ title: 'Error', message: 'Failed to delete job.', type: 'error' });
          } finally {
            setSaving(false);
          }
        }}
        open={Boolean(deleteTarget)}
        title="Delete job"
        variant="danger"
      />
    </>
  );
}

export function CompanyCreateJobPost() {
  return (
    <>
      <CompanyPageHeader eyebrow="Create Job" title="Create job post" description="Build a complete job post and save it as a draft or publish it immediately." />
      <JobForm mode="create" />
    </>
  );
}

export function CompanyEditJobPost() {
  const params = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyDataService.getCompanyJobById(jobParam(params)).then(res => {
      setJob(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params]);

  if (loading) return <FullPageSpinner />;
  if (!job) return <NotFoundState title="Job not found" message="This job post is unavailable." />;

  return (
    <>
      <CompanyPageHeader eyebrow="Edit Job" title={job.title} description="Update job details, requirements, and hiring expectations." />
      <JobForm initialJob={job} mode="edit" />
    </>
  );
}

export function CompanyJobPostPreview() {
  const params = useParams();
  const { addToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyDataService.getCompanyJobById(jobParam(params)).then(res => {
      setJob(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params]);

  const toggle = async () => {
    try {
      const updated = await companyDataService.toggleJobStatus(job.id);
      setJob(updated);
      addToast({ title: 'Job status updated', message: `${updated.title} is now ${updated.status}.` });
    } catch(e) {
      addToast({ title: 'Error', message: 'Failed to update status.', type: 'error' });
    }
  };

  if (loading) return <FullPageSpinner />;
  if (!job) return <NotFoundState title="Preview unavailable" message="This job post could not be found." />;

  return (
    <>
      <CompanyPageHeader
        actions={<><Link className={buttonSecondary} to={`/company/jobs/${job.id}/edit`}>Back to Edit</Link><button className={buttonPrimary} onClick={toggle}>{job.status === 'active' ? 'Pause' : 'Publish'}</button><Link className={buttonSecondary} to={`/company/jobs/${job.id}/applicants`}>View Applicants</Link></>}
        eyebrow="Job Preview"
        title={job.title}
        description={`${job.location} · ${job.workMode} · ${job.type}`}
      />
      <Section title="Preview">
        <div className="flex items-center justify-between"><CompanyStatusBadge status={job.status} /><p className="font-h2 text-h2 text-primary">{salary(job)}</p></div>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{job.description}</p>
        <div className="flex flex-wrap gap-unit">{job.requiredSkills.map((skill) => <CompanySkillTag key={skill}>{skill}</CompanySkillTag>)}</div>
        <ul className="list-disc pl-6 text-on-surface-variant space-y-unit">{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
      </Section>
    </>
  );
}

export function CompanyJobDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const id = jobParam(params);
      const [j, a] = await Promise.all([
        companyDataService.getCompanyJobById(id),
        companyDataService.getApplicantsByJob(id)
      ]);
      setJob(j);
      setApplicants(a);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { setShortlistTarget, setRejectTarget, modals } = useApplicantActions(fetchData);

  if (loading) return <FullPageSpinner />;
  if (!job) return <NotFoundState title="Job not found" message="This job post is unavailable." />;

  const averageScore = applicants.length ? Math.round(applicants.reduce((sum, item) => sum + item.matchScore, 0) / applicants.length) : 0;

  return (
    <>
      <CompanyPageHeader
        actions={<><Link className={buttonSecondary} to={`/company/jobs/${job.id}/applicants`}>View Applicants</Link><Link className={buttonSecondary} to={`/company/jobs/${job.id}/edit`}>Edit Job</Link><Link className={buttonSecondary} to={`/company/jobs/${job.id}/preview`}>Preview</Link><button className={buttonPrimary} onClick={async () => { const updated = await companyDataService.toggleJobStatus(job.id); setJob(updated); addToast({ title: 'Job status updated', message: `${updated.title} is now ${updated.status}.` }); }}>{job.status === 'active' ? 'Pause' : 'Publish'}</button><button className={buttonDanger} onClick={() => setDeleteOpen(true)}>Delete</button></>}
        eyebrow="Job Details"
        title={job.title}
        description={`${job.location} · ${job.workMode} · ${salary(job)}`}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <CompanyStatsCard icon="visibility" label="Views" value={job.views} />
        <CompanyStatsCard icon="group" label="Applicants" value={applicants.length} />
        <CompanyStatsCard icon="analytics" label="Avg. match" value={`${averageScore}%`} />
        <CompanyStatsCard icon="work" label="Status" value={<CompanyStatusBadge status={job.status} />} />
      </div>
      <Section title="Job overview">
        <p className="font-body-lg text-body-lg text-on-surface-variant">{job.description}</p>
        <div className="flex flex-wrap gap-unit">{job.requiredSkills.map((skill) => <CompanySkillTag key={skill}>{skill}</CompanySkillTag>)}</div>
        <ul className="list-disc pl-6 text-on-surface-variant space-y-unit">{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="text-on-surface-variant">Experience: {job.experienceLevel} · Education: {job.education}</p>
      </Section>
      <Section title="Recent applicants">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
          {applicants.slice(0, 4).map((applicant) => <CompanyApplicantCard applicant={applicant} key={applicant.id} onReject={setRejectTarget} onShortlist={setShortlistTarget} />)}
          {!applicants.length && <p className="text-on-surface-variant">No applicants yet.</p>}
        </div>
      </Section>
      {modals}
      <ConfirmModal
        confirmLabel="Delete Job"
        message={`Delete ${job.title}?`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await companyDataService.deleteCompanyJob(job.id);
          addToast({ title: 'Job deleted', message: `${job.title} was removed.` });
          navigate(ROUTES.COMPANY_JOBS);
        }}
        open={deleteOpen}
        title="Delete job"
        variant="danger"
      />
    </>
  );
}

export function CompanyApplicants() {
  const params = useParams();
  const jobId = jobParam(params);
  
  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'match' });
  const [page, setPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (jobId) {
        const [j, a] = await Promise.all([
          companyDataService.getCompanyJobById(jobId),
          companyDataService.getApplicantsByJob(jobId, { ...filters, page })
        ]);
        setJob(j);
        setApplicants(a);
      } else {
        // Global applicants not fully supported yet by backend without job ID
        setJob({ title: 'All Jobs' });
        setApplicants([]); 
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jobId, filters, page]);

  useEffect(() => { refresh(); }, [refresh]);
  const { setShortlistTarget, setRejectTarget, modals } = useApplicantActions(refresh);

  const updateFilters = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (loading && !job) return <FullPageSpinner />;
  if (!job) return <NotFoundState title="Job not found" message="Applicants cannot be loaded for this job." />;

  return (
    <>
      <CompanyPageHeader eyebrow="Smart ATS" title={`Applicants for ${job.title}`} description="Review AI match scores, skill gaps, and candidate status." />
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-stack-md grid grid-cols-1 md:grid-cols-[1fr_180px_200px] gap-stack-md">
        <TextInput onChange={(event) => updateFilters('query', event.target.value)} placeholder="Search by name, title, skill, or status" value={filters.query} />
        <SelectInput onChange={(event) => updateFilters('status', event.target.value)} value={filters.status}>
          <option value="all">All</option><option value="new">New</option><option value="under_review">Under Review</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option>
        </SelectInput>
        <SelectInput onChange={(event) => updateFilters('sort', event.target.value)} value={filters.sort}>
          <option value="match">Match score</option><option value="newest">Newest</option><option value="experience">Years experience</option>
        </SelectInput>
      </div>
      
      {loading ? <FullPageSpinner /> : (
        <>
          <CompanyApplicantTable applicants={applicants} onReject={setRejectTarget} onShortlist={setShortlistTarget} />
          <PaginationControls page={page} setPage={setPage} itemsCount={applicants.length} />
        </>
      )}
      
      {modals}
    </>
  );
}

export function CompanyApplicantProfile() {
  const params = useParams();
  const [applicant, setApplicant] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const a = await companyDataService.getApplicantById(params.id);
      setApplicant(a);
      if (a) {
        setJob(await companyDataService.getCompanyJobById(a.jobId));
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const { setShortlistTarget, setRejectTarget, modals } = useApplicantActions(fetchData);

  if (loading) return <FullPageSpinner />;
  if (!applicant) return <NotFoundState title="Applicant not found" message="This candidate record is unavailable." />;

  return (
    <>
      <CompanyPageHeader
        actions={<><button className={buttonPrimary} onClick={() => setShortlistTarget(applicant)}>Shortlist</button><button className={buttonDanger} onClick={() => setRejectTarget(applicant)}>Reject</button><button className={buttonSecondary} onClick={async () => {
          const blob = await companyDataService.getApplicantCV(applicant.id);
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `cv-${applicant.name}.pdf`);
          document.body.appendChild(link);
          link.click();
        }}>Download CV</button><Link className={buttonSecondary} to={`/company/applicants/${applicant.id}/matching`}>View Matching Details</Link><Link className={buttonSecondary} to={`/company/jobs/${applicant.jobId}/applicants`}>Back to Applicants</Link></>}
        eyebrow="Applicant Profile"
        title={applicant.name}
        description={`${applicant.title} for ${job?.title || 'selected role'}`}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-gutter">
        <Section title="Candidate profile">
          <div className="flex items-start gap-stack-md">
            <img alt={applicant.name} className="w-20 h-20 rounded-full object-cover" src={applicant.avatar} />
            <div><CompanyStatusBadge status={applicant.status} /><p className="mt-stack-sm text-on-surface-variant">{applicant.email} · {applicant.phone} · {applicant.location}</p></div>
          </div>
          <p className="text-on-surface-variant">{applicant.experience}</p>
          <p className="text-on-surface-variant">Education: {applicant.education}</p>
          <div className="flex flex-wrap gap-unit">{applicant.skills.map((skill) => <CompanySkillTag key={skill}>{skill}</CompanySkillTag>)}</div>
        </Section>
        <Section title="AI match">
          <ApplicantMatchScore score={applicant.matchScore} size="lg" />
          <p className="font-h3 text-h3 text-primary">Missing skills</p>
          <div className="flex flex-wrap gap-unit">
            {applicant.missingSkills?.length 
              ? applicant.missingSkills.map((skill) => <CompanySkillTag tone="missing" key={skill}>{skill}</CompanySkillTag>)
              : <CompanySkillTag tone="matched">No missing skills detected</CompanySkillTag>}
          </div>
        </Section>
      </div>
      {modals}
    </>
  );
}

export function CompanyApplicantCvViewer() {
  return <NotFoundState title="CV Viewer unavailable" message="CV viewing is partially mocked and relies on download right now." />;
}

export function CompanyApplicantMatchingDetails() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const a = await companyDataService.getApplicantById(id);
      setApplicant(a);
      if (a) {
        setJob(await companyDataService.getCompanyJobById(a.jobId));
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const { setShortlistTarget, setRejectTarget, modals } = useApplicantActions(fetchData);

  if (loading) return <FullPageSpinner />;
  if (!applicant || !job) return <NotFoundState title="Matching details unavailable" message="Applicant or job data could not be found." />;
  const recommendation = applicant.matchScore >= 85 ? 'Strong candidate' : applicant.matchScore >= 70 ? 'Needs review' : 'Low match';

  return (
    <>
      <CompanyPageHeader
        actions={<><button className={buttonPrimary} onClick={() => setShortlistTarget(applicant)}>Shortlist</button><button className={buttonDanger} onClick={() => setRejectTarget(applicant)}>Reject</button><Link className={buttonSecondary} to={`/company/applicants/${applicant.id}`}>View Profile</Link></>}
        eyebrow="AI Matching Details"
        title={`${applicant.name} · ${recommendation}`}
        description={`Evaluated against ${job.title}.`}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-gutter">
        <Section title="Score"><ApplicantMatchScore score={applicant.matchScore} size="lg" /><CompanyStatusBadge status={applicant.status} /></Section>
        <Section title="Required skills checklist">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            {job.requiredSkills.map((skill) => {
              const matched = !(applicant.missingSkills || []).includes(skill);
              return (
                <div className="flex items-center gap-stack-sm bg-surface-container-low rounded-lg p-stack-md" key={skill}>
                  <span className={`material-symbols-outlined ${matched ? 'text-[#15803D]' : 'text-error'}`}>{matched ? 'check_circle' : 'cancel'}</span>
                  <span>{skill}</span>
                </div>
              );
            })}
          </div>
          <p className="text-on-surface-variant">Experience match: {applicant.yearsExperience} years for a {job.experienceLevel} role.</p>
          <p className="text-on-surface-variant">Education match: {applicant.education}</p>
          <p className="font-h3 text-h3 text-primary">Recommendation: {recommendation}</p>
        </Section>
      </div>
      {modals}
    </>
  );
}

export function CompanyNotifications() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback((nextFilter = filter) => {
    setLoading(true);
    api.get('/notifications', { params: { type: nextFilter } })
      .then(res => {
         setNotifications(getListItems(res));
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <>
      <CompanyPageHeader actions={<button className={buttonSecondary} onClick={async () => { await api.post('/notifications/read-all'); refresh(); }}>Mark all as read</button>} eyebrow="Notifications" title="Company notifications" description="Monitor applicant, job, and system updates." />
      <div className="flex flex-wrap gap-unit">{['all', 'unread'].map((item) => <button className={`${filter === item ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface-variant'} px-stack-md py-stack-sm rounded-lg font-label-md text-label-md`} key={item} onClick={() => { setFilter(item); refresh(item); }}>{item.replace('_', ' ')}</button>)}</div>
      <Section title="Updates">
        {loading ? <FullPageSpinner /> : (!notifications.length ? <CompanyEmptyState title="No notifications" message="No notifications match this filter." /> : notifications.map((notification) => (
          <div className="flex items-start gap-stack-md border-b border-outline-variant py-stack-md last:border-b-0 cursor-pointer hover:bg-surface-container-low transition-colors" key={notification.id} onClick={async () => { if (!notification.read_at) { await api.patch(`/notifications/${notification.id}/read`); refresh(); } }}>
            <span className={`w-2.5 h-2.5 rounded-full mt-2 ${notification.read_at ? 'bg-outline-variant' : 'bg-error'}`} />
            <div><p className="font-h3 text-h3 text-primary">{notification.title || notification.data?.title}</p><p className="text-on-surface-variant">{notification.message || notification.data?.message}</p></div>
          </div>
        )))}
      </Section>
    </>
  );
}

export function CompanyMessages() {
  return (
    <>
      <CompanyPageHeader eyebrow="Messages" title="Candidate conversations" description="Search and review recruiter conversations." />
      <div className="bg-surface-container-low p-stack-lg rounded-xl border border-secondary text-center mb-stack-lg">
        <h3 className="font-h2 text-h2 text-secondary">Messaging feature coming soon</h3>
        <p className="text-on-surface-variant mt-unit">We're working hard to bring real-time messaging right into your dashboard.</p>
      </div>
    </>
  );
}

export function CompanySettings() {
  return (
    <>
      <CompanyPageHeader eyebrow="Settings" title="Company settings" description="Manage recruiter preferences, notifications, and account security." />
      <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant text-center mb-stack-lg">
        <h3 className="font-h2 text-h2 text-primary">Settings coming soon</h3>
        <p className="text-on-surface-variant mt-unit">Account deletion and preference changes will be supported when backend settings are implemented.</p>
      </div>
    </>
  );
}

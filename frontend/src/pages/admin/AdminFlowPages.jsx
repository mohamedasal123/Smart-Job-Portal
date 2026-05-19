import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminActivityItem from '../../components/admin/AdminActivityItem';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminJobTable from '../../components/admin/AdminJobTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminRoleBadge from '../../components/admin/AdminRoleBadge';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminUserTable from '../../components/admin/AdminUserTable';
import CompanySkillTag from '../../components/company/CompanySkillTag';
import { useToast } from '../../components/useToast';
import { adminDataService } from '../../services/adminDataService';
import { adminApi } from '../../api/adminApi';
import { ROUTES } from '../../utils/constants';

const buttonPrimary = 'inline-flex items-center justify-center gap-unit bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
const buttonSecondary = 'inline-flex items-center justify-center gap-unit border border-outline-variant text-primary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const buttonDanger = 'inline-flex items-center justify-center gap-unit border border-error/30 text-error px-stack-md py-stack-sm rounded-lg font-h3 text-h3 hover:bg-error-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const buttonSuccess = 'inline-flex items-center justify-center gap-unit bg-tertiary text-on-tertiary px-stack-md py-stack-sm rounded-lg font-h3 text-h3 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';

export function FullPageSpinner() {
  return (
    <div className="flex w-full min-h-[400px] items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-4xl text-secondary">progress_activity</span>
    </div>
  );
}

function TextInput(props) {
  return <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-50" {...props} />;
}

function SelectInput(props) {
  return <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-50" {...props} />;
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

function UserStatusModal({ target, onCancel, onComplete }) {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const isBanned = target?.accountStatus === 'banned' || target?.is_banned;

  return (
    <AdminConfirmModal
      confirmLabel={saving ? "Saving..." : (isBanned ? 'Unban User' : 'Ban User')}
      message={target ? `${isBanned ? 'Restore access for' : 'Ban'} ${target.name}?` : ''}
      onCancel={onCancel}
      onConfirm={async () => {
        setSaving(true);
        try {
          await adminApi.toggleBan(target.id);
          addToast({ title: isBanned ? 'User unbanned' : 'User banned', message: `${target.name} status updated.`, type: 'success' });
          onComplete?.();
        } catch (e) {
          addToast({ title: 'Error', message: 'Failed to update user status.', type: 'error' });
        } finally {
          setSaving(false);
        }
      }}
      open={Boolean(target)}
      title={isBanned ? 'Unban user' : 'Ban user'}
      variant={isBanned ? 'primary' : 'danger'}
    />
  );
}

function JobDeleteModal({ target, onCancel, onComplete }) {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  return (
    <AdminConfirmModal
      confirmLabel={saving ? "Deleting..." : "Force Delete Job"}
      message={target ? `Force delete ${target.title}? This marks the job as permanently deleted.` : ''}
      onCancel={onCancel}
      onConfirm={async () => {
        setSaving(true);
        try {
          await adminApi.forceDeleteJob(target.id);
          addToast({ title: 'Job force deleted', message: `${target.title} has been deleted.`, type: 'success' });
          onComplete?.();
        } catch (e) {
          addToast({ title: 'Error', message: 'Failed to delete job.', type: 'error' });
        } finally {
          setSaving(false);
        }
      }}
      open={Boolean(target)}
      title="Force delete job"
      variant="danger"
    />
  );
}

function NotFoundState({ title = 'Record not found', message = 'This admin record is unavailable.' }) {
  return <AdminEmptyState title={title} message={message} />;
}

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDataService.getAdminDashboardData()
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;
  if (!data) return <NotFoundState title="Dashboard Error" message="Failed to load admin metrics." />;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin Dashboard"
        title="Platform overview"
        description="Monitor users, jobs, reports, and administrative activity across Smart Job Portal."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-gutter">
        <AdminStatsCard icon="group" label="Total users" to={ROUTES.ADMIN_USERS} value={data.metrics?.totalUsers ?? 0} />
        <AdminStatsCard icon="person_search" label="Job seekers" to={ROUTES.ADMIN_USERS} value={data.metrics?.jobSeekers ?? 0} />
        <AdminStatsCard icon="domain" label="Companies" to={ROUTES.ADMIN_USERS} value={data.metrics?.companies ?? 0} />
        <AdminStatsCard icon="work" label="Active jobs" to={ROUTES.ADMIN_JOBS} value={data.metrics?.activeJobs ?? 0} />
        <AdminStatsCard icon="assignment" label="Applications" to={ROUTES.ADMIN_JOBS} value={data.metrics?.totalApplications ?? 0} />
        <AdminStatsCard icon="block" label="Banned users" to={ROUTES.ADMIN_USERS} value={data.metrics?.bannedUsers ?? 0} />
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-gutter">
        <Section title="Recent users">
          {data.recentUsers?.map((user) => (
            <Link className="flex items-center justify-between border-b border-outline-variant py-stack-md last:border-b-0 hover:bg-surface-container-low rounded-lg px-stack-sm transition-colors" key={user.id} to={`/admin/users/${user.id}`}>
              <div>
                <p className="font-h3 text-h3 text-primary">{user.name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</p>
              </div>
              <AdminRoleBadge role={user.role} />
            </Link>
          ))}
          {!data.recentUsers?.length && <p className="text-on-surface-variant p-4">No recent users.</p>}
        </Section>
        <Section title="Recent jobs">
          {data.recentJobs?.map((job) => (
            <Link className="flex items-center justify-between border-b border-outline-variant py-stack-md last:border-b-0 hover:bg-surface-container-low rounded-lg px-stack-sm transition-colors" key={job.id} to={`/admin/jobs/${job.id}`}>
              <div>
                <p className="font-h3 text-h3 text-primary">{job.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{job.company} · {job.location}</p>
              </div>
              <AdminStatusBadge status={job.status} />
            </Link>
          ))}
          {!data.recentJobs?.length && <p className="text-on-surface-variant p-4">No recent jobs.</p>}
        </Section>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-gutter">
        <Section title="Recent activity">
          {data.recentActivity?.map((item) => <AdminActivityItem item={item} key={item.id} />)}
          {!data.recentActivity?.length && <p className="text-on-surface-variant p-4">Activity log feature coming soon.</p>}
        </Section>
        <Section title="Quick actions">
          <div className="grid gap-stack-sm">
            <Link className={buttonPrimary} to={ROUTES.ADMIN_USERS}>Manage Users</Link>
            <Link className={buttonSecondary} to={ROUTES.ADMIN_JOBS}>Manage Jobs</Link>
            <Link className={buttonSecondary} to={ROUTES.ADMIN_ACTIVITY_LOG}>View Activity Log</Link>
          </div>
        </Section>
      </section>
    </>
  );
}

export function AdminUsersManagement() {
  const [filters, setFilters] = useState({ query: '', filter: 'all', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await adminDataService.getAdminUsers({ ...filters, page }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Users Management"
        title="Users"
        description="Search, filter, inspect, ban, and unban platform accounts."
      />
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-stack-md grid grid-cols-1 md:grid-cols-[1fr_190px_170px] gap-stack-md">
        <TextInput onChange={(e) => updateFilter('query', e.target.value)} placeholder="Search name, email, role, or status" value={filters.query} />
        <SelectInput onChange={(e) => updateFilter('filter', e.target.value)} value={filters.filter}>
          <option value="all">All</option>
          <option value="job_seekers">Job Seekers</option>
          <option value="companies">Companies</option>
          <option value="admins">Admins</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </SelectInput>
        <SelectInput onChange={(e) => updateFilter('sort', e.target.value)} value={filters.sort}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </SelectInput>
      </div>

      {loading ? <FullPageSpinner /> : (
        <>
          <AdminUserTable users={users} onStatusAction={setTarget} />
          <PaginationControls page={page} setPage={setPage} itemsCount={users.length} />
        </>
      )}

      <UserStatusModal
        onCancel={() => setTarget(null)}
        onComplete={() => { setTarget(null); refresh(); }}
        target={target}
      />
    </>
  );
}

export function AdminUserDetails() {
  const { userId, id } = useParams();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const fetchUser = useCallback(() => {
    setLoading(true);
    adminApi.getUserById(userId || id)
      .then(res => setUser(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId, id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await adminApi.verifyUser(user.id);
      addToast({ title: 'User verified', message: `${user.name} email verified successfully.`, type: 'success' });
      setUser(prev => ({ ...prev, email_verified_at: new Date().toISOString() }));
    } catch (e) {
      addToast({ title: 'Error', message: e?.response?.data?.message || 'Failed to verify user.', type: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <FullPageSpinner />;
  if (!user) return <NotFoundState title="User not found" message="This user account does not exist." />;

  const isBanned = Boolean(user.is_banned);
  const isVerified = Boolean(user.email_verified_at);

  return (
    <>
      <AdminPageHeader
        actions={
          <>
            <Link className={buttonSecondary} to={ROUTES.ADMIN_USERS}>Back to Users</Link>
            {!isVerified && (
              <button
                className={buttonSuccess}
                disabled={verifying}
                onClick={handleVerify}
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                {verifying ? 'Verifying...' : 'Verify Email'}
              </button>
            )}
            <button
              className={isBanned ? buttonPrimary : buttonDanger}
              onClick={() => setTarget(user)}
            >
              {isBanned ? 'Unban User' : 'Ban User'}
            </button>
          </>
        }
        eyebrow="User Details"
        title={user.name}
        description={user.email}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-gutter">
        <Section title="Account details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {[
              ['Role', <AdminRoleBadge role={user.role} key="role" />],
              ['Email Verified', (
                <span key="verified" className={`inline-flex items-center gap-1 font-label-sm px-2 py-1 rounded-full ${isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <span className="material-symbols-outlined text-[14px]">{isVerified ? 'check_circle' : 'pending'}</span>
                  {isVerified ? 'Verified' : 'Not Verified'}
                </span>
              )],
              ['Account Status', <AdminStatusBadge status={isBanned ? 'banned' : 'active'} key="banned" />],
              ['Created date', new Date(user.created_at).toLocaleDateString()],
              ['Email', user.email],
            ].map(([label, value]) => (
              <div className="bg-surface-container-low rounded-lg p-stack-md" key={label}>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</p>
                <div className="font-h3 text-h3 text-primary mt-unit">{value}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Profile summary">
          {user.role === 'job_seeker' && user.profile && (
            <>
              <p className="font-h3 text-primary mb-2">Job Seeker Skills</p>
              <div className="flex flex-wrap gap-unit">
                {user.profile.job_seeker_skills?.map((s) => (
                  <CompanySkillTag key={s.id}>{s.skill?.name}</CompanySkillTag>
                ))}
                {!user.profile.job_seeker_skills?.length && (
                  <p className="text-sm text-on-surface-variant">No skills listed.</p>
                )}
              </div>
            </>
          )}
          {user.role === 'company' && user.profile && (
            <>
              <p className="font-h3 text-primary mb-2">Company Info</p>
              <p className="text-on-surface-variant">
                Posted jobs: <span className="font-bold text-primary">{user.profile.job_posts_count || 0}</span>
              </p>
              <p className="text-on-surface-variant">
                Website:{' '}
                <a href={user.profile.website} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                  {user.profile.website || 'N/A'}
                </a>
              </p>
            </>
          )}
          {user.role === 'admin' && (
            <p className="text-on-surface-variant">Administrator account with platform management permissions.</p>
          )}
        </Section>
      </div>

      <UserStatusModal
        onCancel={() => setTarget(null)}
        onComplete={() => { setTarget(null); fetchUser(); }}
        target={target}
      />
    </>
  );
}

export function AdminJobsManagement() {
  const [filters, setFilters] = useState({ query: '', filter: 'all', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setJobs(await adminDataService.getAdminJobs({ ...filters, page }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Jobs Management"
        title="Jobs"
        description="Review platform job posts, reports, and force-delete problematic listings."
      />
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-stack-md grid grid-cols-1 md:grid-cols-[1fr_180px_190px] gap-stack-md">
        <TextInput onChange={(e) => updateFilter('query', e.target.value)} placeholder="Search title, company, location, skill, or status" value={filters.query} />
        <SelectInput onChange={(e) => updateFilter('filter', e.target.value)} value={filters.filter}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="deleted">Deleted</option>
        </SelectInput>
        <SelectInput onChange={(e) => updateFilter('sort', e.target.value)} value={filters.sort}>
          <option value="newest">Newest</option>
          <option value="applicants">Most applicants</option>
          <option value="reports">Most reports</option>
        </SelectInput>
      </div>

      {loading ? <FullPageSpinner /> : (
        <>
          <AdminJobTable jobs={jobs} onDeleteRequest={setTarget} />
          <PaginationControls page={page} setPage={setPage} itemsCount={jobs.length} />
        </>
      )}

      <JobDeleteModal
        onCancel={() => setTarget(null)}
        onComplete={() => { setTarget(null); refresh(); }}
        target={target}
      />
    </>
  );
}

export function AdminJobDetails() {
  const { jobId, id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      setJob(await adminDataService.getAdminJobById(jobId || id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jobId, id]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  if (loading) return <FullPageSpinner />;
  if (!job) return <NotFoundState title="Job not found" message="This job post does not exist." />;

  return (
    <>
      <AdminPageHeader
        actions={
          <>
            <Link className={buttonSecondary} to={ROUTES.ADMIN_JOBS}>Back to Jobs</Link>
            <button className={buttonDanger} onClick={() => setTarget(job)}>Force Delete Job</button>
          </>
        }
        eyebrow="Job Details"
        title={job.title}
        description={`${job.company} · ${job.location}`}
      />
      <div className="bg-error-container border border-error/20 text-error rounded-xl p-stack-lg">
        <p className="font-h3 text-h3">Force delete is permanent on the backend.</p>
        <p className="font-body-md text-body-md mt-unit">This action will physically remove the job post and cannot be undone.</p>
      </div>
      <Section title="Job information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          {[
            ['Status', <AdminStatusBadge status={job.status} />],
            ['Posted date', job.postedAt],
            ['Applicants', job.applicantsCount],
            ['Views', job.views],
            ['Reports', job.reportsCount || 0],
            ['Company ID', job.companyId],
          ].map(([label, value]) => (
            <div className="bg-surface-container-low rounded-lg p-stack-md" key={label}>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</p>
              <div className="font-h3 text-h3 text-primary mt-unit">{value}</div>
            </div>
          ))}
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{job.description}</p>
        <div className="flex flex-wrap gap-unit">
          {job.requiredSkills?.map((skill) => <CompanySkillTag key={skill}>{skill}</CompanySkillTag>)}
        </div>
      </Section>
      <JobDeleteModal
        onCancel={() => setTarget(null)}
        onComplete={() => { setTarget(null); navigate(ROUTES.ADMIN_JOBS); }}
        target={target}
      />
    </>
  );
}

export function AdminActivityLog() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Activity Log"
        title="Administrative activity"
        description="Audit user, job, admin, and security events."
      />
      <div className="bg-surface-container-low p-stack-lg rounded-xl border border-secondary text-center mb-stack-lg">
        <h3 className="font-h2 text-h2 text-secondary">Activity log feature coming soon</h3>
        <p className="text-on-surface-variant mt-unit">We are building an advanced audit trail for tracking platform events.</p>
      </div>
    </>
  );
}

export function AdminSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(() => ({
    name: 'Admin',
    email: 'admin@smartjobportal.local',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }));
  const [errors, setErrors] = useState({});
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!settings.name.trim()) next.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) next.email = 'Enter a valid email.';
    if (settings.newPassword || settings.confirmPassword || settings.currentPassword) {
      if (settings.newPassword.length < 8) next.newPassword = 'Password must be at least 8 characters.';
      if (settings.newPassword !== settings.confirmPassword) next.confirmPassword = 'Passwords must match.';
    }
    setErrors(next);
    return !Object.keys(next).length;
  };

  const save = () => {
    if (!validate()) return;
    addToast({ title: 'Settings saved', message: 'Admin settings were updated.' });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Admin settings"
        description="Manage admin profile, notifications, and security preferences."
      />
      <Section title="Admin profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <Field error={errors.name} label="Name">
            <TextInput onChange={(e) => update('name', e.target.value)} value={settings.name} />
          </Field>
          <Field error={errors.email} label="Email">
            <TextInput onChange={(e) => update('email', e.target.value)} value={settings.email} />
          </Field>
        </div>
      </Section>
      <div className="flex justify-end">
        <button className={buttonPrimary} onClick={save}>Save Changes</button>
      </div>
    </>
  );
}
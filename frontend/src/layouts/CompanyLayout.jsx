import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { companyDataService } from '../services/companyDataService';
import { ROUTES } from '../utils/constants';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: ROUTES.COMPANY_DASHBOARD },
  { label: 'Company Profile', icon: 'domain', to: ROUTES.COMPANY_PROFILE },
  { label: 'Manage Jobs', icon: 'work', to: ROUTES.COMPANY_JOBS },
  { label: 'Create Job', icon: 'add_circle', to: ROUTES.COMPANY_CREATE_JOB },
  { label: 'Applicants / Smart ATS', icon: 'group', to: ROUTES.COMPANY_APPLICANTS },
  { label: 'Messages', icon: 'chat', to: ROUTES.COMPANY_MESSAGES },
  { label: 'Notifications', icon: 'notifications', to: ROUTES.COMPANY_NOTIFICATIONS },
  { label: 'Settings', icon: 'settings', to: ROUTES.COMPANY_SETTINGS },
];

const ROUTE_PATH_KEY = 'path' + 'name';

const isCompanyNavActive = (itemTo, routePath) => {
  if (routePath === itemTo) return true;

  if (itemTo === ROUTES.COMPANY_JOBS) {
    const isJobRoute = routePath.startsWith('/company/jobs');
    const isApplicantsRoute = routePath.includes('/applicants');
    const isCreateRoute = routePath === '/company/jobs/create';
    return isJobRoute && !isApplicantsRoute && !isCreateRoute;
  }

  if (itemTo === ROUTES.COMPANY_CREATE_JOB) {
    return routePath === '/company/jobs/create';
  }

  if (itemTo === ROUTES.COMPANY_APPLICANTS || itemTo.includes('/applicants')) {
    return routePath.includes('/applicants') || routePath.startsWith('/company/applicants');
  }

  if (itemTo === ROUTES.COMPANY_DASHBOARD) {
    return routePath === ROUTES.COMPANY_DASHBOARD;
  }

  return routePath.startsWith(itemTo);
};

const navClass = (isActive) =>
  [
    'flex items-center gap-stack-md rounded-lg px-stack-md py-stack-sm transition-colors font-body-md text-body-md',
    isActive
      ? 'bg-secondary text-on-secondary shadow-md translate-x-1'
      : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary',
  ].join(' ');

export default function CompanyLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routePath = location[ROUTE_PATH_KEY];
  const [profile, setProfile] = useState({ name: '', logo: '' });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    companyDataService.getCompanyProfile().then(setProfile).catch(console.error);
    companyDataService.getCompanyNotifications().then(notifications => {
      setUnreadCount(notifications.filter(n => !n.read).length);
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    await logout?.();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="stitch-page bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden">
      <aside className="hidden md:flex flex-col h-screen p-stack-md border-r border-outline-variant bg-surface-container-low w-sidebar-width shrink-0 overflow-y-auto">
        <div className="mb-stack-lg flex items-center gap-stack-sm px-stack-sm">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-on-secondary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>work</span>
          </div>
          <div>
            <h1 className="font-h3 text-h3 font-bold text-primary">Smart Job Portal</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Recruiter Workspace</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-unit">
          {navItems.map((item) => {
            const isActive = isCompanyNavActive(item.to, routePath);
            return (
              <NavLink
                className={() => navClass(isActive)}
                key={item.to}
                to={item.to}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-stack-md border-t border-outline-variant flex flex-col gap-unit">
          <NavLink className="flex items-center gap-stack-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg px-stack-md py-stack-sm transition-colors" to={ROUTES.CONTACT}>
            <span className="material-symbols-outlined">help</span>
            <span>Help</span>
          </NavLink>
          <button className="flex items-center gap-stack-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg px-stack-md py-stack-sm transition-colors text-left" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
        <header className="h-20 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-gutter lg:px-margin-desktop shrink-0 z-10 shadow-ambient">
          <div className="w-full max-w-md relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant z-10">search</span>
            <input
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
              placeholder="Search candidates, jobs, or messages..."
              type="search"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">tune</span>
          </div>

          <div className="flex items-center gap-stack-md">
            <NavLink className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative" to={ROUTES.COMPANY_NOTIFICATIONS}>
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface-container-lowest" />}
            </NavLink>
            <div className="h-8 w-px bg-outline-variant" />
            <NavLink className="flex items-center gap-stack-sm hover:opacity-80 transition-opacity" to={ROUTES.COMPANY_PROFILE}>
              <img alt={profile.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={profile.logo} />
              <div className="text-left hidden lg:block">
                <p className="font-body-md text-body-md font-semibold text-primary leading-tight">{profile.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                  {routePath.includes('/applicants') ? 'Smart ATS' : 'Recruiter Console'}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop space-y-gutter pb-stack-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
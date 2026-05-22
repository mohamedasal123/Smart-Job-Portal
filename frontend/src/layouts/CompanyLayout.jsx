import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { companyDataService } from '../services/companyDataService';
import { ROUTES } from '../utils/constants';
import { useState, useEffect } from 'react';
import PageTransition from '../motion/PageTransition';
import ThemeToggle from '../components/ThemeToggle';
import icon from '../assets/icon.png';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: ROUTES.COMPANY_DASHBOARD },
  { key: 'profile', label: 'Company Profile', icon: 'domain', to: ROUTES.COMPANY_PROFILE },
  { key: 'jobs', label: 'Manage Jobs', icon: 'work', to: ROUTES.COMPANY_JOBS },
  { key: 'create-job', label: 'Create Job', icon: 'add_circle', to: ROUTES.COMPANY_CREATE_JOB },
  { key: 'applicants', label: 'Applicants / Smart ATS', icon: 'group', to: ROUTES.COMPANY_APPLICANTS },
  { key: 'messages', label: 'Messages', icon: 'chat', to: ROUTES.COMPANY_MESSAGES },
  { key: 'notifications', label: 'Notifications', icon: 'notifications', to: ROUTES.COMPANY_NOTIFICATIONS },
  { key: 'settings', label: 'Settings', icon: 'settings', to: ROUTES.COMPANY_SETTINGS },
];

const ROUTE_PATH_KEY = 'path' + 'name';

const isCompanyNavActive = (item, routePath) => {
  const itemTo = item.to;

  if (item.key === 'applicants') {
    return routePath.includes('/applicants') || routePath.startsWith('/company/applicants');
  }

  if (item.key === 'jobs') {
    const isJobRoute = routePath.startsWith('/company/jobs');
    const isApplicantsRoute = routePath.includes('/applicants');
    const isCreateRoute = routePath === '/company/jobs/create';
    return isJobRoute && !isApplicantsRoute && !isCreateRoute;
  }

  if (item.key === 'create-job') {
    return routePath === '/company/jobs/create';
  }

  if (routePath === itemTo) return true;

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
      <aside className="hidden md:flex flex-col h-screen p-stack-md border-r border-outline-variant bg-surface-container-low w-sidebar-width shrink-0 overflow-hidden">
        <div className="mb-stack-lg flex items-center gap-stack-sm px-stack-sm shrink-0">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img src={icon} alt="Smart Job Portal" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-h3 text-h3 font-bold text-primary">Smart Job Portal</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Recruiter Workspace</p>
          </div>
        </div>

        <nav className="flex-1 min-h-0 flex flex-col gap-unit overflow-y-auto pr-unit">
          {navItems.map((item) => {
            const isActive = isCompanyNavActive(item, routePath);
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

        <div className="mt-auto pt-stack-md border-t border-outline-variant flex flex-col gap-unit shrink-0 bg-surface-container-low">
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
            <ThemeToggle compact />
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
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}

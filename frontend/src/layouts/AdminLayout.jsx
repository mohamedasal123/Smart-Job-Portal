import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PageTransition from '../motion/PageTransition';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../utils/constants';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: ROUTES.ADMIN_DASHBOARD },
  { label: 'Users Management', icon: 'group', to: ROUTES.ADMIN_USERS },
  { label: 'Jobs Management', icon: 'work', to: ROUTES.ADMIN_JOBS },
  { label: 'Activity Log', icon: 'history', to: ROUTES.ADMIN_ACTIVITY_LOG },
  { label: 'Settings', icon: 'settings', to: ROUTES.ADMIN_SETTINGS },
];

const navClass = ({ isActive }) =>
  [
    'flex items-center gap-stack-md rounded-lg px-stack-md py-stack-sm transition-colors font-body-md text-body-md',
    isActive
      ? 'bg-secondary text-on-secondary shadow-md translate-x-1'
      : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary',
  ].join(' ');

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const settings = { name: 'Admin' };
  const metrics = { pendingReports: 0 };

  const handleLogout = async () => {
    await logout?.();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md text-body-md flex h-screen overflow-hidden">
      <aside className="hidden md:flex flex-col h-screen p-stack-md border-r border-outline-variant bg-surface-container-low w-sidebar-width shrink-0 overflow-y-auto">
        <div className="mb-stack-lg flex items-center gap-stack-sm px-stack-sm">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-on-secondary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-h3 text-h3 font-bold text-primary">Smart Job Portal</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-unit">
          {navItems.map((item) => (
            <NavLink className={navClass} end={item.to === ROUTES.ADMIN_DASHBOARD} key={item.to} to={item.to}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
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
              placeholder="Search users, jobs, or activity..."
              type="search"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">tune</span>
          </div>

          <div className="flex items-center gap-stack-md">
            <ThemeToggle compact />
            <NavLink className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative" to={ROUTES.ADMIN_ACTIVITY_LOG}>
              <span className="material-symbols-outlined">notifications</span>
              {metrics.pendingReports > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface-container-lowest" />}
            </NavLink>
            <div className="h-8 w-px bg-outline-variant" />
            <NavLink className="flex items-center gap-stack-sm hover:opacity-80 transition-opacity" to={ROUTES.ADMIN_SETTINGS}>
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-h3 text-h3">
                {settings.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="font-body-md text-body-md font-semibold text-primary leading-tight">{settings.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Platform Admin</p>
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

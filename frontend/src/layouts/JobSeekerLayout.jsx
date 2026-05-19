import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../utils/constants';

export default function JobSeekerLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/seeker/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/seeker/jobs', label: 'Browse Jobs', icon: 'search' },
    { to: '/seeker/recommended-jobs', label: 'Recommended Jobs', icon: 'star' },
    { to: '/seeker/saved-jobs', label: 'Saved Jobs', icon: 'bookmark' },
    { to: '/seeker/applications', label: 'Applications', icon: 'work' },
    { to: '/seeker/profile', label: 'Profile', icon: 'person' },
    { to: '/seeker/skills', label: 'Skills', icon: 'psychology' },
    { to: '/seeker/messages', label: 'Messages', icon: 'mail' },
    { to: '/seeker/notifications', label: 'Notifications', icon: 'notifications' },
    { to: '/seeker/settings', label: 'Settings', icon: 'settings' },
  ];

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body-md text-on-background">
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface-container-lowest border-b border-outline-variant">
        <Link className="font-h2 text-h2 font-bold text-primary" to={ROUTES.HOME}>
          Smart Job Portal
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-on-surface">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0`}
      >
        <div className="hidden md:flex p-6 items-center">
          <Link className="font-h2 text-h2 font-bold text-primary" to={ROUTES.HOME}>
            Smart Job Portal
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-label-md transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-error hover:bg-error-container/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 md:h-20 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="w-full pl-10 pr-4 py-2 bg-surface-variant/30 border border-outline-variant rounded-full text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Link
              to="/seeker/notifications"
              className="relative p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:block">
                <p className="font-label-md text-on-surface">{user?.name || 'Job Seeker'}</p>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  {user?.email || 'seeker@example.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

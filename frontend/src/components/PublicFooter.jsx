import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export default function PublicFooter() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant w-full py-stack-lg px-4 md:px-margin-desktop mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max-width mx-auto gap-8 md:gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
          <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center md:text-left">
            © 2024 Smart Job Portal. Intelligence in Recruitment.
          </div>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-4">
          <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.ABOUT || '#'}>About</Link>
          <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.PRIVACY || '#'}>Privacy</Link>
          <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.TERMS || '#'}>Terms</Link>
          <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.FAQ || '#'}>FAQ</Link>
          <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.CONTACT || '#'}>Support</Link>
        </nav>
      </div>
    </footer>
  );
}

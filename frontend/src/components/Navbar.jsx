import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS, PRODUCT_NAME, ROUTES } from '../utils/constants';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar" aria-label="Primary">
      <Link className="logo" to={ROUTES.HOME} aria-label={PRODUCT_NAME}>
        {PRODUCT_NAME}
      </Link>
      <div className="nav-links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            key={item.to}
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </div>
      <div className="nav-actions">
        <Link className="btn btn-secondary" to={ROUTES.LOGIN}>
          {t('buttons.login')}
        </Link>
        <Link className="btn btn-primary" to={ROUTES.POST_JOB}>
          {t('buttons.postJob')}
        </Link>
      </div>
    </nav>
  );
}

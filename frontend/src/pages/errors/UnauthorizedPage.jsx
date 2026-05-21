import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function UnauthorizedPage() {
  return (
    <div className={"stitch-page bg-background text-on-background min-h-screen flex flex-col font-body-md"}>
      <main className="flex-grow flex items-center justify-center p-gutter">
        <div className="max-w-2xl w-full text-center flex flex-col items-center">
          <div className="w-48 h-48 mb-stack-lg rounded-full bg-surface-container-high flex items-center justify-center relative overflow-hidden">
            <span className="material-symbols-outlined text-[100px] text-outline-variant" style={{fontVariationSettings: '"FILL" 0'}}>
              lock
            </span>
          </div>
          <h1 className="font-h1 text-h1 text-primary mb-stack-sm">
            401 Unauthorized
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto mb-stack-lg">
            You must be logged in to access this page. Please log in or register.
          </p>
          <div className="flex flex-col sm:flex-row gap-stack-md justify-center w-full max-w-md">
            <Link className="inline-flex items-center justify-center px-gutter py-stack-sm rounded-lg bg-secondary text-on-secondary font-body-lg text-body-lg font-bold hover:opacity-90 transition-opacity w-full sm:w-auto shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" to={ROUTES.LOGIN}>
              <span className="material-symbols-outlined mr-unit text-[20px]">login</span>
              Login
            </Link>
            <Link className="inline-flex items-center justify-center px-gutter py-stack-sm rounded-lg border border-outline-variant text-on-surface font-body-lg text-body-lg font-bold hover:bg-surface-container-low transition-colors w-full sm:w-auto bg-transparent" to={ROUTES.HOME}>
              <span className="material-symbols-outlined mr-unit text-[20px]">home</span>
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

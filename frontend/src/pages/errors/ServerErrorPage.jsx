import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function ServerErrorPage() {
  return (
    <div className={"stitch-page bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased"}>
      {/* Error state: Semantic suppression of navigation */}
      {/* The user is in a "dead end" relative to global nav, prioritizing the error canvas */}
      <main className="flex-grow flex items-center justify-center p-gutter">
        <div className="max-w-xl w-full bg-surface-container-lowest rounded-xl p-stack-lg shadow-[0px_4px_20px_rgba(15,23,42,0.05)] text-center flex flex-col items-center">
          <div aria-hidden="true" className="w-24 h-24 bg-error-container text-error rounded-full flex items-center justify-center mb-stack-md">
            <span className="material-symbols-outlined !text-[48px]" data-icon="dns" data-weight="fill" style={{fontVariationSettings: '"FILL" 1'}}>dns</span>
          </div>
          <div className="mb-stack-md">
            <p className="font-ai-score text-ai-score text-error mb-unit">500</p>
            <h1 className="font-h1 text-h1 text-primary">Something went wrong</h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md mx-auto">
            We're experiencing an internal server issue. Our team has been notified and is working to fix it. Please
            try again in a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-stack-md w-full justify-center mb-stack-md">
            <button className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-h3 text-h3 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" data-icon="refresh">refresh</span>
              Try Again
            </button>
            <Link className="w-full sm:w-auto bg-transparent border border-[#E2E8F0] text-[#0F172A] hover:bg-surface-container-low font-h3 text-h3 px-6 py-3 rounded-lg transition-colors flex items-center justify-center" to={ROUTES.HOME}>
              Go to Home
            </Link>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-stack-md">
            If the issue persists, please <Link className="text-[#2563EB] hover:underline font-semibold" to={ROUTES.CONTACT}>Contact
              Support</Link>.
          </p>
        </div>
      </main>
      
    </div>
  );
}

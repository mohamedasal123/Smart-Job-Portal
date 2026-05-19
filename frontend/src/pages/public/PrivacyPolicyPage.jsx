import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function PrivacyPolicyPage() {
  return (
    <div className={"stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen"}>
      <div>
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest dark:bg-surface-dim sticky top-0 z-50 w-full shadow-sm dark:shadow-none shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex justify-between items-center w-full px-margin-desktop py-stack-md max-w-container-max-width mx-auto">
            <div className="flex items-center gap-stack-lg">
              <Link className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed" to={ROUTES.HOME}>Smart Job Portal</Link>
              <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
                <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-3 py-2 rounded-lg" to={ROUTES.JOBS}>Browse Jobs</Link>
                <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-3 py-2 rounded-lg" to={ROUTES.COMPANIES}>Companies</Link>
                <Link className="text-on-surface-variant hover:text-secondary transition-colors font-h3 text-h3 font-semibold hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-3 py-2 rounded-lg" to={ROUTES.SALARY_GUIDE}>Salaries</Link>
              </nav>
            </div>
            <div className="flex items-center gap-stack-md">
              <Link className="hidden md:flex items-center justify-center px-4 py-2 border border-outline text-on-surface font-body-md font-semibold rounded-lg hover:bg-surface-container-low transition-colors" to={ROUTES.LOGIN}>Sign In</Link>
              <Link className="flex items-center justify-center px-4 py-2 bg-[#2563EB] text-on-primary font-body-md font-bold rounded-lg hover:bg-secondary-container transition-colors shadow-sm" to={ROUTES.LOGIN}>Post a Job</Link>
            </div>
          </div>
        </header>
        <main className="flex-grow flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="w-full bg-surface-container-lowest py-[80px] px-margin-desktop flex flex-col items-center justify-center border-b border-surface-container-high relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #131b2e 1px, transparent 0)', backgroundSize: '32px 32px'}}>
            </div>
            <div className="max-w-[800px] w-full text-center relative z-10">
              <h1 className="font-h1 text-h1 text-primary mb-stack-md">Privacy Policy</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-[600px] mx-auto">
                Your privacy is important to us. This policy explains how Smart Job Portal collects, uses, and protects your personal information.
              </p>
            </div>
          </section>
          {/* Main Content */}
          <section className="w-full max-w-container-max-width mx-auto px-margin-desktop py-[64px] flex flex-col md:flex-row gap-gutter">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-[280px] shrink-0">
              <div className="sticky top-[100px] bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm px-3 tracking-widest uppercase">
                  Sections</h3>
                <nav className="flex flex-col gap-1">
                  <a className="flex items-center justify-between px-3 py-2 bg-surface-container-low text-primary font-body-md font-semibold rounded-lg transition-colors border-l-4 border-[#2563EB]" href="#collection">
                    Information We Collect
                  </a>
                  <a className="flex items-center justify-between px-3 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-body-md rounded-lg transition-colors border-l-4 border-transparent" href="#usage">
                    How We Use It
                  </a>
                  <a className="flex items-center justify-between px-3 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-body-md rounded-lg transition-colors border-l-4 border-transparent" href="#sharing">
                    Data Sharing
                  </a>
                  <a className="flex items-center justify-between px-3 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-body-md rounded-lg transition-colors border-l-4 border-transparent" href="#security">
                    Data Security
                  </a>
                  <a className="flex items-center justify-between px-3 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-body-md rounded-lg transition-colors border-l-4 border-transparent" href="#rights">
                    Your Rights
                  </a>
                  <a className="flex items-center justify-between px-3 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-body-md rounded-lg transition-colors border-l-4 border-transparent" href="#cookies">
                    Cookies
                  </a>
                </nav>
              </div>
            </aside>
            {/* Privacy Policy Content */}
            <div className="flex-grow max-w-[800px]">
              <div className="mb-12 scroll-mt-[100px]" id="collection">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  Information We Collect</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    We collect information you provide directly when you create an account, upload your CV, apply for jobs, or contact us. This includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant font-body-md">
                    <li>Name, email address, and contact information</li>
                    <li>Professional experience, education, and skills</li>
                    <li>CV/resume documents you upload</li>
                    <li>Job applications and saved job preferences</li>
                    <li>Account settings and communication preferences</li>
                    <li>Usage data such as pages visited and features used</li>
                  </ul>
                </div>
              </div>
              <div className="mb-12 scroll-mt-[100px]" id="usage">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  How We Use Your Information</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    We use your information to provide and improve our services, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant font-body-md">
                    <li>Matching you with relevant job opportunities using our AI technology</li>
                    <li>Facilitating job applications between job seekers and companies</li>
                    <li>Personalizing your job search and recommendation experience</li>
                    <li>Analyzing your CV/resume to extract and structure professional data</li>
                    <li>Sending notifications about application status updates</li>
                    <li>Improving our platform and developing new features</li>
                  </ul>
                </div>
              </div>
              <div className="mb-12 scroll-mt-[100px]" id="sharing">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  Data Sharing</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    We share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant font-body-md">
                    <li><strong>With employers:</strong> When you apply for a job, the hiring company receives your application and profile data.</li>
                    <li><strong>Service providers:</strong> We may share data with trusted third-party services that help us operate our platform.</li>
                    <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
                  </ul>
                  <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3 mt-4">
                    <span className="material-symbols-outlined text-[#3B82F6] mt-0.5">info</span>
                    <p className="font-body-md text-body-md text-on-surface text-sm">We never sell your personal data to third parties for advertising or marketing purposes.</p>
                  </div>
                </div>
              </div>
              <div className="mb-12 scroll-mt-[100px]" id="security">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  Data Security</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest, secure authentication, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>
              </div>
              <div className="mb-12 scroll-mt-[100px]" id="rights">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  Your Rights</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    You have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant font-body-md">
                    <li><strong>Access:</strong> Request a copy of your personal data.</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data.</li>
                    <li><strong>Export:</strong> Download your data in a portable format.</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                  </ul>
                </div>
              </div>
              <div className="mb-12 scroll-mt-[100px]" id="cookies">
                <h2 className="font-h2 text-h2 text-primary mb-stack-md border-b border-surface-container-high pb-2">
                  Cookies</h2>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-surface-container-high p-stack-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    We use cookies and similar technologies to maintain your session, remember your preferences, and improve your experience. Essential cookies are required for the platform to function. You can manage cookie preferences through your browser settings.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="w-full bg-surface-container-low py-[64px] px-margin-desktop flex flex-col items-center justify-center mt-auto border-t border-surface-container-high">
            <div className="max-w-[600px] text-center bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-surface-container-high opacity-20 transform rotate-12">
                <span className="material-symbols-outlined text-[120px]">security</span>
              </div>
              <h2 className="font-h2 text-h2 text-primary mb-2 relative z-10">Have questions about your data?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10">Our privacy team is here to help. Contact us for any data-related inquiries.</p>
              <Link className="px-6 py-3 bg-transparent border border-outline text-primary font-body-md font-bold rounded-lg hover:bg-surface-container transition-colors relative z-10 flex items-center gap-2 mx-auto w-fit" to={ROUTES.CONTACT}>
                <span className="material-symbols-outlined text-[20px]">mail</span> Contact Privacy Team
              </Link>
            </div>
          </section>
        </main>
        {/* Footer */}
        <footer className="bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant w-full py-stack-lg px-margin-desktop">
          <div className="flex justify-between items-center max-w-container-max-width mx-auto flex-col md:flex-row gap-4">
            <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">
              Smart Job Portal
            </div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center md:text-left">
              © 2024 Smart Job Portal. Intelligence in Recruitment.
            </div>
            <nav className="flex gap-6">
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.PRIVACY}>Privacy</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.TERMS}>Terms</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.CONTACT}>Support</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

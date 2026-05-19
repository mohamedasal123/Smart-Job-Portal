import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function HomePage() {
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md flex flex-col min-h-screen">
      <div>
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest dark:bg-surface-dim sticky top-0 z-50 w-full shadow-sm shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
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
              <Link className="flex items-center justify-center px-4 py-2 bg-[#2563EB] text-on-primary font-body-md font-bold rounded-lg hover:bg-secondary-container transition-colors shadow-sm" to={ROUTES.POST_JOB}>Post a Job</Link>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="w-full bg-surface-container-lowest py-[100px] px-margin-desktop flex flex-col items-center justify-center border-b border-surface-container-high relative overflow-hidden">
            {/* Dot pattern background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #131b2e 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
            {/* Decorative gradient blob */}
            <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none" style={{background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)'}}></div>
            <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none" style={{background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)'}}></div>

            <div className="max-w-[860px] w-full text-center relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#dbe1ff] text-secondary rounded-full font-label-sm text-label-sm uppercase tracking-wider mb-6 border border-secondary/10">
                <span className="material-symbols-outlined text-[16px]" data-weight="fill">auto_awesome</span>
                AI-Powered Job Matching
              </div>

              <h1 className="font-h1 text-[clamp(2.5rem,7vw,4.5rem)] font-bold text-primary mb-stack-md leading-[1.05] tracking-tight">
                Find Your Dream Job,<br />Smarter & Faster.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-[640px] mx-auto leading-relaxed">
                Join the next-generation job platform. Smart Job Portal uses advanced AI to match your unique skills with the right opportunities at top companies worldwide.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full max-w-[760px] mx-auto bg-surface-container-lowest border border-outline-variant rounded-full shadow-[0px_10px_30px_rgba(15,23,42,0.1)] flex items-center p-1.5 focus-within:border-secondary transition-colors">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <span className="material-symbols-outlined text-outline text-[20px]">search</span>
                  <input
                    className="w-full bg-transparent border-0 outline-none font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant py-3"
                    placeholder="Job title, keywords, or company"
                    type="text"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                  />
                </div>
                <div className="w-px h-8 bg-outline-variant hidden md:block"></div>
                <div className="flex-1 items-center gap-2 px-4 hidden md:flex">
                  <span className="material-symbols-outlined text-outline text-[20px]">location_on</span>
                  <input
                    className="w-full bg-transparent border-0 outline-none font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant py-3"
                    placeholder="City, state, or remote"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="px-8 py-3 bg-[#2563EB] text-on-primary font-body-md font-bold rounded-full hover:bg-secondary-container transition-colors whitespace-nowrap">
                  Search Jobs
                </button>
              </form>

              {/* Popular Searches */}
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-on-surface-variant font-body-md">
                <span className="text-outline">Popular:</span>
                {['React Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager'].map((term) => (
                  <Link key={term} to={ROUTES.JOBS} className="px-3 py-1 rounded-full border border-outline-variant hover:border-secondary hover:text-secondary transition-colors text-sm">
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="w-full max-w-container-max-width mx-auto px-margin-desktop py-[48px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[720px] mx-auto">
              {[
                { number: '10k+', label: 'Active Jobs', icon: 'work' },
                { number: '500+', label: 'Top Companies', icon: 'apartment' },
                { number: '24h', label: 'Avg. Response Time', icon: 'schedule' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] transition-shadow">
                  <span className="material-symbols-outlined text-secondary text-[28px] mb-2">{stat.icon}</span>
                  <p className="font-h1 text-h1 text-primary">{stat.number}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full bg-surface-container-low py-[80px] px-margin-desktop border-t border-b border-surface-container-high">
            <div className="max-w-container-max-width mx-auto">
              <div className="text-center mb-12">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">How It Works</p>
                <h2 className="font-h1 text-h1 text-primary mb-stack-sm">Your Career, Simplified</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[560px] mx-auto">Three simple steps to find and land your next role with AI-powered precision.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
                {[
                  {
                    step: '01',
                    icon: 'upload_file',
                    title: 'Upload Your CV',
                    description: 'Our AI instantly parses your resume, extracting your skills, experience, and qualifications into a smart profile.',
                  },
                  {
                    step: '02',
                    icon: 'auto_awesome',
                    title: 'Get AI Matches',
                    description: 'Our matching algorithm analyzes hundreds of factors to surface the jobs that best fit your unique profile and goals.',
                  },
                  {
                    step: '03',
                    icon: 'handshake',
                    title: 'Apply & Connect',
                    description: 'Apply with one click, track your applications in real-time, and connect directly with hiring managers.',
                  },
                ].map((item) => (
                  <div key={item.step} className="relative bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] transition-all hover:-translate-y-1 group">
                    <div className="absolute -top-4 left-8 px-3 py-1 bg-secondary text-on-secondary font-label-sm text-label-sm rounded-full">
                      Step {item.step}
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-[#dbe1ff] flex items-center justify-center mb-5 mt-2 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined text-secondary text-[28px] group-hover:text-on-secondary transition-colors">{item.icon}</span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary mb-2">{item.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Categories Section */}
          <section className="w-full py-[80px] px-margin-desktop">
            <div className="max-w-container-max-width mx-auto">
              <div className="text-center mb-12">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Explore</p>
                <h2 className="font-h1 text-h1 text-primary mb-stack-sm">Popular Job Categories</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[560px] mx-auto">Browse jobs across the most in-demand fields and industries.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1000px] mx-auto">
                {[
                  { icon: 'code', label: 'Engineering', count: '2,340 jobs' },
                  { icon: 'palette', label: 'Design', count: '1,120 jobs' },
                  { icon: 'campaign', label: 'Marketing', count: '890 jobs' },
                  { icon: 'analytics', label: 'Data Science', count: '1,540 jobs' },
                  { icon: 'account_balance', label: 'Finance', count: '720 jobs' },
                  { icon: 'support_agent', label: 'Customer Success', count: '560 jobs' },
                  { icon: 'inventory_2', label: 'Operations', count: '430 jobs' },
                  { icon: 'groups', label: 'Human Resources', count: '380 jobs' },
                ].map((cat) => (
                  <Link key={cat.label} to={ROUTES.JOBS} className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-surface-container-high hover:border-secondary hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] transition-all hover:-translate-y-1 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#dbe1ff] flex items-center justify-center mb-3 group-hover:bg-secondary transition-colors">
                      <span className="material-symbols-outlined text-secondary text-[24px] group-hover:text-on-secondary transition-colors">{cat.icon}</span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary mb-1 text-center">{cat.label}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{cat.count}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full bg-primary-container py-[80px] px-margin-desktop">
            <div className="max-w-[680px] mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-on-primary-fixed-variant/30 font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                Ready to Begin?
              </div>
              <h2 className="font-h1 text-h1 text-on-secondary-container mb-stack-md">
                Your Next Career Move Starts Here
              </h2>
              <p className="font-body-lg text-body-lg text-secondary-fixed mb-8 max-w-[520px] mx-auto">
                Join thousands of professionals who found their perfect match through our AI-powered platform.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to={ROUTES.REGISTER} className="px-8 py-3.5 bg-[#2563EB] text-on-primary font-h3 text-h3 rounded-lg hover:bg-secondary-container transition-colors shadow-sm">
                  Create Free Account
                </Link>
                <Link to={ROUTES.JOBS} className="px-8 py-3.5 bg-transparent border border-on-primary-fixed-variant/30 text-on-secondary-container font-h3 text-h3 rounded-lg hover:bg-on-primary-fixed-variant/10 transition-colors">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant w-full py-stack-lg px-margin-desktop">
          <div className="flex justify-between items-center max-w-container-max-width mx-auto flex-col md:flex-row gap-4">
            <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center md:text-left">
              © 2024 Smart Job Portal. Intelligence in Recruitment.
            </div>
            <nav className="flex gap-6">
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.PRIVACY}>Privacy</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.TERMS}>Terms</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.HOME}>API</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all hover:opacity-80" to={ROUTES.CONTACT}>Support</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validation';
import { useToast } from '../../components/useToast';

export default function ContactPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', subject: 'Job Seeker Support', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

  const showError = (field) => (touched[field] || Object.keys(errors).length > 0) && errors[field];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setTouched({ fullName: true, email: true, message: true });
      return;
    }
    setLoading(true);
    try {
      // TODO: Pending backend endpoint confirmation (POST /contact)
      await new Promise((r) => setTimeout(r, 1500));
      addToast({ title: 'Message Sent', message: "We'll get back to you shortly.", type: 'success' });
      setForm({ fullName: '', email: '', subject: 'Job Seeker Support', message: '' });
      setTouched({});
      setErrors({});
    } catch {
      addToast({ title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col">
      <div>
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest dark:bg-surface-dim shadow-[0px_4px_20px_rgba(15,23,42,0.05)] shadow-sm dark:shadow-none sticky top-0 z-50">
          <div className="flex justify-between items-center w-full px-margin-desktop py-stack-md max-w-container-max-width mx-auto">
            <div className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
            <nav className="hidden md:flex gap-gutter items-center">
              <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-stack-sm py-unit rounded-DEFAULT" to={ROUTES.JOBS}>Browse Jobs</Link>
              <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-stack-sm py-unit rounded-DEFAULT" to={ROUTES.COMPANIES}>Companies</Link>
              <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-stack-sm py-unit rounded-DEFAULT" to={ROUTES.SALARY_GUIDE}>Salaries</Link>
            </nav>
            <div className="flex items-center gap-stack-md">
              <Link className="font-h3 text-h3 font-semibold text-on-surface-variant hover:text-secondary transition-colors hover:bg-surface-container-low dark:hover:bg-inverse-surface duration-200 px-stack-md py-stack-sm rounded-DEFAULT border border-transparent" to={ROUTES.LOGIN}>Sign In</Link>
              <Link className="font-h3 text-h3 font-semibold bg-secondary text-on-secondary px-stack-md py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity" to={ROUTES.POST_JOB}>Post a Job</Link>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-grow w-full max-w-container-max-width mx-auto px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
          {/* Hero Section */}
          <section className="text-center py-stack-lg max-w-2xl mx-auto">
            <h1 className="font-h1 text-h1 text-primary mb-stack-md">Contact Us</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Whether you're a job seeker navigating your career or a company looking for top talent, our AI-driven platform is here to help. Reach out to our support team for assistance.
            </p>
          </section>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left Column: Form */}
            <section className="lg:col-span-7 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">Send us a message</h2>
              <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-gutter">
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="fullName">FULL NAME</label>
                    <input className={`w-full bg-surface-container-low border ${showError('fullName') ? 'border-error' : 'border-outline-variant'} rounded-lg px-stack-md py-stack-sm text-on-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow`} id="fullName" name="fullName" placeholder="Jane Doe" type="text" value={form.fullName} onChange={handleChange} onBlur={handleBlur} />
                    {showError('fullName') && <p className="mt-unit font-body-md text-error text-sm">{errors.fullName}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="email">EMAIL ADDRESS</label>
                    <input className={`w-full bg-surface-container-low border ${showError('email') ? 'border-error' : 'border-outline-variant'} rounded-lg px-stack-md py-stack-sm text-on-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow`} id="email" name="email" placeholder="jane@example.com" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} />
                    {showError('email') && <p className="mt-unit font-body-md text-error text-sm">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="subject">SUBJECT</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-stack-md py-stack-sm text-on-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow appearance-none" id="subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option>Job Seeker Support</option>
                    <option>Employer Services</option>
                    <option>Technical Issue</option>
                    <option>Billing Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="message">MESSAGE</label>
                  <textarea className={`w-full bg-surface-container-low border ${showError('message') ? 'border-error' : 'border-outline-variant'} rounded-lg px-stack-md py-stack-sm text-on-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow resize-y`} id="message" name="message" placeholder="How can we help you?" rows={5} value={form.message} onChange={handleChange} onBlur={handleBlur} />
                  {showError('message') && <p className="mt-unit font-body-md text-error text-sm">{errors.message}</p>}
                </div>
                <button
                  className={`mt-stack-sm self-start bg-secondary text-on-secondary font-h3 text-h3 font-semibold px-stack-lg py-stack-sm rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-unit ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  type="submit" disabled={loading}
                >
                  {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  {!loading && <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: 20 }}>send</span>}
                </button>
              </form>
            </section>
            {/* Right Column: Contact Info & FAQ */}
            <section className="lg:col-span-5 flex flex-col gap-gutter">
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] flex flex-col gap-stack-md">
                <h3 className="font-h3 text-h3 text-primary mb-unit">Contact Information</h3>
                <div className="flex items-start gap-stack-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">mail</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit">Email</p>
                    <a className="font-body-lg text-body-lg text-secondary hover:underline" href="mailto:support@smartjobportal.com">support@smartjobportal.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-stack-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">phone</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit">Phone</p>
                    <p className="font-body-lg text-body-lg text-on-background">+1 (555) 123-4567</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-unit">Mon-Fri, 9am-6pm PST</p>
                  </div>
                </div>
                <div className="flex items-start gap-stack-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit">Location</p>
                    <p className="font-body-lg text-body-lg text-on-background">100 Innovation Drive</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border-l-4 border-secondary">
                <div className="flex items-start gap-stack-md">
                  <span className="material-symbols-outlined text-secondary mt-1">help</span>
                  <div>
                    <h4 className="font-h3 text-h3 text-primary mb-unit">Looking for quick answers?</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-stack-sm">Check out our Frequently Asked Questions. You might find what you need without waiting.</p>
                    <Link className="font-body-md text-body-md text-secondary font-semibold hover:underline flex items-center gap-unit" to={ROUTES.FAQ}>
                      Browse FAQ
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant mt-auto">
          <div className="w-full py-stack-lg px-margin-desktop flex justify-between items-center max-w-container-max-width mx-auto">
            <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
            <nav className="flex gap-stack-md">
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.PRIVACY}>Privacy</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.TERMS}>Terms</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.HOME}>API</Link>
              <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.CONTACT}>Support</Link>
            </nav>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant">© 2024 Smart Job Portal. Intelligence in Recruitment.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

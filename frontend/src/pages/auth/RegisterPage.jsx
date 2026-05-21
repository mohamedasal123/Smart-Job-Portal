import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { evaluatePasswordStrength, isValidEmail } from '../../utils/validation';
import { useToast } from '../../components/useToast';
import { useAuth } from '../../context/useAuth';
import { normalizeApiError } from '../../utils/apiError';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [role, setRole] = useState('seeker');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', terms: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const strength = evaluatePasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(form.password)) {
      e.password = 'Password must contain at least one number.';
    }
    if (!form.terms) e.terms = 'You must agree to the terms.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleBlur = (e) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setTouched({ fullName: true, email: true, password: true, terms: true });
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setLoading(true);
    setServerError('');
    
    // Map role
    const backendRole = role === 'recruiter' ? 'company' : 'job_seeker';

    try {
      await register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        password_confirmation: form.password,
        role: backendRole,
      });
      addToast({ title: 'Account Created!', message: 'Please check your email for verification.', type: 'success' });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setServerError(normalizeApiError(err));
      addToast({ title: 'Registration Failed', message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="stitch-page bg-background font-body-lg text-on-background min-h-screen flex items-center justify-center p-gutter">
      <div className="w-full max-w-[1000px] bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image */}
        <div className="hidden md:block md:w-1/2 relative bg-surface-container-high overflow-hidden">
          <img alt="Professional recruitment graphic" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPvtetqnhY4RWY5O63vabeDq4Cf_QgSib0UUF6JaBdBPiGpT7Pq3xGWfdVyQiPFT8XcugcVqMUxJ6K7K6iih4mGZBUvfTtxyIzhuEshzb8LLOCh3GbMYGdYcVR3L3QCneHolJAFfzPgg6WRDxjkER1ShC3y52A5bNP66PcQw2ZKFiB7WqcaD2U7V9FlhTM9HFIntqIgX5nPT14bJIeetxU9nlVLjb_x1GUTx9RNOfLuBjml2IxT95b9AsQiqbFfkFAr2czPUlpZY3L" />
          <div className="absolute inset-0 bg-primary/10" />
          <div className="absolute bottom-0 left-0 right-0 p-stack-lg bg-gradient-to-t from-primary/80 to-transparent text-on-primary">
            <h2 className="font-h2 text-h2 mb-stack-sm text-on-primary">Intelligence in Recruitment.</h2>
            <p className="font-body-lg text-body-lg text-surface-container-low">Join Smart Job Portal to connect with top opportunities or find exceptional talent using advanced data-driven matching.</p>
          </div>
        </div>
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-stack-lg md:p-[48px] flex flex-col justify-center">
          <div className="text-center mb-stack-lg">
            <h1 className="font-h1 text-h1 text-primary mb-stack-sm tracking-tight">Smart Job Portal</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Create your account to get started.</p>
          </div>
          {/* Role Selection */}
          <div className="mb-stack-lg">
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-stack-sm uppercase tracking-wider">I am a...</label>
            <div className="grid grid-cols-2 gap-stack-md">
              <button
                className={`flex flex-col items-center justify-center p-stack-md rounded-lg border-2 transition-all ${role === 'seeker' ? 'border-secondary bg-surface-container-low text-secondary' : 'border-surface-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low'}`}
                type="button"
                onClick={() => setRole('seeker')}
              >
                <span className="material-symbols-outlined text-3xl mb-stack-sm" style={{ fontVariationSettings: role === 'seeker' ? '"FILL" 1' : '"FILL" 0' }}>person_search</span>
                <span className="font-h3 text-h3 text-center">Job Seeker</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center p-stack-md rounded-lg border-2 transition-all ${role === 'recruiter' ? 'border-secondary bg-surface-container-low text-secondary' : 'border-surface-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low'}`}
                type="button"
                onClick={() => setRole('recruiter')}
              >
                <span className="material-symbols-outlined text-3xl mb-stack-sm" style={{ fontVariationSettings: role === 'recruiter' ? '"FILL" 1' : '"FILL" 0' }}>business_center</span>
                <span className={`font-h3 text-h3 text-center ${role === 'recruiter' ? '' : 'text-on-surface'}`}>Recruiter</span>
              </button>
            </div>
          </div>
          {/* Server Error */}
          {serverError && (
            <div className="flex items-start gap-stack-sm p-stack-sm bg-error-container rounded-lg border border-error/20 mb-stack-md">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: '"FILL" 1' }}>error</span>
              <p className="font-body-md text-body-md text-on-error-container">{serverError}</p>
            </div>
          )}
          <form className="space-y-stack-md" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-unit uppercase tracking-wider" htmlFor="fullName">Full Name</label>
              <input
                className={`w-full rounded-lg ${showError('fullName') ? 'bg-error-container/20 border-error' : 'bg-surface-container-low border-surface-variant'} border px-stack-md py-stack-sm font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder:text-outline-variant transition-all`}
                id="fullName" name="fullName" placeholder="Jane Doe" type="text"
                value={form.fullName} onChange={handleChange} onBlur={handleBlur}
              />
              {showError('fullName') && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.fullName}</p>}
            </div>
            {/* Email */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-unit uppercase tracking-wider" htmlFor="email">Email Address</label>
              <input
                className={`w-full rounded-lg ${showError('email') ? 'bg-error-container/20 border-error' : 'bg-surface-container-low border-surface-variant'} border px-stack-md py-stack-sm font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder:text-outline-variant transition-all`}
                id="email" name="email" type="email" placeholder="jane@example.com"
                value={form.email} onChange={handleChange} onBlur={handleBlur}
              />
              {showError('email') && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.email}</p>}
            </div>
            {/* Password */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-unit uppercase tracking-wider" htmlFor="password">Password</label>
              <input
                className="w-full rounded-lg bg-surface-container-low border border-surface-variant px-stack-md py-stack-sm font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder:text-outline-variant transition-all"
                id="password" name="password" placeholder="••••••••" type="password"
                value={form.password} onChange={handleChange} onBlur={handleBlur}
              />
              {/* Password Strength Indicator */}
              {form.password.length > 0 && (
                <>
                  <div className="mt-stack-sm flex gap-unit h-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-surface-variant'}`} />
                    ))}
                  </div>
                  <div className="mt-unit flex justify-between">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {[
                        { key: 'length', label: '8+ chars' },
                        { key: 'uppercase', label: 'A-Z' },
                        { key: 'lowercase', label: 'a-z' },
                        { key: 'number', label: '0-9' },
                        { key: 'special', label: '!@#$' },
                      ].map((c) => (
                        <span key={c.key} className={`font-label-sm text-[11px] ${strength.criteria[c.key] ? 'text-[#22C55E]' : 'text-outline'}`}>
                          {strength.criteria[c.key] ? '✓' : '○'} {c.label}
                        </span>
                      ))}
                    </div>
                    <span className={`font-body-md text-body-md text-xs text-right whitespace-nowrap ${strength.level <= 1 ? 'text-error' : strength.level <= 2 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                      {strength.label}
                    </span>
                  </div>
                </>
              )}
              {showError('password') && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.password}</p>}
            </div>
            {/* Terms */}
            <div className="flex items-start gap-stack-sm pt-stack-sm">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/50 bg-surface-container-low" id="terms" name="terms" type="checkbox" checked={form.terms} onChange={handleChange} />
              </div>
              <label className="font-body-md text-body-md text-on-surface-variant leading-tight" htmlFor="terms">
                I agree to the <Link className="text-secondary hover:underline" to={ROUTES.TERMS}>Terms of Service</Link> and <Link className="text-secondary hover:underline" to={ROUTES.PRIVACY}>Privacy Policy</Link>.
              </label>
            </div>
            {showError('terms') && <p className="font-body-md text-body-md text-error text-sm">{errors.terms}</p>}
            {/* Submit */}
            <div className="pt-stack-md">
              <button
                className={`w-full bg-secondary text-on-secondary font-h3 text-h3 py-stack-sm rounded-lg hover:bg-secondary-container transition-colors shadow-sm flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                type="submit" disabled={loading}
              >
                {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="mt-stack-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account? <Link className="text-secondary font-semibold hover:underline" to={ROUTES.LOGIN}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

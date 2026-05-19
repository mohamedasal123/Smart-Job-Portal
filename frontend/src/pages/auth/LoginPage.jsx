import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, getRoleRedirect } from '../../utils/constants';
import { useToast } from '../../components/useToast';
import { useAuth } from '../../context/useAuth';
import { normalizeApiError } from '../../utils/apiError';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // 1. التوجيه هيحصل هنا بس! لما الـ user state تتحدث فعلياً
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname;
      // بنوجهه للمكان اللي كان رايحه، أو للصفحة الافتراضية للرول بتاعته
      navigate(from || getRoleRedirect(user.role) || ROUTES.HOME, { replace: true });
    }
  }, [user, navigate, location]);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // 2. بننده دالة اللوجين من الكونتكست، والمفروض الدالة دي بتعمل setUser
      await login(form);
      addToast({ title: 'Welcome back!', message: 'Login successful.', type: 'success' });

      // شيلنا الـ navigate من هنا عشان ميعملش تضارب مع الـ useEffect
      // شيلنا الـ flushSync لأن ملهاش لازمة هنا وكانت ممكن تعمل مشاكل

    } catch (err) {
      setServerError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stitch-page bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      <header className="w-full px-gutter md:px-margin-desktop py-stack-md flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest">
        <Link className="font-h2 text-h2 font-bold text-primary" to={ROUTES.HOME}>
          Smart Job Portal
        </Link>
        <nav className="hidden md:flex items-center gap-stack-lg">
          <Link className="text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.JOBS}>Browse Jobs</Link>
          <Link className="text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.COMPANIES}>Companies</Link>
          <Link className="text-on-surface-variant hover:text-secondary transition-colors" to={ROUTES.SALARY_GUIDE}>Salaries</Link>
        </nav>
      </header>

      <main className="flex-1 grid lg:grid-cols-2 bg-background">
        <section className="hidden lg:flex flex-col justify-between p-margin-desktop bg-primary-container text-on-secondary-container">
          <div>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold mb-stack-lg">S</div>
            <h1 className="font-h1 text-h1 mb-stack-md">Find better matches, faster.</h1>
            <p className="font-body-lg text-body-lg max-w-xl text-secondary-fixed">
              Sign in to manage applications, review recommendations, and keep your Smart Job Portal profile ready for the next opportunity.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-stack-md">
            <div className="rounded-xl border border-on-primary-fixed-variant/30 p-stack-md">
              <p className="font-h2 text-h2">10k+</p>
              <p className="font-label-sm text-label-sm text-secondary-fixed">Active Jobs</p>
            </div>
            <div className="rounded-xl border border-on-primary-fixed-variant/30 p-stack-md">
              <p className="font-h2 text-h2">500+</p>
              <p className="font-label-sm text-label-sm text-secondary-fixed">Companies</p>
            </div>
            <div className="rounded-xl border border-on-primary-fixed-variant/30 p-stack-md">
              <p className="font-h2 text-h2">24h</p>
              <p className="font-label-sm text-label-sm text-secondary-fixed">Avg. Response</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-gutter py-margin-desktop">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-stack-lg">
            <div className="mb-stack-lg">
              <p className="font-label-sm text-label-sm uppercase text-secondary mb-unit">Welcome back</p>
              <h2 className="font-h1 text-h1 text-primary">Log in to Smart Job Portal</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">
                Use your account email and password to continue.
              </p>
            </div>

            {serverError && (
              <div className="flex items-start gap-stack-sm p-stack-sm bg-error-container rounded-lg border border-error/20 mb-stack-md">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: '"FILL" 1' }}>error</span>
                <p className="font-body-md text-body-md text-on-error-container">{serverError}</p>
              </div>
            )}

            <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">Email Address</label>
                <input
                  className={`mt-unit w-full rounded-lg border ${errors.email ? 'border-error bg-error-container/20' : 'border-outline-variant bg-surface-container-lowest'} px-stack-md py-stack-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none`}
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">Password</label>
                  <Link className="font-label-sm text-label-sm text-secondary hover:underline" to="/forgot-password">Forgot password?</Link>
                </div>
                <input
                  className={`mt-unit w-full rounded-lg border ${errors.password ? 'border-error bg-error-container/20' : 'border-outline-variant bg-surface-container-lowest'} px-stack-md py-stack-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none`}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.password}</p>}
              </div>

              <button
                className={`w-full bg-secondary text-on-secondary font-h3 text-h3 py-3 rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {loading ? 'Signing in...' : 'Log In'}
              </button>
            </form>

            <p className="font-body-md text-body-md text-on-surface-variant text-center mt-stack-lg">
              New to Smart Job Portal?{' '}
              <Link className="text-secondary font-semibold hover:underline" to={ROUTES.REGISTER}>Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
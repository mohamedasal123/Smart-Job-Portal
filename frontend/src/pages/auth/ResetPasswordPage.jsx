import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { evaluatePasswordStrength } from '../../utils/validation';
import { useToast } from '../../components/useToast';
import { authApi } from '../../api/authApi';

export default function ResetPasswordPage() {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = evaluatePasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) e.form = 'Reset link is invalid or missing required data.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Password must contain at least one uppercase letter.';
    else if (!/[0-9]/.test(form.password)) e.password = 'Password must contain at least one number.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      await authApi.resetPassword({
        token: searchParams.get('token'),
        email: searchParams.get('email'),
        password: form.password,
        password_confirmation: form.confirmPassword,
      });
      setSuccess(true);
      addToast({ title: 'Password Updated', message: 'Your password has been successfully reset.', type: 'success' });
    } catch {
      addToast({ title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stitch-page bg-background min-h-screen flex flex-col font-body-md text-on-background">
      <div>
        <main className="flex-grow flex items-center justify-center p-gutter">
          <div className="w-full max-w-md">
            {/* Logo Header */}
            <div className="text-center mb-stack-lg">
              <h1 className="font-h1 text-h1 text-primary">Smart Job Portal</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">Reset your password to regain access</p>
            </div>

            {/* Reset Password Card - only show if not success */}
            {!success && (
              <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-stack-lg">
                <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
                  {errors.form && <p className="font-body-md text-body-md text-error text-sm">{errors.form}</p>}
                  {/* New Password Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="new-password">New Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                      <input
                        className={`w-full pl-10 pr-4 py-2 bg-surface-container-low border ${errors.password ? 'border-error' : 'border-outline-variant'} rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors`}
                        id="new-password" name="password" placeholder="Enter new password" type="password"
                        value={form.password} onChange={handleChange}
                      />
                    </div>
                    {errors.password && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.password}</p>}
                  </div>
                  {/* Password Strength Indicator */}
                  {form.password.length > 0 && (
                    <div className="flex flex-col gap-unit">
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Password Strength</span>
                        <span className={`font-label-sm text-label-sm ${strength.level <= 1 ? 'text-error' : strength.level <= 2 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>{strength.label}</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-surface-variant'}`} />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {[
                          { key: 'length', label: '8+ characters' },
                          { key: 'uppercase', label: 'Uppercase' },
                          { key: 'number', label: 'Number' },
                          { key: 'special', label: 'Symbol' },
                        ].map((c) => (
                          <span key={c.key} className={`font-label-sm text-[11px] ${strength.criteria[c.key] ? 'text-[#22C55E]' : 'text-outline'}`}>
                            {strength.criteria[c.key] ? '✓' : '○'} {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Confirm Password Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit" htmlFor="confirm-password">Confirm New Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock_reset</span>
                      <input
                        className={`w-full pl-10 pr-4 py-2 bg-surface-container-low border ${errors.confirmPassword ? 'border-error' : 'border-outline-variant'} rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors`}
                        id="confirm-password" name="confirmPassword" placeholder="Confirm new password" type="password"
                        value={form.confirmPassword} onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-unit font-body-md text-body-md text-error text-sm">{errors.confirmPassword}</p>}
                    {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                      <p className="mt-unit font-body-md text-body-md text-[#22C55E] text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span> Passwords match
                      </p>
                    )}
                  </div>
                  {/* Submit */}
                  <button
                    className={`w-full bg-secondary text-on-secondary font-h3 text-h3 py-3 rounded-lg hover:bg-on-secondary-fixed-variant transition-colors mt-stack-sm flex justify-center items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    type="submit" disabled={loading}
                  >
                    {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                    {loading ? 'Resetting...' : 'Reset Password'}
                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                </form>
                <div className="text-center mt-stack-lg">
                  <Link className="font-body-md text-body-md text-secondary hover:underline inline-flex items-center gap-1" to={ROUTES.LOGIN}>
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back to Login
                  </Link>
                </div>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-stack-lg text-center">
                <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-stack-md">
                  <span className="material-symbols-outlined text-[#22C55E] text-[32px]">check_circle</span>
                </div>
                <h2 className="font-h2 text-h2 text-primary mb-stack-sm">Password Reset Successful</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Your password has been successfully updated. You can now use your new password to log in.</p>
                <Link className="inline-block w-full bg-secondary text-on-secondary font-h3 text-h3 py-3 rounded-lg hover:bg-on-secondary-fixed-variant transition-colors" to={ROUTES.LOGIN}>
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </main>
        {/* Footer */}
        <footer className="w-full py-stack-lg px-margin-desktop flex justify-between items-center max-w-container-max-width mx-auto border-t border-outline-variant bg-surface-container-highest dark:bg-surface-dim">
          <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">Smart Job Portal</div>
          <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-outline-variant text-center flex-grow mx-stack-lg">© 2024 Smart Job Portal. Intelligence in Recruitment.</div>
          <div className="flex gap-stack-md">
            <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.PRIVACY}>Privacy</Link>
            <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.TERMS}>Terms</Link>
            <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.HOME}>API</Link>
            <Link className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary hover:underline decoration-secondary transition-all" to={ROUTES.CONTACT}>Support</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

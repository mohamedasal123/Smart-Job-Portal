import { useState } from 'react';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import { useToast } from '../../components/useToast';
import { useAuth } from '../../context/useAuth';

const STORAGE_KEY = 'jobSeekerSettings';

const readStoredSettings = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export default function JobSeekerSettingsPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const stored = readStoredSettings();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState(stored.email || user?.email || 'jobseeker@test.com');
  const [notifications, setNotifications] = useState(stored.notifications || {
    jobAlerts: true,
    applicationUpdates: true,
    messages: true,
    marketing: false
  });
  const [privacy, setPrivacy] = useState(stored.privacy || {
    profileVisible: true,
    showSalary: false
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    // Password validation
    if (newPassword && newPassword.length < 8) {
      addToast({ title: 'Validation Error', message: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      addToast({ title: 'Validation Error', message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, notifications, privacy }));
      addToast({ title: 'Settings saved', message: 'Your preferences have been updated successfully.', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      addToast({ title: 'Error', message: 'Failed to save settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: 'manage_accounts' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'security' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter">
      <SeekerPageHeader 
        title="Settings" 
        subtitle="Manage your account preferences, notifications, and privacy." 
        icon="settings"
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-outline-variant bg-surface p-4">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-1">Account Information</h3>
                  <p className="text-body-md text-on-surface-variant mb-4">Update your basic account credentials.</p>
                  <div className="rounded-lg border border-secondary/30 bg-secondary-container/10 p-stack-sm text-body-sm text-on-surface-variant">
                    Demo mode: preferences are saved locally in this browser. Account email and password changes require backend account settings endpoints.
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-label-md font-bold text-on-surface mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-label-md font-bold text-on-surface mb-2">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                    <p className="text-[12px] text-on-surface-variant mt-1">Leave blank to keep your current password.</p>
                  </div>
                  {newPassword && (
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-surface border rounded-lg px-4 py-2 focus:ring-1 outline-none transition-colors ${confirmPassword && confirmPassword !== newPassword ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-secondary focus:ring-secondary'}`}
                      />
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-[12px] text-error mt-1">Passwords do not match.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-outline-variant">
                  <h4 className="font-bold text-error mb-2">Danger Zone</h4>
                  <p className="text-body-md text-on-surface-variant mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-error-container text-on-error-container hover:bg-error hover:text-on-error rounded-lg transition-colors font-label-md"
                    onClick={() => addToast({ title: 'Disabled in demo', message: 'Account deletion is intentionally disabled for local demo users.', type: 'info' })}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-1">Notification Preferences</h3>
                  <p className="text-body-md text-on-surface-variant mb-4">Choose what we should notify you about.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-lowest transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifications.jobAlerts}
                      onChange={(e) => setNotifications({...notifications, jobAlerts: e.target.checked})}
                      className="mt-1 w-5 h-5 text-secondary rounded border-outline-variant focus:ring-secondary"
                    />
                    <div>
                      <span className="block font-bold text-on-surface">Job Alerts</span>
                      <span className="block text-sm text-on-surface-variant mt-1">Get notified when new jobs match your skills.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-lowest transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifications.applicationUpdates}
                      onChange={(e) => setNotifications({...notifications, applicationUpdates: e.target.checked})}
                      className="mt-1 w-5 h-5 text-secondary rounded border-outline-variant focus:ring-secondary"
                    />
                    <div>
                      <span className="block font-bold text-on-surface">Application Updates</span>
                      <span className="block text-sm text-on-surface-variant mt-1">Receive emails when an employer updates your application status.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-lowest transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifications.messages}
                      onChange={(e) => setNotifications({...notifications, messages: e.target.checked})}
                      className="mt-1 w-5 h-5 text-secondary rounded border-outline-variant focus:ring-secondary"
                    />
                    <div>
                      <span className="block font-bold text-on-surface">Messages</span>
                      <span className="block text-sm text-on-surface-variant mt-1">Get notified when you receive a new message.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-1">Privacy & Security</h3>
                  <p className="text-body-md text-on-surface-variant mb-4">Control who can see your information.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-lowest transition-colors">
                    <input 
                      type="checkbox" 
                      checked={privacy.profileVisible}
                      onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
                      className="mt-1 w-5 h-5 text-secondary rounded border-outline-variant focus:ring-secondary"
                    />
                    <div>
                      <span className="block font-bold text-on-surface">Profile Visibility</span>
                      <span className="block text-sm text-on-surface-variant mt-1">Allow recruiters to find your profile when searching for candidates.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-lowest transition-colors">
                    <input 
                      type="checkbox" 
                      checked={privacy.showSalary}
                      onChange={(e) => setPrivacy({...privacy, showSalary: e.target.checked})}
                      className="mt-1 w-5 h-5 text-secondary rounded border-outline-variant focus:ring-secondary"
                    />
                    <div>
                      <span className="block font-bold text-on-surface">Show Expected Salary</span>
                      <span className="block text-sm text-on-surface-variant mt-1">Display your expected salary range to employers.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-outline-variant">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-secondary text-on-secondary font-label-md px-6 py-2.5 rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving...</>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

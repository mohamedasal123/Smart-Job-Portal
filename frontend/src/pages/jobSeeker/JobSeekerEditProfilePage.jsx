import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import { useToast } from '../../components/useToast';
import { ROUTES } from '../../utils/constants';

export default function JobSeekerEditProfilePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', title: '', location: '',
    bio: '', expectedSalary: '', portfolio: '', linkedin: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const p = await getProfile();
        setFormData({
          firstName: p.firstName || '', lastName: p.lastName || '',
          title: p.title || '', location: p.location || '',
          bio: p.bio || '', expectedSalary: p.expectedSalary || '',
          portfolio: p.portfolio || '', linkedin: p.linkedin || '',
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      addToast({ title: 'Validation Error', message: 'First and last name are required.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      await updateProfile(formData);
      addToast({ title: 'Profile Updated', message: 'Your profile has been saved successfully.', type: 'success' });
      navigate(ROUTES.SEEKER_PROFILE);
    } catch { addToast({ title: 'Error', message: 'Failed to save.', type: 'error' }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop flex justify-center items-center h-full"><span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span></div>;

  const field = (label, name, type = 'text', extra = {}) => (
    <div className={extra.span2 ? 'md:col-span-2' : ''}>
      <label className="block text-label-md font-bold text-on-surface mb-2">{label}</label>
      {extra.textarea ? (
        <textarea name={name} value={formData[name]} onChange={handleChange} rows="4"
          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors resize-y"
          placeholder={extra.placeholder || ''} />
      ) : (
        <input type={type} name={name} value={formData[name]} onChange={handleChange}
          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
          placeholder={extra.placeholder || ''} required={extra.required} />
      )}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter pb-12">
      <SeekerPageHeader title="Edit Profile" subtitle="Update your personal details and professional summary." icon="edit_document" />
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <h3 className="font-h3 text-h3 text-primary">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {field('First Name', 'firstName', 'text', { required: true })}
              {field('Last Name', 'lastName', 'text', { required: true })}
              {field('Professional Headline', 'title', 'text', { span2: true, required: true, placeholder: 'e.g., Senior Developer' })}
              {field('Professional Summary', 'bio', 'text', { span2: true, textarea: true, placeholder: 'Tell recruiters about yourself...' })}
            </div>
          </div>
          <div className="space-y-6 pt-6 border-t border-outline-variant">
            <h3 className="font-h3 text-h3 text-primary">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {field('Location', 'location', 'text', { placeholder: 'City, Country' })}
              {field('Expected Salary', 'expectedSalary', 'text', { placeholder: 'e.g., $30k - $45k' })}
              {field('Portfolio URL', 'portfolio', 'url', { placeholder: 'https://' })}
              {field('LinkedIn URL', 'linkedin', 'url', { placeholder: 'https://linkedin.com/in/...' })}
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant flex justify-end gap-4">
            <button type="button" onClick={() => navigate(ROUTES.SEEKER_PROFILE)}
              className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="bg-secondary text-on-secondary px-8 py-2.5 rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50 font-label-md flex items-center gap-2 shadow-sm">
              {saving ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving...</> : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

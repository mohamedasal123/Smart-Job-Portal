import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import { ROUTES } from '../../utils/constants';

export default function JobSeekerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="p-margin-desktop flex justify-center items-center h-full">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="p-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter pb-12">
      <div className="flex justify-between items-start">
        <SeekerPageHeader 
          title="My Profile" 
          subtitle="View and manage your public profile." 
          icon="person"
        />
        <Link 
          to={ROUTES.SEEKER_PROFILE_EDIT} 
          className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-label-md hover:bg-secondary-container transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit Profile
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 border-b border-outline-variant flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Profile avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-sm"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-4xl font-bold border-4 border-surface shadow-sm">
              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
            </div>
          )}
          <div className="flex-1 mt-2 md:mt-0">
            <h2 className="font-h1 text-h1 text-primary">{profile.firstName} {profile.lastName}</h2>
            <p className="font-h3 text-h3 text-secondary mt-1">{profile.title}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-on-surface-variant font-label-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {profile.location}
              </span>
              {profile.expectedSalary && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  {profile.expectedSalary}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-8 border-b border-outline-variant">
          <h3 className="font-h3 text-h3 text-primary mb-4">About Me</h3>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Contact & Links */}
        <div className="p-8">
          <h3 className="font-h3 text-h3 text-primary mb-6">Contact & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">mail</span>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant mb-1">Email</p>
                <p className="text-body-md font-medium text-on-surface">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">phone</span>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant mb-1">Phone</p>
                <p className="text-body-md font-medium text-on-surface">{profile.phone}</p>
              </div>
            </div>
            {profile.portfolio && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">language</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant mb-1">Portfolio</p>
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-body-md font-medium">
                    {profile.portfolio.replace('https://', '')}
                  </a>
                </div>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant mb-1">LinkedIn</p>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-body-md font-medium">
                    {profile.linkedin.replace('https://', '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

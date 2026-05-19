import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { getSeekerDashboardData } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import SeekerStatsCard from '../../components/jobSeeker/SeekerStatsCard';
import SeekerJobCard from '../../components/jobSeeker/SeekerJobCard';
import SeekerApplicationCard from '../../components/jobSeeker/SeekerApplicationCard';

export default function JobSeekerDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getSeekerDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-margin-desktop flex justify-center items-center h-full">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="p-margin-desktop space-y-gutter pb-stack-lg max-w-7xl mx-auto">
      <SeekerPageHeader 
        title="Welcome back!" 
        subtitle={`Your profile is ${data.profileCompletion}% complete. Let's find your next opportunity.`} 
        icon="waving_hand"
      />

      {/* CV Upload / Status Card */}
      <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-sm border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4">
        {data.profile.cvFile ? (
          <>
            <div className="flex items-center gap-4">
              <div className="bg-secondary-container/20 p-3 rounded-full text-secondary">
                <span className="material-symbols-outlined text-[32px]">task</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-primary mb-1">CV Uploaded Successfully</h3>
                <p className="font-body-sm text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">description</span> {data.profile.cvFile.name} &bull; Uploaded on {new Date(data.profile.cvFile.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-success-container/30 text-success px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Parsed</span>
                  <span className="text-on-surface-variant text-xs">Extracted {data.skillsCount} skills</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/seeker/cv-upload" className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-colors">
                Re-upload CV
              </Link>
              <Link to="/seeker/cv-review" className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary-container transition-colors shadow-sm">
                Review Extracted Data
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="bg-error-container/20 p-3 rounded-full text-error">
                <span className="material-symbols-outlined text-[32px]">upload_file</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-primary mb-1">Upload your CV</h3>
                <p className="font-body-sm text-on-surface-variant">
                  Upload your CV to unlock AI matching and personalized job recommendations.
                </p>
              </div>
            </div>
            <div>
              <Link to="/seeker/cv-upload" className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary-container transition-colors shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">upload</span> Upload CV
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <SeekerStatsCard
          title="Applied"
          value={data.stats.totalApplications}
          icon="send"
          onClick={() => navigate(ROUTES.SEEKER_APPLICATIONS)}
        />
        <SeekerStatsCard
          title="Under Review"
          value={data.stats.underReviewCount}
          icon="visibility"
          onClick={() => navigate(ROUTES.SEEKER_APPLICATIONS)}
        />
        <SeekerStatsCard
          title="Shortlisted"
          value={data.stats.shortlistedCount}
          icon="stars"
          onClick={() => navigate(ROUTES.SEEKER_APPLICATIONS)}
        />
        <SeekerStatsCard
          title="Profile Skills"
          value={data.skillsCount}
          icon="psychology"
          onClick={() => navigate(ROUTES.SEEKER_SKILLS)}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section className="lg:col-span-2 space-y-stack-md">
          <div className="flex justify-between items-center">
            <h2 className="font-h2 text-h2 text-primary">Top Matches for You</h2>
            <Link className="font-label-sm text-label-sm text-secondary hover:underline" to={ROUTES.SEEKER_RECOMMENDED_JOBS}>
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {data.topRecommendedJobs.map((rec) => (
              <SeekerJobCard key={rec.jobId} job={{...rec.job, recommendation: rec}} />
            ))}
            {data.topRecommendedJobs.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed">
                <p className="text-on-surface-variant mb-4">No recommended jobs found. Try adding more skills.</p>
                <Link to={ROUTES.SEEKER_SKILLS} className="text-secondary hover:underline">Update Skills</Link>
              </div>
            )}
          </div>
        </section>
        
        <section className="space-y-stack-md">
          <div className="flex justify-between items-center">
            <h2 className="font-h2 text-h2 text-primary">Recent Applications</h2>
            <Link className="font-label-sm text-label-sm text-secondary hover:underline" to={ROUTES.SEEKER_APPLICATIONS}>
              View all
            </Link>
          </div>
          
          <div className="flex flex-col gap-gutter">
            {data.recentApplications.map((app) => (
              <SeekerApplicationCard key={app.id} application={app} />
            ))}
            {data.recentApplications.length === 0 && (
              <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed">
                <p className="text-on-surface-variant mb-4">You haven't applied to any jobs yet.</p>
                <Link to={ROUTES.SEEKER_JOBS} className="text-secondary hover:underline">Browse Jobs</Link>
              </div>
            )}
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mt-stack-lg">
            <h3 className="font-h3 text-h3 text-primary mb-stack-md">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/seeker/profile" className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline-variant hover:border-secondary hover:bg-surface-container-low transition-all group">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary mb-2">person</span>
                <span className="font-label-sm text-label-sm text-primary text-center">View Profile</span>
              </Link>
              <Link to="/seeker/profile/edit" className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline-variant hover:border-secondary hover:bg-surface-container-low transition-all group">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary mb-2">edit_document</span>
                <span className="font-label-sm text-label-sm text-primary text-center">Edit Profile</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

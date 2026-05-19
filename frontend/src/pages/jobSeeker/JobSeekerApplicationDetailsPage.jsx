import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getApplicationById } from '../../services/jobSeekerDataService';
import { ROUTES } from '../../utils/constants';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import SeekerStatusBadge from '../../components/jobSeeker/SeekerStatusBadge';
import MatchScoreBadge from '../../components/jobSeeker/MatchScoreBadge';

export default function JobSeekerApplicationDetailsPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const result = await getApplicationById(applicationId);
        if (!result) {
          navigate(ROUTES.SEEKER_APPLICATIONS);
          return;
        }
        setApplication(result);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [applicationId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-12">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const { job } = application;

  return (
    <div className="p-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter">
      <div>
        <Link to={ROUTES.SEEKER_APPLICATIONS} className="inline-flex items-center text-on-surface-variant hover:text-secondary mb-4 transition-colors font-label-md">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Applications
        </Link>
        <SeekerPageHeader 
          title="Application Details" 
          subtitle="Review the status and details of your application." 
          icon="assignment"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8 pb-8 border-b border-outline-variant">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-2xl overflow-hidden">
              {job?.companyLogo ? (
                <img src={job.companyLogo || undefined} alt={job?.company} className="w-full h-full object-cover" />
              ) : (
                job?.company?.charAt(0) || 'C'
              )}
            </div>
            <div>
              <h1 className="font-h2 text-h2 text-primary mb-1">{job?.title || 'Unknown Role'}</h1>
              <p className="font-body-lg text-secondary mb-2">{job?.company || 'Unknown Company'}</p>
              <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {job?.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {job?.type || 'Full-time'}
                </span>
                {job?.salaryMax && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    ${job.salaryMin}k - ${job.salaryMax}k
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SeekerStatusBadge status={application.status} />
            <span className="text-sm text-on-surface-variant">
              Applied {new Date(application.appliedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-3">Application Status</h3>
              <div className="bg-surface p-4 rounded-lg border border-outline-variant">
                {application.status === 'under_review' && (
                  <p className="text-body-md text-on-surface-variant">
                    Your application is currently being reviewed by the hiring team. We'll notify you when there's an update.
                  </p>
                )}
                {application.status === 'shortlisted' && (
                  <p className="text-body-md text-on-surface-variant">
                    Congratulations! You've been shortlisted for this role. The company will likely contact you soon for the next steps.
                  </p>
                )}
                {application.status === 'rejected' && (
                  <p className="text-body-md text-on-surface-variant">
                    Unfortunately, the company has decided to move forward with other candidates at this time.
                  </p>
                )}
                {application.status === 'hired' && (
                  <p className="text-body-md text-on-surface-variant text-green-600">
                    Congratulations! You've been hired for this position.
                  </p>
                )}
                {!['under_review', 'shortlisted', 'rejected', 'hired'].includes(application.status) && (
                  <p className="text-body-md text-on-surface-variant">
                    Your application has been received.
                  </p>
                )}
              </div>
            </div>

            {application.matchScore && (
              <div>
                <h3 className="font-h3 text-h3 text-primary mb-3">Smart Match Analysis</h3>
                <div className="bg-secondary bg-opacity-5 p-6 rounded-lg border border-secondary border-opacity-20 flex items-center gap-6">
                  <MatchScoreBadge score={application.matchScore} size="lg" variant="ring" />
                  <div className="flex-1">
                    <p className="font-bold text-primary mb-1">{application.matchScore}% Match Score</p>
                    <p className="text-sm text-on-surface-variant">
                      This score reflects how well your skills and experience align with the requirements of this role.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job?.requiredSkills?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-surface border border-outline-variant rounded-full text-sm text-on-surface-variant">
                    {skill}
                  </span>
                )) || <span className="text-on-surface-variant text-sm">Not specified</span>}
              </div>
            </div>

            <div>
              <h3 className="font-h3 text-h3 text-primary mb-3">Actions</h3>
              <div className="space-y-3">
                <Link to={`/seeker/jobs/${job?.id}`} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant hover:border-secondary hover:text-secondary rounded-lg transition-colors font-label-md text-primary bg-surface">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  View Original Job Post
                </Link>
                {application.status === 'rejected' && (
                  <Link to={ROUTES.SEEKER_REJECTION_FEEDBACK} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg transition-colors font-label-md">
                    <span className="material-symbols-outlined text-[18px]">feedback</span>
                    View Rejection Feedback
                  </Link>
                )}
                {application.status === 'shortlisted' && (
                  <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg transition-colors font-label-md">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Schedule Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

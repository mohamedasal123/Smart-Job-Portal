import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import PublicNavBar from '../../components/PublicNavBar';
import PublicFooter from '../../components/PublicFooter';

export default function TermsOfServicePage() {
  return (
    <div className={"stitch-page bg-background text-on-surface font-body-lg text-body-lg antialiased flex flex-col min-h-screen"}>
      <div>
        <PublicNavBar />
        <main className="max-w-4xl mx-auto px-gutter py-margin-desktop bg-surface-container-lowest mt-stack-lg mb-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <header className="mb-margin-desktop border-b border-outline-variant pb-stack-lg">
            <h1 className="font-h1 text-h1 text-primary mb-stack-sm">Terms of Service</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Last Updated: October 2023</p>
          </header>
          <section className="space-y-stack-lg font-body-lg text-body-lg text-on-surface-variant">
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">1. Account Usage</h2>
              <p className="mb-stack-sm">By accessing or using Smart Job Portal, you agree to be bound by these Terms. You are
                responsible for safeguarding the password that you use to access the Service and for any activities
                or actions under your password, whether your password is with our Service or a third-party service.
              </p>
              <p>You agree not to disclose your password to any third party. You must notify us immediately upon
                becoming aware of any breach of security or unauthorized use of your account.</p>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">2. Job Seeker Responsibilities</h2>
              <p className="mb-stack-sm">As a job seeker, you agree to provide accurate, current, and complete information
                during the registration process and to update such information to keep it accurate, current, and
                complete.</p>
              <ul className="list-disc pl-gutter space-y-unit mt-stack-sm text-on-surface-variant">
                <li>You will not misrepresent your identity or qualifications.</li>
                <li>You will use the AI Matching features responsibly and not attempt to manipulate the scoring
                  algorithms.</li>
                <li>You acknowledge that Smart Job Portal does not guarantee job placement.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">3. Company Responsibilities</h2>
              <p className="mb-stack-sm">Employers and recruiters using the platform must ensure that all job postings
                comply with applicable local, state, national, and international laws, including labor and
                employment laws regarding non-discrimination.</p>
              <p>Companies are solely responsible for their postings on the platform and any consequences that arise
                from them. The platform reserves the right to remove any posting that violates these terms without
                prior notice.</p>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">4. Job Posting Rules</h2>
              <p className="mb-stack-sm">To maintain the quality of our data-driven matching ecosystem, all job postings
                must:</p>
              <ul className="list-disc pl-gutter space-y-unit mt-stack-sm text-on-surface-variant">
                <li>Clearly describe the role, responsibilities, and required skills.</li>
                <li>Not contain hidden fees, pyramid schemes, or inappropriate content.</li>
                <li>Accurately reflect the compensation if provided.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">5. Platform Limitations</h2>
              <p className="mb-stack-sm">Smart Job Portal utilizes advanced machine learning algorithms to facilitate talent
                matching. However, we do not warrant that the Service will function uninterrupted, secure, or
                available at any particular time or location.</p>
              <p>We are not responsible for the actions, content, information, or data of third parties, and you
                release us, our directors, officers, employees, and agents from any claims and damages, known and
                unknown, arising out of or in any way connected with any claim you have against any such third
                parties.</p>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary mb-stack-md">6. Termination Policy</h2>
              <p className="mb-stack-sm">We may terminate or suspend your account immediately, without prior notice or
                liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
                account, you may simply discontinue using the Service.</p>
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
      
    </div>
  );
}

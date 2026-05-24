import PublicNavBar from '../../components/PublicNavBar';
import PublicFooter from '../../components/PublicFooter';

export default function AboutPage() {
  return (
    <div className={"stitch-page bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased"}>
      <div>
        <PublicNavBar />
        {/* Main Content Canvas */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-24 px-margin-desktop bg-surface-container-lowest max-w-container-max-width mx-auto text-center">
            <h1 className="font-h1 text-h1 text-primary-container max-w-4xl mx-auto mb-stack-lg">Our Mission: Bridging the
              Talent Gap with Intelligence</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">We believe the future
              of work is built on human potential. By leveraging advanced AI, we remove bias and friction, creating a
              recruitment experience that is not only faster and more precise, but profoundly more human.</p>
            <div className="w-full max-w-5xl mx-auto h-96 bg-surface-container-high rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" data-alt="A diverse team of professionals collaborating enthusiastically around a sleek, modern glass conference table in a bright, sunlit corporate office. The environment is designed with a modern SaaS aesthetic, featuring clean whites, deep navy blue accents, and a sense of dynamic, intelligent energy. Sunlight streams through floor-to-ceiling windows, highlighting digital analytics on a distant screen." style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOQ927tvzzSUoaZMLL3GbOrCQeVueGan8RxYqpW36EuJTFu9GrDpKHsZ-8HHbEF4DB9p3Y3tN70Q_9cYrLuRMjzrN2FBIBUwi1teX9HsDjKB_GOHz9fCHDaGV_z9oaMpKOdSuCByO3qpo6NVMKrYhed00w_PnxgdxMMiWjosbOfTf8wo0Crx4lqx-Dhx-_E9NE2Ya7LZEph9e-Oe0HI_DHcJJERk5s-FijByum-V-7GWRbgsKYZuUSu9hwJIOY-DITRxyAizwEnRUM")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            </div>
          </section>
          {/* Platform Vision Statement */}
          <section className="py-20 px-margin-desktop bg-surface-container-low border-y border-outline-variant/20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="material-symbols-outlined text-secondary text-5xl mb-stack-md block">psychology</span>
              <h2 className="font-h2 text-h2 text-primary-container mb-stack-md">Redefining the Future of Work</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Smart Job Portal isn't just a job board; it's a
                talent intelligence platform. We envision a world where every individual is perfectly matched to a
                role where they can thrive, and every company builds teams that drive transformative innovation.</p>
            </div>
          </section>
          {/* AI Feature Block (Bento Grid) */}
          <section className="py-24 px-margin-desktop max-w-container-max-width mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-h1 text-h1 text-primary-container mb-stack-sm">The Science of Matching</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Why we built an AI-first
                approach.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-secondary">balance</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary-container mb-stack-sm">Radical Fairness</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Our algorithms are trained to ignore
                  demographic identifiers, focusing purely on skills, potential, and cultural alignment to
                  eliminate unconscious bias.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-secondary">my_location</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary-container mb-stack-sm">Surgical Precision</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">By analyzing millions of successful
                  career trajectories, our AI identifies subtle skill overlaps that traditional keyword matching
                  misses entirely.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary-container mb-stack-sm">Accelerated Velocity</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Reduce time-to-hire from weeks to days.
                  Instant intelligent shortlisting means hiring managers spend time interviewing, not filtering
                  resumes.</p>
              </div>
            </div>
          </section>
          {/* Dual Audiences (Asymmetric Layout) */}
          <section className="py-24 px-margin-desktop bg-surface-container-low">
            <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-stack-md">
                <h2 className="font-h1 text-h1 text-primary-container">For Job Seekers: Find your potential.</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Stop throwing resumes into the void.
                  Smart Job Portal acts as your personal career agent, matching your unique skills to roles you didn't
                  even know existed, with full transparency on salary and expectations.</p>
                <ul className="space-y-stack-sm font-body-md text-body-md text-on-surface-variant mt-stack-lg">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Automated
                    profile parsing</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Transparent
                    match scoring</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    Privacy-first data control</li>
                </ul>
              </div>
              <div className="flex-1 w-full h-80 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/20 p-stack-lg flex flex-col justify-center items-start" style={{backgroundImage: 'linear-gradient(rgb(var(--surface-container-lowest) / 0.9), rgb(var(--surface-container-lowest) / 0.9)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCst28oDEQVsHVbI9qKfCElCuJIomT-5LUyPkQ2PFDpJAfX52BUU2eb1lIjKUt-N_orDC7BmqJjNda4dzyVD8EWHCa-d4uRYg3cIC70M6bBSjQ4mP70I3xbkZKDHy2Rhon1WUckYBTc9RwhD4ISdDnRyjPjad8xKjlVLRIgZdyDOrrAtqWNEq7PEo2G0axopF-BB_OFkGK45qAvam-8kVtPSsP8gHndM2ziE7smS3YGigNLuAKDIcOzI6HV7B7zvIr9Gu79jt_NtDZm")', backgroundSize: 'cover'}}>
                <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 md:p-6 rounded-lg shadow-md w-full sm:w-3/4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold shrink-0">
                        JD</div>
                      <div>
                        <h4 className="font-h3 text-h3 text-primary">Senior Developer</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">TechFlow Inc.</p>
                      </div>
                    </div>
                    <div className="sm:ml-auto text-left sm:text-center mt-2 sm:mt-0">
                      <span className="font-ai-score text-ai-score text-[#22C55E]">94%</span>
                      <p className="font-label-sm text-label-sm text-[#22C55E]">Match</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row-reverse gap-16 items-center mt-24">
              <div className="flex-1 space-y-stack-md">
                <h2 className="font-h1 text-h1 text-primary-container">For Companies: Build your future team.</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Move beyond the spray-and-pray
                  approach. Access a pre-vetted, highly targeted talent pool. Our AI understands your culture and
                  tech stack, delivering candidates ready to make an impact on day one.</p>
                <ul className="space-y-stack-sm font-body-md text-body-md text-on-surface-variant mt-stack-lg">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Predictive
                    retention analytics</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Seamless
                    ATS integration</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Diversity
                    metrics dashboard</li>
                </ul>
              </div>
              <div className="flex-1 w-full h-80 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/20 p-stack-lg flex flex-col justify-center items-start" style={{backgroundImage: 'linear-gradient(rgb(var(--surface-container-lowest) / 0.9), rgb(var(--surface-container-lowest) / 0.9)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLIel2zypAm28S6x61I-4AtMY-H4CVcaiKOQEpDrTINhfthThYq2DrUo4YKqxOLremA-Ev3FgQexq7cae7S1OdTpYADdB9mEM28V5fleR2HItGN3WTe_VDGA0jzS6SrvTS-bPOkbyTWMCY-L0QF_HlcWivdq_xBnVZyWZlQeHyvlHCbr81XfONO10zIp11nVUwuVBjoDPGlo1_fKAgqIIE_FUpUiJvDo4pPQ41h8JyQGFEaSOhIupBjhZDKK8v2ZS-Cr2kYfcrkGKY")', backgroundSize: 'cover'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 rounded-lg shadow-sm border border-outline-variant/10 text-center">
                    <span className="material-symbols-outlined text-secondary mb-2 text-3xl">trending_up</span>
                    <h4 className="font-h3 text-h3 text-primary">3x</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Faster Time-to-Hire
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 rounded-lg shadow-sm border border-outline-variant/10 text-center">
                    <span className="material-symbols-outlined text-secondary mb-2 text-3xl">group_add</span>
                    <h4 className="font-h3 text-h3 text-primary">85%</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Offer Acceptance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
      
    </div>
  );
}

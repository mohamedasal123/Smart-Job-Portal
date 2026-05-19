import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';

export default function JobSeekerMessagesPage() {
  return (
    <div className="p-margin-desktop max-w-7xl mx-auto flex flex-col h-[calc(100vh-80px)] space-y-gutter">
      <SeekerPageHeader title="Messages" subtitle="Communicate directly with recruiters and hiring managers." icon="chat" />

      <div className="bg-surface-container-low p-stack-lg rounded-xl border border-secondary text-center mb-stack-lg">
        <h3 className="font-h2 text-h2 text-secondary">Messaging feature coming soon</h3>
        <p className="text-on-surface-variant mt-unit">We're working hard to bring real-time messaging right into your dashboard.</p>
      </div>
    </div>
  );
}

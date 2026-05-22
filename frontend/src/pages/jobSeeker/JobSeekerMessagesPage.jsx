import { useMemo, useState } from 'react';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';

const demoConversations = [
  {
    id: 'conv-1',
    company: 'Test Company',
    role: 'Frontend Developer',
    contact: 'Sarah Wilson',
    time: '10:30 AM',
    unread: true,
    status: 'Interview request',
    messages: [
      { from: 'Sarah Wilson', text: 'Thanks for applying. Your CV looks aligned with the Frontend Developer role.' },
      { from: 'Sarah Wilson', text: 'Are you available tomorrow for a short screening call?' },
    ],
  },
  {
    id: 'conv-2',
    company: 'Remote Labs',
    role: 'React Engineer',
    contact: 'Omar Khaled',
    time: 'Yesterday',
    unread: false,
    status: 'Application follow-up',
    messages: [
      { from: 'Omar Khaled', text: 'We reviewed your application and will share the next step soon.' },
      { from: 'You', text: 'Thank you. I am ready whenever the team is available.' },
    ],
  },
];

export default function JobSeekerMessagesPage() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(demoConversations[0].id);

  const conversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return demoConversations;
    return demoConversations.filter((item) =>
      [item.company, item.role, item.contact, item.status].some((value) => value.toLowerCase().includes(q))
    );
  }, [query]);

  const active = conversations.find((item) => item.id === activeId) || conversations[0];

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-7xl mx-auto flex flex-col min-h-full space-y-gutter">
      <SeekerPageHeader title="Messages" subtitle="Communicate directly with recruiters and hiring managers." icon="chat" />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-gutter">
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
          <div className="p-stack-md border-b border-outline-variant">
            <label className="relative block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pl-10 pr-3 text-on-surface outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations"
                value={query}
              />
            </label>
          </div>

          <div className="divide-y divide-outline-variant">
            {conversations.map((item) => (
              <button
                className={`w-full p-stack-md text-left transition-colors ${active?.id === item.id ? 'bg-secondary-container/15' : 'hover:bg-surface-container-low'}`}
                key={item.id}
                onClick={() => setActiveId(item.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-stack-sm">
                  <div>
                    <p className="font-h3 text-h3 text-primary">{item.company}</p>
                    <p className="text-body-sm text-on-surface-variant">{item.contact} - {item.role}</p>
                  </div>
                  {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />}
                </div>
                <p className="mt-unit text-body-sm text-secondary">{item.status}</p>
                <p className="mt-unit text-body-sm text-on-surface-variant">{item.time}</p>
              </button>
            ))}
            {!conversations.length && (
              <div className="p-stack-lg text-center text-on-surface-variant">No conversations match your search.</div>
            )}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient min-h-[420px] flex flex-col overflow-hidden">
          {active ? (
            <>
              <div className="border-b border-outline-variant p-stack-lg">
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">{active.status}</p>
                <h2 className="font-h2 text-h2 text-primary mt-unit">{active.company}</h2>
                <p className="text-on-surface-variant">{active.contact} about {active.role}</p>
              </div>
              <div className="flex-1 space-y-stack-md p-stack-lg bg-surface-container-low">
                {active.messages.map((message, index) => {
                  const mine = message.from === 'You';
                  return (
                    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`} key={`${active.id}-${index}`}>
                      <div className={`max-w-[75%] rounded-xl px-stack-md py-stack-sm ${mine ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface'}`}>
                        <p className="font-label-sm text-label-sm mb-unit opacity-80">{message.from}</p>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-outline-variant p-stack-md bg-surface-container-lowest">
                <div className="flex gap-stack-sm">
                  <input className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-stack-md py-stack-sm text-on-surface outline-none" placeholder="Message replies are demo-only" disabled />
                  <button className="rounded-lg bg-secondary px-stack-md py-stack-sm font-label-md text-on-secondary opacity-70" disabled>Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-stack-lg text-on-surface-variant">Select a conversation.</div>
          )}
        </section>
      </div>
    </div>
  );
}

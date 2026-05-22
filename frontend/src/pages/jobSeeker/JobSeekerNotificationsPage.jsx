import { useState, useEffect } from 'react';
import { api, getListItems } from '../../api/axios';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';

export default function JobSeekerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let cancelled = false;
    api.get('/notifications')
      .then(res => {
        if (!cancelled) setNotifications(getListItems(res));
      })
      .catch(err => {
        if (!cancelled) console.error('Error fetching notifications:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id) => {
    try {
      const target = notifications.find(n => n.id === id);
      if (target && !target.read_at) {
        await api.patch(`/notifications/${id}/read`);
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'application_update': return 'text-success bg-success-container';
      case 'application_status_updated': return 'text-success bg-success-container';
      case 'demo_application_update': return 'text-success bg-success-container';
      case 'job_alert': return 'text-secondary bg-secondary-container';
      case 'demo_job_alert': return 'text-secondary bg-secondary-container';
      case 'message': return 'text-primary bg-primary-container';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop flex justify-center items-center h-full" role="status" aria-live="polite">
        <span className="material-symbols-outlined animate-spin text-[48px] text-secondary" aria-hidden="true">progress_activity</span>
        <span className="sr-only">Loading your notifications…</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SeekerPageHeader title="Notifications" subtitle="Stay updated on your job search progress." icon="notifications" />
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-secondary hover:text-primary transition-colors font-label-md bg-surface-container-low px-4 py-2 rounded-lg">
            Mark all as read
          </button>
        )}
      </div>

      <div
        className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant"
        aria-live="polite"
        aria-label={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
      >
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4">notifications_off</span>
            <p className="font-body-lg">You have no notifications right now.</p>
          </div>
        ) : (
          <>
            {notifications.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(n => {
              const title = n.title || n.data?.title || (n.data?.job_title ? `Application update: ${n.data.job_title}` : 'Notification');
              const message = n.message || n.data?.message || (n.data?.new_status ? `Status changed to ${n.data.new_status}.` : '');
              const unread = !n.read_at;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  aria-label={`${unread ? 'Unread: ' : ''}${title}. Activate to mark as read.`}
                  className={`w-full text-left p-6 flex items-start gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${unread ? 'bg-secondary-container/10 hover:bg-secondary-container/20' : 'hover:bg-surface-container-lowest'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconColor(n.type)}`}>
                    <span className="material-symbols-outlined" aria-hidden="true">{n.icon || 'notifications'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-body-lg ${unread ? 'text-primary' : 'text-on-surface'}`}>{title}</h3>
                      <span className="text-label-sm text-on-surface-variant whitespace-nowrap ml-4">{n.time || new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-body-md text-on-surface-variant">{message}</p>
                  </div>
                  {unread && <div className="w-3 h-3 rounded-full bg-secondary shrink-0 mt-2" aria-hidden="true"></div>}
                </button>
              );
            })}
            {notifications.length > itemsPerPage && (
              <div className="flex justify-between items-center p-4 bg-surface-container-lowest">
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span className="text-on-surface-variant font-label-md">Page {page} of {Math.ceil(notifications.length / itemsPerPage)}</span>
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary disabled:opacity-50" disabled={page * itemsPerPage >= notifications.length} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

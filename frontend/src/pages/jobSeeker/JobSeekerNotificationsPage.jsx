import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';

export default function JobSeekerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get('/notifications')
      .then(res => {
         const items = res.data?.data?.data || res.data?.data || res.data || [];
         setNotifications(Array.isArray(items) ? items : []);
      })
      .catch(err => console.error('Error fetching notifications:', err))
      .finally(() => setLoading(false));
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
      case 'job_alert': return 'text-secondary bg-secondary-container';
      case 'message': return 'text-primary bg-primary-container';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  if (loading) {
    return <div className="p-margin-desktop flex justify-center items-center h-full"><span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span></div>;
  }

  return (
    <div className="p-margin-desktop max-w-4xl mx-auto flex flex-col h-full space-y-gutter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SeekerPageHeader title="Notifications" subtitle="Stay updated on your job search progress." icon="notifications" />
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-secondary hover:text-primary transition-colors font-label-md bg-surface-container-low px-4 py-2 rounded-lg">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4">notifications_off</span>
            <p className="font-body-lg">You have no notifications right now.</p>
          </div>
        ) : (
          <>
            {notifications.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(n => (
              <div key={n.id} onClick={() => markAsRead(n.id)}
                className={`p-6 flex items-start gap-4 transition-colors cursor-pointer ${n.read_at ? 'hover:bg-surface-container-lowest' : 'bg-secondary-container/10 hover:bg-secondary-container/20'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconColor(n.type)}`}>
                  <span className="material-symbols-outlined">{n.icon || 'notifications'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-body-lg ${n.read_at ? 'text-on-surface' : 'text-primary'}`}>{n.title || n.data?.title || 'Notification'}</h3>
                    <span className="text-label-sm text-on-surface-variant whitespace-nowrap ml-4">{n.time || new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{n.message || n.data?.message}</p>
                </div>
                {!n.read_at && <div className="w-3 h-3 rounded-full bg-secondary shrink-0 mt-2"></div>}
              </div>
            ))}
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

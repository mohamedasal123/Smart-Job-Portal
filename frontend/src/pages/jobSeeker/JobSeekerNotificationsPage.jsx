import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeekerEmptyState from '../../components/jobSeeker/SeekerEmptyState';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import { useToast } from '../../components/useToast';
import { ROUTES } from '../../utils/constants';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/jobSeekerDataService';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'messages', label: 'Messages' },
  { id: 'applications', label: 'Applications' },
];

function notificationTone(type) {
  switch (type) {
    case 'interview_scheduled':
    case 'interview_reminder':
      return { icon: 'event_available', className: 'text-secondary bg-secondary-container' };
    case 'message_received':
    case 'message':
      return { icon: 'chat', className: 'text-on-primary-container bg-primary-container' };
    case 'application_update':
    case 'application_status_updated':
    case 'demo_application_update':
      return { icon: 'work_history', className: 'text-success bg-success-container' };
    case 'job_alert':
    case 'demo_job_alert':
      return { icon: 'work', className: 'text-secondary bg-secondary-container' };
    default:
      return { icon: 'notifications', className: 'text-on-surface-variant bg-surface-container-highest' };
  }
}

function NotificationSpinner() {
  return (
    <div className="flex min-h-[320px] items-center justify-center" role="status" aria-live="polite">
      <span className="material-symbols-outlined animate-spin text-[48px] text-secondary" aria-hidden="true">progress_activity</span>
      <span className="sr-only">Loading your notifications...</span>
    </div>
  );
}

export default function JobSeekerNotificationsPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getNotifications()
      .then(setNotifications)
      .catch((error) => {
        console.error(error);
        addToast({ title: 'Notifications unavailable', message: 'Could not load your notifications.', type: 'error' });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 5000);
    window.addEventListener('notifications_updated', refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('notifications_updated', refresh);
    };
  }, [refresh]);

  const visibleNotifications = useMemo(() => notifications.filter((notification) => {
    const type = notification.type || notification.data?.type;
    if (filter === 'unread') return !notification.read_at && !notification.read;
    if (filter === 'interviews') return type === 'interview_scheduled' || type === 'interview_reminder';
    if (filter === 'messages') return type === 'message' || type === 'message_received';
    if (filter === 'applications') return type === 'application_update' || type === 'application_status_updated' || type === 'demo_application_update';
    return true;
  }), [filter, notifications]);
  const unreadCount = notifications.filter((notification) => !notification.read_at && !notification.read).length;

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      refresh();
    } catch (error) {
      console.error(error);
      addToast({ title: 'Update failed', message: 'Could not mark notifications as read.', type: 'error' });
    }
  };

  const openNotification = async (notification) => {
    try {
      if (!notification.read_at && !notification.read) {
        await markNotificationRead(notification.id);
        setNotifications((prev) => prev.map((item) => item.id === notification.id ? { ...item, read_at: new Date().toISOString(), read: true } : item));
      }
    } catch (error) {
      console.error(error);
      addToast({ title: 'Update failed', message: 'Could not mark this notification as read.', type: 'error' });
    }

    const type = notification.type || notification.data?.type;
    const senderId = notification.sender_id || notification.data?.sender_id;
    const jobId = notification.job_id || notification.data?.job_id;
    const applicationId = notification.application_id || notification.data?.application_id;

    if (type === 'interview_scheduled' || type === 'interview_reminder') {
      navigate(ROUTES.SEEKER_INTERVIEWS);
    } else if ((type === 'message' || type === 'message_received') && (senderId || jobId)) {
      navigate(`${ROUTES.SEEKER_MESSAGES}?user=${senderId || ''}&job=${jobId || ''}`);
    } else if ((type === 'application_update' || type === 'application_status_updated') && applicationId) {
      navigate(`/seeker/applications/${applicationId}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-margin-desktop w-full max-w-7xl mx-auto flex flex-col h-full space-y-gutter">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <SeekerPageHeader title="Notifications" subtitle="Stay updated on your applications, messages, and interviews." icon="notifications" />
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant px-4 py-2 font-label-md text-primary transition-colors hover:bg-surface-container-low disabled:opacity-50" disabled={!unreadCount} onClick={markAll} type="button">
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap gap-unit">
        {filters.map((item) => (
          <button className={`${filter === item.id ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'} rounded-lg px-stack-md py-stack-sm font-label-md text-label-md transition-colors`} key={item.id} onClick={() => setFilter(item.id)} type="button">
            {item.label}
          </button>
        ))}
      </div>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden" aria-live="polite" aria-label={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}>
        {loading ? <NotificationSpinner /> : (
          visibleNotifications.length ? visibleNotifications.map((notification) => {
            const unread = !notification.read_at && !notification.read;
            const tone = notificationTone(notification.type || notification.data?.type);
            return (
              <button
                className={`w-full border-b border-outline-variant p-stack-lg text-left transition-colors last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${unread ? 'bg-secondary-container/10 hover:bg-secondary-container/20' : 'hover:bg-surface-container-low'}`}
                key={notification.id}
                onClick={() => openNotification(notification)}
                type="button"
              >
                <div className="flex items-start gap-stack-md">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone.className}`}>
                    <span className="material-symbols-outlined" aria-hidden="true">{notification.icon || tone.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className={`font-h3 text-h3 ${unread ? 'text-primary' : 'text-on-surface'}`}>{notification.title}</h3>
                      <span className="whitespace-nowrap text-label-sm text-on-surface-variant">{new Date(notification.created_at || Date.now()).toLocaleString()}</span>
                    </div>
                    <p className="mt-unit text-body-md text-on-surface-variant">{notification.message}</p>
                  </div>
                  {unread && <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-secondary" aria-hidden="true" />}
                </div>
              </button>
            );
          }) : <SeekerEmptyState icon="notifications_off" title="No notifications" description="No notifications match this filter." />
        )}
      </section>
    </div>
  );
}

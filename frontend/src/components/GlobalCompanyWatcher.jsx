import { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useToast } from './useToast';

export default function GlobalCompanyWatcher() {
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (user?.role !== 'company') return;

    let timers = [];
    
    const setupTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
      const interviews = JSON.parse(localStorage.getItem('scheduled_interviews') || '{}');
      const notified = JSON.parse(localStorage.getItem('notified_interviews') || '{}');
      let hasChanges = false;

      Object.entries(interviews).forEach(([key, data]) => {
        if (!data) return;
        let time = data;
        let candidate = '';
        let job_id = '';
        let other_user_id = '';

        if (typeof data === 'object') {
           time = data.time;
           candidate = data.candidate;
           job_id = data.job_id;
           other_user_id = data.other_user_id;
        }

        if (typeof time === 'string' && time.includes('_passed')) return;

        const dueAt = new Date(time).getTime();
        if (isNaN(dueAt)) return;

        const delay = dueAt - Date.now();
        if (delay <= 0) {
           if (typeof data === 'object') {
             interviews[key].time = time + '_passed';
           } else {
             interviews[key] = time + '_passed';
           }
           hasChanges = true;
           return;
        }

        if (notified[key] === time || delay > 2147483647) return;

        timers.push(setTimeout(() => {
          const currentNotified = JSON.parse(localStorage.getItem('notified_interviews') || '{}');
          if (currentNotified[key] === time) return;
          
          currentNotified[key] = time;
          localStorage.setItem('notified_interviews', JSON.stringify(currentNotified));

          const currentMuteAll = localStorage.getItem('muted_messages_all') === 'true';
          const currentMutedConvs = JSON.parse(localStorage.getItem('muted_message_conversations') || '[]');

          if (!currentMuteAll && !currentMutedConvs.includes(key)) {
            addToast({
              title: 'Interview time',
              message: `Interview${candidate ? ` with ${candidate}` : ''} is starting now.`,
              type: 'info',
              duration: 8000,
            });
          }
          
          const { addLocalNotification } = window.__companyDataService || {};
          if (addLocalNotification) {
            addLocalNotification({
              type: 'interview_reminder',
              data: {
                title: 'Interview Reminder',
                message: `Your interview${candidate ? ` with ${candidate}` : ''} is starting now.`,
                sender_id: other_user_id,
                job_id: job_id,
              }
            });
            window.dispatchEvent(new Event('notifications_updated'));
          }

          const currentInterviews = JSON.parse(localStorage.getItem('scheduled_interviews') || '{}');
          if (currentInterviews[key]) {
            if (typeof currentInterviews[key] === 'object') {
               currentInterviews[key].time = time + '_passed';
            } else {
               currentInterviews[key] = time + '_passed';
            }
            localStorage.setItem('scheduled_interviews', JSON.stringify(currentInterviews));
            window.dispatchEvent(new Event('interviews_updated'));
          }
        }, delay));
      });

      if (hasChanges) {
        localStorage.setItem('scheduled_interviews', JSON.stringify(interviews));
        window.dispatchEvent(new Event('interviews_updated'));
      }
    };

    setupTimers();
    window.addEventListener('interviews_updated', setupTimers);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('interviews_updated', setupTimers);
    };
  }, [user, addToast]);

  return null;
}

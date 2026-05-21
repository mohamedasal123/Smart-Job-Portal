import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ToastContext } from './toastContext';
import { SPRING_SOFT } from '../motion/variants';

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'success', duration = 4000 }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  const iconMap = {
    success: { icon: 'check_circle', bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' },
    error: { icon: 'error', bg: 'bg-error-container', text: 'text-error' },
    info: { icon: 'info', bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]' },
    warning: { icon: 'warning', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} iconMap={iconMap} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastStack({ toasts, iconMap, onRemove }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const style = iconMap[toast.type] || iconMap.success;
          return (
            <motion.div
              key={toast.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, x: 24, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
              transition={SPRING_SOFT}
              className="pointer-events-auto bg-surface-container-lowest border border-outline-variant shadow-[0px_10px_30px_rgba(15,23,42,0.10)] rounded-lg p-stack-md flex items-center gap-stack-md z-50"
              style={{ maxWidth: 360, minWidth: 280 }}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${style.text}`} style={{ fontSize: 20, fontVariationSettings: '"FILL" 1' }} aria-hidden="true">
                  {style.icon}
                </span>
              </div>
              <div className="flex-grow min-w-0">
                {toast.title && (
                  <p className="font-h3 text-h3 text-primary text-sm truncate">{toast.title}</p>
                )}
                {toast.message && (
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                className="shrink-0 text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded"
                onClick={() => onRemove(toast.id)}
                aria-label="Dismiss notification"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">close</span>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

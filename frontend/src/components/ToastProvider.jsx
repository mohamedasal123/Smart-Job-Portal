import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './toastContext';

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
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const style = iconMap[toast.type] || iconMap.success;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-surface-container-lowest border border-outline-variant shadow-[0px_10px_30px_rgba(15,23,42,0.10)] rounded-lg p-stack-md flex items-center gap-stack-md z-50 animate-slide-in-right"
              style={{ maxWidth: 360, minWidth: 280 }}
            >
              <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${style.text}`} style={{ fontSize: 20, fontVariationSettings: '"FILL" 1' }}>
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
                className="shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => removeToast(toast.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

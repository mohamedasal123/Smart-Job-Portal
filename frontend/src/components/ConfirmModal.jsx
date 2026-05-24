import { useCallback, useId, useRef, useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

/**
 * Reusable ConfirmModal component.
 * Preserves the existing design system's styling.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - message: string | ReactNode
 * - confirmLabel: string (default "Confirm")
 * - cancelLabel: string (default "Cancel")
 * - variant: 'danger' | 'primary' (default "primary")
 * - onConfirm: () => void | Promise<void>
 * - onCancel: () => void
 * - loading: boolean (optional external loading)
 */
export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  loading: externalLoading,
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const titleId = useId();
  const loading = externalLoading ?? internalLoading;

  const handleConfirm = useCallback(async () => {
    if (loading) return;
    setInternalLoading(true);
    try {
      await onConfirm?.();
    } finally {
      setInternalLoading(false);
    }
  }, [loading, onConfirm]);

  const handleClose = useCallback(() => {
    if (!loading) onCancel?.();
  }, [loading, onCancel]);

  useFocusTrap(open, panelRef, null, handleClose);

  if (!open) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-error text-on-error hover:opacity-90'
      : 'bg-secondary text-on-secondary hover:opacity-90';

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={(e) => {
        if (e.target === backdropRef.current) handleClose();
      }}
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(15,23,42,0.15)] border border-outline-variant p-stack-lg w-full max-w-md mx-4 animate-scale-in focus:outline-none"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {/* Title */}
        <h3 className="font-h2 text-h2 text-primary mb-stack-sm" id={titleId}>{title}</h3>

        {/* Message */}
        {message && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">{message}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-stack-md pt-stack-sm border-t border-surface-container-high">
          <button
            className="px-4 py-2 font-body-md font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 font-body-md font-bold rounded-lg transition-all flex items-center gap-2 ${confirmBtnClass} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

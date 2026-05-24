import { useEffect } from 'react';

export function useFocusTrap(isOpen, containerRef, triggerRef, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const container = containerRef.current;
    const triggerAtOpen = triggerRef?.current;
    const previouslyFocused = document.activeElement;
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    const focusables = () => Array.from(container?.querySelectorAll(focusableSelector) || []);

    container?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      else triggerAtOpen?.focus();
    };
  }, [isOpen, containerRef, triggerRef, onClose]);
}

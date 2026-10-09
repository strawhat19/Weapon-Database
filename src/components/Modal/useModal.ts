import { useEffect, useRef } from 'react';

export const useModal = (open: boolean, onClose: () => void) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = `hidden`;
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);
  return { dialogRef, onClose };
};

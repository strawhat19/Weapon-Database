import Icon from '../Icon';
import { useId, type ReactNode } from 'react';
import { useModal } from './useModal';

type ModalProps = { open: boolean; title: string; children: ReactNode; eyebrow?: string; onClose: () => void };

export default function Modal({ open, title, children, eyebrow = `THE PUBLIC ARMORY`, onClose }: ModalProps) {
  const titleId = useId();
  const { dialogRef } = useModal(open, onClose);
  return <dialog
    ref={dialogRef}
    id={`armory-modal-${titleId}`}
    className={`armory-modal`}
    aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
  >
    <div className={`armory-modal__content`}>
      <div className={`armory-modal__heading`}>
        <div><p className={`eyebrow`}>{eyebrow}</p><h2 id={titleId}>{title}</h2></div>
        <button type={`button`} className={`icon-button`} id={`close-modal-${titleId}`} aria-label={`Close ${title}`} onClick={onClose}><Icon name={`x`} /></button>
      </div>
      {open && children}
    </div>
  </dialog>;
}

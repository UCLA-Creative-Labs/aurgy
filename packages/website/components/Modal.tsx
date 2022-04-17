import React from 'react';
import styles from '../styles/modal.module.scss';

export interface ModalProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  showFooter?: boolean;
  children: React.ReactNode;
}

function Modal({
  title,
  onCancel,
  onConfirm,
  showFooter = true,
  children,
}: ModalProps): JSX.Element {
  const overlayClass = `${styles.overlay} ${styles.show}`;

  return (
    <>
      <div className={overlayClass} onClick={onCancel} />
      <div className={styles.modal}>
        <div>{title}</div>
        {children}
        {showFooter &&
                    <div className={styles['modal-footer']}>
                      <button onClick={onCancel}>NAH</button>
                      <button onClick={onConfirm}>GO</button>
                    </div>}
      </div>
    </>
  );
}

export default Modal;

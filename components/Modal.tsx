import React from 'react';
import styles from '../styles/modal.module.scss';

interface ModalProps {
  title: string;
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  showFooter?: boolean;
  children: React.ReactNode;
}

function Modal({
  title,
  show,
  onCancel,
  onConfirm,
  showFooter = true,
  children,
}: ModalProps): JSX.Element {
  return (
    <>
      <div id={styles.overlay} className={show ? styles.show : ''} onClick={onCancel} />
      <div id={styles.modal}>
        <div id={styles['modal-header']}>{title}</div>
        {children}
        {showFooter &&
                    <div id={styles['modal-footer']}>
                      <button onClick={onCancel}>NAH</button>
                      <button onClick={onConfirm}>GO</button>
                    </div>}
      </div>
    </>
  );
}

export default Modal;

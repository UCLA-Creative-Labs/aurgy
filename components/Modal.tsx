import React, {useState} from 'react';
import styles from '../styles/modal.module.scss';

interface ModalProps {
  title: string;
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

function Modal({title, show, onCancel, onConfirm, children}: ModalProps): JSX.Element {
  return (
    <>
      <div id={styles.overlay} className={show ? styles.show : ''} onClick={onCancel} />
      <div id={styles.modal}>
        <div id={styles['modal-header']}>{title}</div>
        {children}
        <div id={styles['modal-footer']}>
          <button onClick={onCancel}>NAH</button>
          <button onClick={onConfirm}>GO</button>
        </div>
      </div>
    </>
  );
}

export default Modal;

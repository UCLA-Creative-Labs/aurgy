import React, {useState, useCallback} from 'react';
import Modal, {ModalProps} from '../components/Modal';

type Return = [
    Modal: (props: ModalProps) => JSX.Element,
    showModal: () => void,
    hideModal: () => void
];

function useModal(): Return {
  const [show, setShow] = useState(false);

  const ModalWrapper = useCallback(
    ({children, ...props}: ModalProps) => {
      return !show ? null : (
        <Modal {...props}>
          {children}
        </Modal>
      );
    }, [show],
  );

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);

  return [ModalWrapper, showModal, hideModal];
}

export default useModal;

import React, {useState, useCallback} from 'react';
import Modal, {BaseModalProps} from '../components/Modal';

type Return = [
    Modal: (props: BaseModalProps) => JSX.Element,
    showModal: () => void,
    hideModal: () => void
];

function useModal(): Return {
  const [show, setShow] = useState(false);

  const ModalWrapper = useCallback(
    ({children, ...props}: BaseModalProps) => {
      return (
        <Modal {...props} show={show}>
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

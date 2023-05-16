import { useRef } from 'react';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import * as Dialog from '@radix-ui/react-dialog';

import CrossIcon from '@/assets/icons/cross';

import styles from './modalStyles.module.css';

interface CreateReviewModalProps {
  children: JSX.Element;
  open: boolean;
  handleClose: () => void;
}

const Modal = ({ children, open, handleClose }: CreateReviewModalProps) => {
  const dialogRef = useRef(null);
  useOnClickOutside(dialogRef, handleClose);
  return (
    <div>
      <Dialog.Root open={open}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/10 data-[state=open]:animate-overlayShow fixed inset-0">
            <Dialog.Content
              className={`${styles['hide-scrollbar']} data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[632px] translate-x-[-50%] translate-y-[-50%] bg-white p-10 shadow-md rounded-3xl focus:outline-none relative overflow-scroll`}
              ref={dialogRef}
            >
              {children}
              <Dialog.Close asChild>
                <button
                  className="top-[24px] right-[24px] absolute focus:outline-none"
                  onClick={handleClose}
                >
                  <CrossIcon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Modal;

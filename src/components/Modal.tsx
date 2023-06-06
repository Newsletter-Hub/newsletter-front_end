import * as Dialog from '@radix-ui/react-dialog';

import CrossIcon from '@/assets/icons/cross';

import styles from './modalStyles.module.css';

interface CreateReviewModalProps {
  children: JSX.Element;
  open: boolean;
  handleClose: () => void;
  size?: 'base' | 'sm' | 'md';
  spacing?: 'base' | 'sm';
  customStyles?: string;
}

const Modal = ({
  children,
  open,
  handleClose,
  size = 'base',
  spacing = 'base',
  customStyles,
}: CreateReviewModalProps) => {
  const maxWidth =
    size === 'base' ? '632px' : size === 'sm' ? '496px' : '572px';
  return (
    <div>
      <Dialog.Root open={open}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/10 fixed inset-0 z-50">
            <Dialog.Content
              style={{ maxWidth: maxWidth }}
              className={`${
                styles['hide-scrollbar']
              } data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[${maxWidth}] translate-x-[-50%] translate-y-[-50%] bg-white p-10 ${
                spacing === 'sm' && 'md:p-10 p-3'
              } shadow-md rounded-3xl focus:outline-none absolute overflow-scroll ${customStyles}]`}
              onPointerDownOutside={handleClose}
            >
              {children}
              <Dialog.Close asChild>
                <button
                  className="top-[24px] right-[24px] absolute focus:outline-none z-50"
                  onClick={event => {
                    event.stopPropagation();
                    handleClose();
                  }}
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

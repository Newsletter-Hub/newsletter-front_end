import { Alegreya } from 'next/font/google';

import clsx from 'clsx';

import Modal from '@/components/Modal';

import { ModalProps } from './propsType';

const alegreya = Alegreya({ subsets: ['latin'] });

interface VerifyEmailModalProps extends ModalProps {
  email: string;
}

const VerifyEmailModal = ({
  open,
  handleClose,
  email,
}: VerifyEmailModalProps) => {
  const modalTitleStyles = clsx(
    'text-lightBlack text-5xl mb-9 text-center font-medium',
    alegreya.className
  );
  return (
    <Modal open={open} handleClose={handleClose} size="sm">
      <div>
        <h4 className={modalTitleStyles}>Verify your Email</h4>
        <p className="text-dark-blue text-base">
          You have requested to change your email. To confirm your email
          address, tap the button in the email we sent to{' '}
          <span className="font-medium">{email}</span>
        </p>
      </div>
    </Modal>
  );
};

export default VerifyEmailModal;

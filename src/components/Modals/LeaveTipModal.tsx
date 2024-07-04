import { useState } from 'react';
import clsx from 'clsx';
import { Alegreya } from 'next/font/google';
import { useRouter } from 'next/router';

import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import TextArea from '../TextArea';

import { createTipOrder } from '@/actions/tips';

const alegreya = Alegreya({ subsets: ['latin'] });

interface LeaveTipModalProps {
  open: boolean;
  handleClose: () => void;
  clientId?: number;
  partnerId?: number;
}

const modalTitleStyles = clsx(
  'text-dark-blue text-4xl mb-8 font-medium',
  alegreya.className
);

const LeaveTipModal = ({
  open,
  handleClose,
  clientId,
  partnerId,
}: LeaveTipModalProps) => {
  const [tipAmount, setTipAmount] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isValidData = !!clientId && !!tipAmount && !!partnerId;

  const handleCreateTipOrder = async () => {
    setIsLoading(true);

    if (!isValidData) return;

    const response = await createTipOrder({
      clientId,
      partnerId,
      tipAmount,
      ...(comment && { comment }),
    }).finally(() => setIsLoading(false));

    if (!response) return;

    handleClose();
    router.push(response.data.checkoutUrl);
  };

  const handleChangeTips = (tipValue: string) => {
    const onlyNumbers = tipValue.replace(/[^\d.]/g, '');
    const numberValue = parseFloat(onlyNumbers);

    if (!isNaN(numberValue)) {
      const formattedValue = numberValue.toFixed(2);

      setTipAmount(String(formattedValue));
    } else {
      setTipAmount('');
    }
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <div className="flex flex-col items-center gap-y-4">
          <h4 className={modalTitleStyles}>{`Leave a tip`}</h4>

          <p className="text-start font-inter text-sm mb-4 text-dark-blue">
            You agree to send the Author a tip. Please indicate the amount of
            the tip.
          </p>

          <Input
            placeholder="Enter your tip in USD"
            onChange={e => handleChangeTips(e.target.value)}
            customStyles="xl:min-w-[400px] md:min-w-[450px] lg:min-w-[350px] max-w-[200px] mx-auto"
          />

          <TextArea
            variant="filled"
            label="Enter comment"
            onChange={e => setComment(e.target.value)}
          />

          <Button
            label="Leave tip"
            size="md"
            rounded="md"
            type="button"
            onClick={handleCreateTipOrder}
            disabled={isLoading || !isValidData}
          />
        </div>
      </>
    </Modal>
  );
};

export default LeaveTipModal;

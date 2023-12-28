import Modal from '../Modal';
import Button from '../Button';
import { Alegreya } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useDetectAdBlock } from 'adblock-detect-react';
import clsx from 'clsx';
import { HIDE_ADBLOCK_MSG } from '@/config/constants';

const alegreya = Alegreya({ subsets: ['latin'] });

const AdblockModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const adBlockDetected = useDetectAdBlock();

  const modalTitleStyles = clsx(
    'text-dark-blue text-4xl mb-8 font-medium',
    alegreya.className
  );

  const handleCloseAdblockModal = () => {
    setIsModalOpen(false);
    sessionStorage.setItem(HIDE_ADBLOCK_MSG, '1');
  };

  useEffect(() => {
    if (adBlockDetected) {
      const hideAdblockMsg = sessionStorage.getItem(HIDE_ADBLOCK_MSG);

      if (hideAdblockMsg === '1') return;
      setIsModalOpen(true);
    }
  }, [adBlockDetected]);

  return (
    <Modal open={isModalOpen} handleClose={handleCloseAdblockModal}>
      <div className="flex flex-col items-center">
        <h4 className={modalTitleStyles}>Please support us by allowing ads</h4>
        <p className="text-start max-w-[395px] font-inter text-sm mb-4 text-dark-blue">
          With support from newsletter readers and writers like you, we can
          continue serving and building more features. You can support us for
          free by allowing ads.
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          We appreciate you visiting our site and respect your privacy. Whether
          or not you disable your adblocker, you will not see this message for
          the duration of your visit once you close this message.
        </p>
        <Button
          label="I've Disabled Ad Block"
          size="full"
          rounded="xl"
          fontSize="md"
          type="button"
          height="sm"
          customStyles="max-w-[395px]"
          onClick={handleCloseAdblockModal}
        />
      </div>
    </Modal>
  );
};

export default AdblockModal;

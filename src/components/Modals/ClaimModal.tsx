import Modal from '../Modal';
import Button from '../Button';
import Link from 'next/link';
import { claimNewsletterRequest } from '@/actions/newsletters';
import type { User } from '@/types/user';
import clsx from 'clsx';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({ subsets: ['latin'] });

interface ClaimModalProps {
  open: boolean;
  handleClose: () => void;
  user: User;
  newsletterId: number;
  newsletterTitle?: string;
}

const ClaimModal = ({
  open,
  handleClose,
  user,
  newsletterId,
  newsletterTitle = 'Newsletter',
}: ClaimModalProps) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletterId}?utm_source=user_${user.id}_newsletter&utm_medium=email&utm_campaign=verify`;
  const modalTitleStyles = clsx(
    'text-dark-blue text-4xl mb-8 font-medium',
    alegreya.className
  );
  const handleClick = () => {
    claimNewsletterRequest({ newsletterId });
    handleClose();
  };
  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <div className="flex flex-col">
          <h4 className={modalTitleStyles}>{`Claim ${newsletterTitle}`}</h4>
          <p className="text-start font-inter text-sm mb-4 text-dark-blue">
            For our team to verify your ownership, we will need to you add this
            link anywhere in your newsletter: &quot;
            <Link href={`${verificationLink}`} legacyBehavior passHref>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold break-words"
              >
                {verificationLink}
              </a>
            </Link>
            &quot;. You can encourage your readers to leave a review for your
            newsletter by clicking on this link. You may remove this link once
            verified.
            <br />
            <br />
            By clicking the button below, our team will be notified to look for
            the link in your newsletter issues. If you own a paid newsletter
            where our team will not be able to fully access, please reach out
            to&nbsp;
            <Link href="mailto: team@newsletterhub.co">
              team@newsletterhub.co
            </Link>
            .
          </p>
          <div className="flex justify-center">
            <Button
              label="Claim"
              size="md"
              rounded="md"
              type="button"
              onClick={handleClick}
            />
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ClaimModal;

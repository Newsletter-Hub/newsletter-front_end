import Modal from '../Modal';
import Button from '../Button';
import Link from 'next/link';
import { claimNewsletterRequest } from '@/actions/newsletters';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import clsx from 'clsx';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({ subsets: ['latin'] });

interface ClaimModalProps {
  open: boolean;
  handleClose: () => void;
}

const ClaimModal = ({ open, handleClose }: ClaimModalProps) => {
  const router = useRouter();
  const newsletterId = router.query.newsletterId;
  const { user } = useUser();

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletterId}?o=${user?.id}`;

  const modalTitleStyles = clsx(
    'text-dark-blue text-4xl mb-8 font-medium',
    alegreya.className
  );
  const handleClick = () => {
    const newsletterId = Number(router.query.newsletterId);
    claimNewsletterRequest({ newsletterId });
    handleClose();
  };
  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <div className="flex flex-col items-center">
          <h4 className={modalTitleStyles}>Owner of this Newsletter?</h4>
          <p className="text-start max-w-[395px] font-inter text-sm text-dark-blue">
            By claiming this newsletter, you will able to:
          </p>
          <ul className="list-disc text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Get a verified checkmark next to your username
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Fully edit your newsletter page; including the title, link,
                description, and image
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Subscribe to our premium features for newsletter owners
              </span>
            </li>
          </ul>
          <p className="text-start max-w-[395px] font-inter text-sm mb-4 text-dark-blue">
            For our team to verify your ownership, we will need to you add this
            link anywhere in your future newsletter issues: &quot;
            <Link
              href={`${verificationLink}?ref=newsletter-hub`}
              legacyBehavior
              passHref
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
              >
                {verificationLink}
              </a>
            </Link>
            &quot;. This can remove the link once you are is verified.
            <br />
            <br />
            By clicking the button below, our team will be notified to look for
            the link in newsletter issues. If your newsletter is not public, we
            will subscribe to your newsletter. If your newsletter is paid,
            please reach out to&nbsp;
            <Link href="mailto: team@newsletterhub.co">
              team@newsletterhub.co
            </Link>
            .
          </p>
          <Button
            label="Claim"
            size="md"
            rounded="md"
            type="button"
            onClick={handleClick}
          />
        </div>
      </>
    </Modal>
  );
};

export default ClaimModal;

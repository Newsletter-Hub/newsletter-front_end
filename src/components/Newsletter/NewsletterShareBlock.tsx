import { useState } from 'react';

import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  EmailShareButton,
  EmailIcon,
  RedditIcon,
  RedditShareButton,
} from 'next-share';

import CopyIcon from '@/assets/icons/copy';
import clsx from 'clsx';

interface NewsletterShareBlockProps {
  url: string;
  title?: string;
}

const NewsletterShareBlock = ({
  url,
  title = 'us',
}: NewsletterShareBlockProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipStyles = clsx(
    'absolute z-10 w-28 p-2 -mt-2 text-sm text-white bg-black rounded-md shadow-lg',
    'transition-opacity duration-300',
    { 'opacity-0': !showTooltip, 'opacity-100': showTooltip },
    'bottom-full left-1/2 transform -translate-x-1/2'
  );

  const handleCopyClick = () => {
    const newsletterLink = `${url}?utm_source=(direct)&utm_medium=copy_link&utm_campaign=social_share`;
    navigator.clipboard
      .writeText(newsletterLink)
      .then(() => {
        // Success message
        setIsCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <>
      <FacebookShareButton
        url={`${url}?utm_source=facebook&utm_medium=social&utm_campaign=social_share`}
        quote={`Review ${title} on Newsletter Hub`}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <LinkedinShareButton
        url={`${url}?utm_source=linkedin&utm_medium=social&utm_campaign=social_share`}
        title={`Review ${title} on Newsletter Hub`}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TwitterShareButton
        url={`${url}?utm_source=twitter&utm_medium=social&utm_campaign=social_share`}
        title={`Review ${title} on @newsletter_hub`}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <RedditShareButton
        url={`${url}?utm_source=reddit&utm_medium=social&utm_campaign=social_share`}
        title={`Review ${title} on Newsletter Hub`}
      >
        <RedditIcon size={32} round />
      </RedditShareButton>
      <EmailShareButton
        url={`${url}?utm_source=user_email&utm_medium=email&utm_campaign=social_share`}
        subject={`Review ${title} on Newsletter Hub`}
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
      <button
        onClick={handleCopyClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative ml-0.5"
        aria-label={isCopied ? 'Link Copied!' : 'Click to Copy'}
      >
        <CopyIcon />
        {showTooltip && <div className={tooltipStyles}>Click to Copy</div>}
        {isCopied && <div className={tooltipStyles}>Link Copied!</div>}
      </button>
    </>
  );
};

export default NewsletterShareBlock;

import VerifiedIcon from '@/assets/icons/verified';
import { useState } from 'react';
import clsx from 'clsx';

const VerifiedWithTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipStyles = clsx(
    'absolute z-10 w-56 p-2 -mt-2 text-sm text-white bg-black rounded-md shadow-lg',
    'transition-opacity duration-300',
    { 'opacity-0': !showTooltip, 'opacity-100': showTooltip },
    'bottom-full left-1/2 transform -translate-x-1/2'
  );

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative ml-0.5"
    >
      <VerifiedIcon className="h-5 w-5 text-blue-500" />
      {showTooltip && (
        <div className={tooltipStyles}>User is a verified newsletter owner</div>
      )}
    </div>
  );
};

export default VerifiedWithTooltip;

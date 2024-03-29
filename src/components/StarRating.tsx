import { useEffect, useState } from 'react';

import StarIcon from '@/assets/icons/star';

interface StarRatingProps {
  readonly?: boolean;
  value?: number;
  count?: number;
  customStyles?: string;
  setValue?: (index: number) => void;
  error?: boolean;
  errorText?: string;
}

const StarRating = ({
  readonly,
  value = 0,
  count = 5,
  customStyles,
  setValue,
  error,
  errorText,
}: StarRatingProps) => {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(0);
  const activeStarStyle = 'fill-primary';
  const inActiveStarStyle = 'stroke-primary !fill-transparent stroke-[1.5px]';

  useEffect(() => {
    if (setValue && rating !== 0) {
      setValue(rating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (index: number) => {
    if (readonly) {
      return;
    }
    setRating(index);
    if (setValue) {
      setValue(index);
    }
  };
  const handleMouseEnter = (index: number) => {
    if (readonly) {
      return;
    }
    setHover(index);
  };

  const handleMouseLeave = () => {
    if (readonly) {
      return;
    }
    setHover(rating);
  };
  return (
    <div className={`flex ${customStyles ? customStyles : ''} relative`}>
      {[...Array(count)].map((star, index) => {
        index += 1;
        return (
          <StarIcon
            key={index}
            className={`${
              index <= (hover || rating) ? activeStarStyle : inActiveStarStyle
            } ${!readonly && 'cursor-pointer'}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      {error && (
        <p className="absolute text-sm text-red -bottom-6 whitespace-nowrap">
          {errorText}
        </p>
      )}
    </div>
  );
};

export default StarRating;

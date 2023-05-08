import { useState } from 'react';

import StarIcon from '@/assets/icons/star';

interface StarRatingProps {
  readonly?: boolean;
  value?: number;
  count?: number;
  customStyles?: string;
}

const StarRating = ({
  readonly,
  value = 0,
  count = 5,
  customStyles,
}: StarRatingProps) => {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(0);
  const activeStarStyle = 'fill-primary';
  const inActiveStarStyle = 'stroke-primary !fill-transparent stroke-[1.5px]';
  const handleClick = (index: number) => {
    if (readonly) {
      return;
    }
    setRating(index);
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
    <div className={`flex ${customStyles}`}>
      {[...Array(count)].map((star, index) => {
        index += 1;
        return (
          <StarIcon
            key={index}
            className={`${
              index <= (hover || rating) ? activeStarStyle : inActiveStarStyle
            } cursor-pointer`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

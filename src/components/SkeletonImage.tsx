import { useState } from 'react';
import { ImageProps } from 'next/image';
import Image from 'next/image';

interface SkeletonImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  alt: string;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({ alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div
      style={{ ...props.style, width: props.width, height: props.height }}
      className={`w-full overflow-hidden ${
        !isLoaded
          ? `skeleton bg-gradient-to-r from-skeletonStart to-skeletonEnd animate-shimmer ${props.className}`
          : ''
      }`}
    >
      <div
        className={`transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          alt={alt}
          quality={90}
          {...props}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default SkeletonImage;

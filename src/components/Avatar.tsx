import React from 'react';
import SkeletonImage from './SkeletonImage';

interface AvatarProps {
  src?: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  username?: string;
  customStyles?: string;
  size?: 'base' | 'xl';
  isVip?: boolean;
}

const Avatar = ({
  src,
  width,
  height,
  alt,
  className,
  username,
  customStyles,
  size = 'base',
  isVip = false,
}: AvatarProps) => {
  const firstLetter = username ? username[0].toUpperCase() : '';

  // Calculate dynamic font size based on avatar size
  const dynamicFontSize = width / 8; // Adjust this calculation as necessary

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {src ? (
        <SkeletonImage
          style={{ width, height, minWidth: width }}
          src={src}
          width={width}
          height={height}
          alt={alt}
          className={`${className} rounded-full object-cover`}
        />
      ) : (
        <div
          style={{ width, height, minWidth: width }}
          className={`bg-primary flex items-center justify-center rounded-full text-white ${customStyles}`}
        >
          <span
            className={`${size === 'base' ? 'text-lg' : 'text-7xl'} font-inter`}
          >
            {firstLetter}
          </span>
        </div>
      )}
      {isVip && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'gold',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '25%',
            height: '25%',
            fontSize: `${dynamicFontSize}px`,
          }}
        >
          VIP
        </div>
      )}
    </div>
  );
};

export default Avatar;

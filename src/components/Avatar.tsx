import Image from 'next/image';

interface AvatarProps {
  src?: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  username?: string;
  customStyles?: string;
  size?: 'base' | 'xl';
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
}: AvatarProps) => {
  const firstLetter = username ? username[0].toUpperCase() : '';
  return (
    <>
      {src ? (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className={`${className} rounded-full`}
        />
      ) : (
        <div
          style={{ width, height, minWidth: width }}
          className={`bg-primary flex items-center justify-center rounded-full text-white ${customStyles}`}
        >
          <span
            className={`${
              size === 'base' ? 'text-lg' : 'text-7xl'
            }  font-inter`}
          >
            {firstLetter}
          </span>
        </div>
      )}
    </>
  );
};

export default Avatar;

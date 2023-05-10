import Image from 'next/image';

interface AvatarProps {
  src?: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  username?: string;
  customStyles?: string;
}

const Avatar = ({
  src,
  width,
  height,
  alt,
  className,
  username,
  customStyles,
}: AvatarProps) => {
  const firstLetter = username ? username[0].toUpperCase() : '';
  return (
    <>
      {src ? (
        <Image
          src={src as string}
          width={width}
          height={height}
          alt={alt}
          className={className}
        />
      ) : (
        <div
          style={{ width, height }}
          className={`bg-primary flex items-center justify-center rounded-full text-white ${customStyles}`}
        >
          <span className="text-lg font-inter">{firstLetter}</span>
        </div>
      )}
    </>
  );
};

export default Avatar;

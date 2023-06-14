import { useState } from 'react';

import Image, { ImageProps } from 'next/image';

import Loading from './Loading';

type LoadableImageProps = ImageProps & {
  placeholder?: JSX.Element;
};

const LoadableImage = ({ placeholder, alt, ...props }: LoadableImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const onLoad = () => {
    setLoaded(true);
  };

  const handleImageLoad = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLImageElement;
    if (target.srcset) {
      onLoad();
    }
  };

  return (
    <div>
      <Image
        {...props}
        onLoad={handleImageLoad}
        alt={alt}
        style={{ display: loaded ? 'block' : 'none' }}
        priority
      />

      {!loaded &&
        (placeholder ? (
          placeholder
        ) : (
          <div
            style={{ width: props.width, height: props.height }}
            className="flex justify-center items-center"
          >
            <Loading />
          </div>
        ))}
    </div>
  );
};

export default LoadableImage;

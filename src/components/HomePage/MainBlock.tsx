import Image from 'next/image';

import Button from '@/components/Button';

import homeImage from '@/assets/images/homeImage.svg';

const MainBlock = () => {
  return (
    <div className="flex items-center mb-20">
      <div className="max-w-3xl">
        <h1 className="text-7xl font-medium mb-7 text-dark-blue">
          Your Hub for Newsletter Reviews and Discovery
        </h1>
        <p className="text-xl text-dark-grey max-w-md mb-7">
          Rate, review, and browse newsletters that you, your friends, and the
          world are subscribed to.
        </p>
        <Button label="Create your profile now" rounded="xl" fontSize="md" />
      </div>
      <Image
        alt="home_image"
        src={homeImage}
        placeholder="blur"
        blurDataURL="src/assets/images/homeImage.svg"
        width={450}
      />
    </div>
  );
};

export default MainBlock;

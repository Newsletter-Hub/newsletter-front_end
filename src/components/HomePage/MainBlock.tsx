import Button from '@/components/Button';
import homeImage from '@/assets/images/homeImage.svg';
import Image from 'next/image';

const MainBlock = () => {
  return (
    <div className="flex items-center mb-20">
      <div className="max-w-3xl">
        <h1 className="text-7xl font-medium mb-7">
          Your Hub for Newsletter Reviews and Discovery
        </h1>
        <p className="text-2xl text-waterloo max-w-md mb-7">
          Rate, review, and browse newsletters that you, your friends, and the
          world are subscribed to.
        </p>
        <Button label="Create your profile now" />
      </div>
      <Image alt="home_image" src={homeImage} />
    </div>
  );
};

export default MainBlock;

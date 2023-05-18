import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/Button';

import HomeImage from '@/assets/images/homeImage';

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
        <Link href="/sign-up">
          <Button label="Create your profile now" rounded="xl" fontSize="md" />
        </Link>
      </div>
      <HomeImage />
    </div>
  );
};

export default MainBlock;

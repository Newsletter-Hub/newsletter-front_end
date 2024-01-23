import Link from 'next/link';

import Button from '@/components/Button';

import HomeImage from '@/assets/images/homeImage';
import { useUser } from '@/contexts/UserContext';

const MainBlock = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center mb-20 text-center md:text-start flex-col justify-center md:flex-row md:justify-between">
      <div className="max-w-3xl">
        <h1 className="xl:text-7xl lg:text-5xl text-4xl font-medium mb-7 text-dark-blue">
          Your Hub for Newsletter Reviews and Discovery
        </h1>
        <p className="md:text-xl text-dark-grey md:max-w-md mb-7">
          Add, review, and browse newsletters that you, your friends, and the
          world are subscribed to.
        </p>
        {!user && (
          <Link href="/sign-up">
            <Button
              label="Create your profile now"
              rounded="xl"
              fontSize="md"
              customStyles="w-full md:w-fit"
            />
          </Link>
        )}
      </div>
      <HomeImage className="!w-300px hidden md:block" />
    </div>
  );
};

export default MainBlock;

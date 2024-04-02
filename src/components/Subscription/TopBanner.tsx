import Image from 'next/image';

import Button from '@/components/Button';

import topbannerImage from '@/assets/images/subscriptionTopbannerImg.webp';

const TopBanner = () => {
  return (
    <section className="flex flex-col md:flex-row xl:w-[1365px] w-[300px] xs:w-[350px] sm:w-[400px] md:w-fit px-3">
      <div className="sm:flex-1">
        <h2 className="font-medium text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-lightBlack">
          Newsletters Hub Pro - Where Content Meets Connection!
        </h2>
        <p className="text-lightBlack text-xl mb-8 text-start">
          Rate, review, and browse newsletters that you, your friends, and the
          world are subscribed to.
        </p>
        <Button label="Watch tariffs" variant="primary" rounded="xl" />
      </div>
      <div className="sm:flex-1 py-3.5">
        <Image
          src={topbannerImage}
          width={0}
          alt="Enable paied subscription"
          placeholder="blur"
          blurDataURL="src/assets/images/subscriptionTopbannerImg.webp"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </section>
  );
};

export default TopBanner;

import Image from 'next/image';

import subscriptionDecoLine from '@/assets/images/subscriptionDecoLine.webp';
import subscriptionPlaneIcon from '@/assets/images/subscriptionPlaneIcon.svg';

const HowItWorks = () => {
  return (
    <section className="flex flex-col min-w-[93%] xl:w-[1365px] gap-y-12">
      <h4 className="text-2xl md:text-3xl lg:text-5xl">How it works</h4>
      <div className="flex flex-col lg:flex-row md:gap-x-12 xl:gap-x-40 relative mx-auto">
        <Image
          src={subscriptionDecoLine}
          width={0}
          alt="contact"
          placeholder="blur"
          blurDataURL="src/assets/images/subscriptionDecoLine.webp"
          className="hidden lg:block lg:w-[800px] xl:w-[1150px]"
          style={{
            height: 'auto',
            position: 'absolute',
            top: '30px',
          }}
        />

        <div className="flex flex-col gap-y-8">
          <div className="flex justify-between">
            <p className="flex items-center justify-center font-inter font-semibold text-2xl w-[60px] h-[60px] bg-primary-light rounded-lg relative z-1">
              1
            </p>
            <Image
              src={subscriptionPlaneIcon}
              width={0}
              alt="contact"
              placeholder="blur"
              blurDataURL="src/assets/images/subscriptionPlaneIcon.svg"
              className="hidden lg:block"
              style={{
                width: '37px',
                height: 'auto',
                position: 'relative',
                marginTop: '7px',
                zIndex: 1,
              }}
            />
          </div>
          <div className="flex flex-col gap-y-4 w-[210px]">
            <p className="font-inter font-semibold text-lg">Account</p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Ensure that you are a verified owner. If you are unsure, you can
              learn more here.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex">
            <p className="flex items-center justify-center font-inter font-semibold text-2xl w-[60px] h-[60px] bg-primary-light rounded-lg relative z-1">
              2
            </p>
          </div>
          <div className="flex flex-col gap-y-4 w-[210px]">
            <p className="font-inter font-semibold text-lg">Plans</p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Take a look at the tariff plans below and select the one that best
              fits your needs.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex">
            <p className="flex items-center justify-center font-inter font-semibold text-2xl w-[60px] h-[60px] bg-primary-light rounded-lg relative z-1">
              3
            </p>
          </div>
          <div className="flex flex-col gap-y-4 w-[210px]">
            <p className="font-inter font-semibold text-lg">Payment</p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Please complete the payment form with your information and then
              click &apos;Purchase&apos;
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex">
            <p className="flex items-center justify-center font-inter font-semibold text-2xl w-[60px] h-[60px] bg-primary-light rounded-lg relative z-1">
              4
            </p>
          </div>
          <div className="flex flex-col gap-y-4 w-[210px]">
            <p className="font-inter font-semibold text-lg">Enjoy</p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Enjoy your new Newsletters Hub Pro account and explore its
              exciting new features!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

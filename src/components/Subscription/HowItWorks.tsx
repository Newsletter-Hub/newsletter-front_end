import Image from 'next/image';
import Link from 'next/link';

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
            <p className="font-inter font-semibold text-lg">
              Be a Verified Owner
            </p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Ensure that you are a verified owner of a newsletter. If you are
              unsure, you can learn more by clicking&nbsp;
              <Link href="/newsletters/claim" legacyBehavior passHref>
                <a target="_blank" rel="noopener noreferrer">
                  here.
                </a>
              </Link>
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
            <p className="font-inter font-semibold text-lg">
              Subscribe to a Plan
            </p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Select a subscription plan below and complete the payment process
              through PayPal.
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
            <p className="font-inter font-semibold text-lg">
              Connect Your PayPal Account to Newsletter Hub
            </p>
            <p className="font-inter font-normal text-lg text-dark-grey">
              Go to&nbsp;
              <Link href="/profile" legacyBehavior passHref>
                <a target="_blank" rel="noopener noreferrer">
                  your profile
                </a>
              </Link>
              &nbsp;and click on &apos;Connect PayPal Account&apos;
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
              Link your readers to your newsletter page on Newsletter Hub and
              start receiving tips directly to your PayPal account
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

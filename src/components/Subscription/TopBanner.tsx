import Image from 'next/image';

import ListItemIcon from '../../assets/icons/listItem';
import topbannerImage from '@/assets/images/subscriptionTopbannerImg.webp';

const TopBanner = () => {
  return (
    <section className="flex flex-col md:flex-row xl:w-[1365px] w-[300px] xs:w-[350px] sm:w-[400px] md:w-fit px-3">
      <div className="sm:flex-1">
        <h2 className="font-medium text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-lightBlack">
          Newsletters Hub Pro
        </h2>
        <p className="text-lightBlack text-xl mb-8 text-start">
          Transform your newsletter into a thriving community with Newsletter
          Hub Pro. Enable your readers to show appreciation through direct tips,
          and build a sustainable newsletter with the power of community backing
        </p>
        <div className="sm:flex-1 flex items-center justify-center md:justify-start">
          <div className="flex flex-col gap-y-4">
            <h3 className="font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-lightBlack">
              What you recieve
            </h3>
            <div>
              <p className="font-inter font-semibold text-lg text-dark-grey mb-3">
                With Newsletters Hub Pro you will have:
              </p>

              <p className="flex items-center gap-x-2 text-lg font-inter text-dark-grey mb-1">
                <ListItemIcon /> The opportunity to collect tips for your
                newsletters.
              </p>
              <p className="flex items-center gap-x-2 text-lg font-inter text-dark-grey mb-1">
                <ListItemIcon /> Gain social proof with the combination of tips
                and reviews from your readers.
              </p>
            </div>
          </div>
        </div>
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

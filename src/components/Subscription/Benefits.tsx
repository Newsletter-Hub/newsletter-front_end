import Image from 'next/image';

import ListItemIcon from '../../assets/icons/listItem';
import subscriptionBenefitsImg from '@/assets/images/subscriptionBenefitsImg.webp';

const Benefits = () => {
  return (
    <section className="flex flex-col md:flex-row min-w-[93%] xl:w-[1365px] min-h-[fit-content] h-[600px] md:h-[472px] px-3 bg-primary-light rounded-lg">
      <div className="sm:flex-1 flex items-center justify-center">
        <Image
          src={subscriptionBenefitsImg}
          width={334}
          alt="contact"
          placeholder="blur"
          blurDataURL="src/assets/images/subscriptionBenefitsImg.webp"
        />
      </div>
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
    </section>
  );
};

export default Benefits;

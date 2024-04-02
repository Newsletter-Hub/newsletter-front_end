import { useState } from 'react';

import Image from 'next/image';

import checkmarkWhiteIcon from '@/assets/images/checkmarkWhiteIcon.svg';

import Button from '@/components/Button';

const ChoosePlan = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <section className="flex items-center justify-center w-full bg-primary-light pt-20 pb-28">
      <div className="flex flex-col items-center gap-y-10">
        <div>
          <h5 className="text-2xl md:text-3xl lg:text-5xl text-center ">
            Choose your plan
          </h5>
          <p className="font-inter font-normal text-lg text-dark-grey text-center">
            No contracts, no surprise fees.
          </p>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="peer sr-only"
          />

          <div className="peer flex w-[209px] h-[44px] items-center gap-16 rounded-full bg-white pl-8 pr-4 after:absolute after:left-1 after: after:h-[36px] after:w-[103px] after:rounded-full after:bg-primary after:transition-all after:content-[''] peer-checked:bg-stone-600 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-s text-grey-chat">
            <span className={!isChecked ? 'z-20 text-white' : 'z-20'}>
              Yearly
            </span>
            <span className={isChecked ? 'z-20 text-white' : 'z-20 '}>
              Monthly
            </span>
          </div>
        </label>

        <div className="flex flex-col md:flex-row gap-x-8">
          <div className="flex flex-col justify-between items-center gap-y-8 w-[328px] h-[428px] p-6 bg-white rounded-lg">
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-inter text-lg font-semibold">Basic</p>
                <p className="font-inter text-sm font-normal text-primary">
                  Free
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-6xl font-medium pt-5 pb-5">Free</p>
              </div>

              <p className="font-inter text-sm font-normal">
                Default plan for activated users
              </p>
            </div>
            <Button
              label="Active"
              variant="primary"
              rounded="xl"
              size="full"
              disabled={true}
            />
          </div>

          <div className="flex flex-col justify-between items-center gap-y-8 w-[328px] h-[428px] p-6 bg-primary rounded-lg">
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-inter text-lg font-semibold text-white">
                  Hub Pro
                </p>
                <p className="font-inter text-sm font-normal text-white">
                  Save 20%
                </p>
              </div>

              <div className="flex flex-col items-center justify-center mb-3">
                <sup className="font-semibold text-base text-white top-10 -left-11">
                  $
                </sup>
                <span className="font-inter text-6xl font-medium text-white">
                  10
                </span>
                <sub className="font-semibold text-base text-white -top-10 left-12">
                  /mo
                </sub>
                <p className="font-inter text-base font-normal text-light-porcelain">
                  Everything you need to launch your professional author career
                </p>
              </div>

              <ul>
                <li className="flex gap-x-1">
                  <Image
                    src={checkmarkWhiteIcon}
                    width={0}
                    alt="contact"
                    placeholder="blur"
                    blurDataURL="src/assets/images/checkmarkWhiteIcon.svg"
                    style={{
                      width: '16px',
                      height: 'auto',
                    }}
                  />
                  <p className="font-inter text-sm text-white">First benefit</p>
                </li>
                <li className="flex gap-x-1">
                  <Image
                    src={checkmarkWhiteIcon}
                    width={0}
                    alt="contact"
                    placeholder="blur"
                    blurDataURL="src/assets/images/checkmarkWhiteIcon.svg"
                    style={{
                      width: '16px',
                      height: 'auto',
                    }}
                  />
                  <p className="font-inter text-sm text-white">
                    Second benefit
                  </p>
                </li>
                <li className="flex gap-x-1">
                  <Image
                    src={checkmarkWhiteIcon}
                    width={0}
                    alt="contact"
                    placeholder="blur"
                    blurDataURL="src/assets/images/checkmarkWhiteIcon.svg"
                    style={{
                      width: '16px',
                      height: 'auto',
                    }}
                  />
                  <p className="font-inter text-sm text-white">Third benefit</p>
                </li>
              </ul>
            </div>
            <Button
              label="Subscribe"
              variant="tertiary"
              rounded="xl"
              size="full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChoosePlan;

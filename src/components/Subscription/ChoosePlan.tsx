import Script from 'next/script';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';

import checkmarkWhiteIcon from '@/assets/images/checkmarkWhiteIcon.svg';

import Button from '@/components/Button';

import { User } from '@/types/user';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal: any;
  }
}

interface SubscriptionProps {
  userMe: User;
  subscription: null | boolean;
}

const ChoosePlan = ({ userMe, subscription }: SubscriptionProps) => {
  const [isChecked, setIsChecked] = useState(true);
  const [isPaypalButtonsHidden, setIsPaypalButtonsHidden] = useState(true);

  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paypalButtonContainer = paypalButtonContainerRef.current;

    if (paypalButtonContainer) {
      while (paypalButtonContainer.firstChild) {
        paypalButtonContainer.removeChild(paypalButtonContainer.firstChild);
      }
    }

    if (window.paypal) {
      window.paypal
        .Buttons({
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              plan_id: isChecked
                ? process.env.NEXT_PUBLIC_MONTHLY_PLAN_ID
                : process.env.NEXT_PUBLIC_YEARLY_PLAN_ID,
              custom_id: userMe.email,
            });
          },
          onApprove: function (data, actions) {
            alert('You have successfully subscribed, please reload your page!');
          },
        })
        .render('#paypal-button-container');
    }
  }, [isChecked, userMe.email]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onUnsubscribe = async () => {
    console.log('Yes')!;
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
          <div className="flex flex-col justify-between items-center gap-y-8 w-[328px] h-[460px] p-6 bg-white rounded-lg">
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
              label={!subscription ? 'Active' : 'Subscribed'}
              variant="primary"
              rounded="xl"
              size="full"
              disabled={true}
            />
          </div>

          <div className="flex flex-col justify-between items-center gap-y-8 w-[328px] h-[460px] p-6 bg-primary rounded-lg">
            <div className="w-full relative">
              <div className="flex justify-between">
                <p className="font-inter text-lg font-semibold text-white">
                  Hub Pro
                </p>
                <p className="font-inter text-sm font-normal text-white">
                  Save 20%
                </p>
              </div>

              <div className="flex flex-col items-center justify-center mb-3">
                <sup
                  className={
                    isChecked
                      ? 'font-semibold text-base text-white top-10 -left-11'
                      : 'font-semibold text-base text-white top-10 -left-16'
                  }
                >
                  $
                </sup>
                <span className="font-inter text-6xl font-medium text-white">
                  {isChecked
                    ? process.env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_USD
                    : process.env.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_USD}
                </span>
                <sub
                  className={
                    isChecked
                      ? 'font-semibold text-base text-white -top-10 left-12'
                      : 'font-semibold text-base text-white -top-10 left-16'
                  }
                >
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

            {subscription ? (
              <Button
                label="Unsubscribe"
                variant="tertiary"
                rounded="xl"
                size="full"
                onClick={onUnsubscribe}
              />
            ) : (
              isPaypalButtonsHidden && (
                <Button
                  label="Subscribe"
                  variant="tertiary"
                  rounded="xl"
                  size="full"
                  onClick={() =>
                    setIsPaypalButtonsHidden(!isPaypalButtonsHidden)
                  }
                />
              )
            )}

            <div
              id="paypal-button-container"
              ref={paypalButtonContainerRef}
              style={
                isPaypalButtonsHidden
                  ? { opacity: 0, width: 0, height: 0, position: 'absolute' }
                  : { opacity: 1, minWidth: '200px', maxWidth: '100%' }
              }
            ></div>
          </div>
        </div>
      </div>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        strategy="afterInteractive"
        onLoad={() => {
          if (window.paypal) {
            window.paypal
              .Buttons({
                createSubscription: function (data, actions) {
                  return actions.subscription.create({
                    plan_id: isChecked
                      ? process.env.NEXT_PUBLIC_MONTHLY_PLAN_ID
                      : process.env.NEXT_PUBLIC_YEARLY_PLAN_ID,
                    custom_id: userMe.email,
                  });
                },
                onApprove: function (data, actions) {
                  alert('You have successfully subscribed!');
                },
              })
              .render('#paypal-button-container');
          }
        }}
      />
    </section>
  );
};

export default ChoosePlan;

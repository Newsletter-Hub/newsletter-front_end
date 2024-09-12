import { useState, useEffect, useCallback, useRef } from 'react';
import Script from 'next/script';
import clsx from 'clsx';
import { Alegreya } from 'next/font/google';
import _ from 'lodash';
import { toast } from 'react-toastify';

import Modal from '../Modal';
import Input from '../Input';
import TextArea from '../TextArea';
import Loading from '../Loading';

const alegreya = Alegreya({ subsets: ['latin'] });

interface LeaveTipModalProps {
  open: boolean;
  handleClose: () => void;
  merchantIdInPayPal: null | string;
  partnerId?: number;
  userId?: null | number;
  newsletterId: number;
}

const modalTitleStyles = clsx(
  'text-dark-blue text-4xl mb-8 font-medium',
  alegreya.className
);

const LeaveTipModal = ({
  open,
  handleClose,
  merchantIdInPayPal,
  partnerId,
  userId,
  newsletterId,
}: LeaveTipModalProps) => {
  const [tipAmount, setTipAmount] = useState('');
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [payPalPayerName, setPayPalPayerName] = useState('');

  const commentRef = useRef('');
  const paypalButtonsRef = useRef<HTMLDivElement | null>(null);

  const isValidData =
    !!process.env.NEXT_PUBLIC_PAYPAL_TIPPING_CLIENT_ID &&
    !!tipAmount &&
    !!partnerId &&
    !!userId &&
    !!merchantIdInPayPal;
  const isPayPalPayerName = !!payPalPayerName;

  useEffect(() => {
    if (paypalButtonsRef.current && isPayPalPayerName) {
      paypalButtonsRef.current.innerHTML = '';
    }
  }, [isPayPalPayerName]);

  useEffect(() => {
    if (
      window.paypal &&
      isPayPalLoaded &&
      isValidData &&
      !isPayPalPayerName &&
      paypalButtonsRef.current &&
      paypalButtonsRef.current.children.length === 0
    ) {
      window.paypal
        .Buttons({
          style: {
            color: 'blue',
            shape: 'pill',
            label: 'pay',
            height: 40,
          },
          createOrder: function () {
            return fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/paypal/create-order`,
              {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  clientId: userId,
                  partnerId,
                  tipAmount,
                  newsletterId,
                  ...(commentRef.current && { comment: commentRef.current }),
                }),
              }
            )
              .then(function (res) {
                return res.json();
              })
              .then(function (data) {
                return data?.data?.orderID;
              });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onApprove: function (data: any) {
            return fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/paypal/tip-capture`,
              {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderID: data?.orderID,
                }),
              }
            )
              .then(function (res) {
                return res.json();
              })
              .then(function (details) {
                setPayPalPayerName(
                  details?.data?.payer?.name?.given_name || ''
                );
              });
          },
          onCancel: function () {
            toast.info('You canceled the tip payment');
            handleClose();
          },
          onError: function () {
            toast.error('There was an error during the tip payment process!');
            handleClose();
          },
        })
        .render('#paypal-button-container');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayPalLoaded, isValidData]);

  const handleChangeComment = (value: string) => {
    commentRef.current = value;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeTips = useCallback(
    _.debounce((tipValue: string) => {
      const onlyNumbers = _.replace(tipValue, /[^0-9.]/g, '');
      setTipAmount(onlyNumbers);
    }, 300),
    []
  );

  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <div className="flex flex-col items-center gap-y-4 mb-3">
          {!isPayPalPayerName ? (
            <h4 className={modalTitleStyles}>{'Leave a tip'}</h4>
          ) : (
            <h4 className={modalTitleStyles}>{'Thank you!'}</h4>
          )}

          {!isPayPalPayerName ? (
            <>
              <p className="text-start font-inter text-sm mb-4 text-dark-blue">
                You agree to send the Author a tip. Please indicate the amount
                of the tip.
              </p>

              <Input
                placeholder="Enter your tip in USD"
                onChange={e => handleChangeTips(e.target.value)}
                customStyles="xl:min-w-[400px] md:min-w-[450px] lg:min-w-[350px] max-w-[200px] mx-auto"
              />

              <TextArea
                variant="filled"
                label="Enter comment"
                onChange={e => handleChangeComment(e.target.value)}
              />
            </>
          ) : (
            `Transaction completed by ${payPalPayerName}! The author is very grateful to you!`
          )}
        </div>

        <div className="flex justify-center">
          {!isPayPalLoaded ? (
            <Loading />
          ) : (
            <div ref={paypalButtonsRef} id="paypal-button-container"></div>
          )}
        </div>

        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_TIPPING_CLIENT_ID}&merchant-id=${merchantIdInPayPal}&currency=USD&intent=capture&locale=en_US&commit=true&vault=false&integration-date=2020-07-01&components=buttons`}
          strategy="afterInteractive"
          data-partner-attribution-id="NewsletterHubPartnerInt_Ecom"
          onLoad={() => setIsPayPalLoaded(true)}
        />
      </>
    </Modal>
  );
};

export default LeaveTipModal;

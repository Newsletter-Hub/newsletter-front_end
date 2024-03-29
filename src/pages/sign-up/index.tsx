import { getServerSideProps } from '@/helpers/authGetServerSideProps';
import React, { useState } from 'react';

import SignUpForm from '@/components/SignUp';
import { resendVerifyEmail } from '@/actions/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const handleResendEmail = async () => {
    await resendVerifyEmail({ email });
  };
  return (
    <div
      className={`md:shadow-md rounded-3xl lg:pt-20 pt-6 lg:px-12 px-2 md:px-6 pb-16 ${
        email && 'max-w-[496px]'
      } w-full`}
    >
      <p
        className={`text-lightBlack font-semibold text-center ${
          email ? 'mb-6 text-3xl md:text-5xl' : 'mb-12 text-5xl'
        }`}
      >
        {email ? 'Verify your Email' : 'Sign up'}
      </p>
      {email ? (
        <div className="font-inter">
          <p className="text-lightBlack mb-8 text-center md:text-start">
            To confirm your email address, tap the button in the email we sent
            to <span className="font-semibold">{email}</span>.
          </p>
          <p className="text-lightBlack text-center mb-4">
            Didn&apos;t receive email?
          </p>
          <div className="text-center w-full">
            <span
              className="text-base text-dark-blue font-semibold border-b border-dark-blue cursor-pointer"
              onClick={handleResendEmail}
            >
              Resend email
            </span>
          </div>
        </div>
      ) : (
        <SignUpForm setEmail={setEmail} />
      )}
    </div>
  );
};

SignUp.layout = 'entry';
SignUp.type = 'signup';

export { getServerSideProps };

SignUp.title = 'Sign Up | Newsletter Hub';
SignUp.description =
  'Sign up today to Newsletter Hub and start curating and sharing your newsletter tastes.';
export default SignUp;

import { getServerSideProps } from '@/helpers/authGetServerSideProps';
import React, { useState } from 'react';

import SignUpForm from '@/components/SignUp';

const SignUp = () => {
  const [email, setEmail] = useState('');
  return (
    <div
      className={`shadow-md pt-20 lg:px-16 pb-16 ${email && 'max-w-[496px]'}`}
    >
      <p
        className={`text-3xl text-lightBlack font-semibold text-center ${
          email ? 'mb-6' : 'mb-12'
        }`}
      >
        {email ? 'Verify your Email' : 'Sign up'}
      </p>
      {email ? (
        <p className="font-inter text-lightBlack text-center">
          To confirm your email address, tap the button in the email we sent to{' '}
          <span className="font-semibold">{email}</span>.
        </p>
      ) : (
        <SignUpForm setEmail={setEmail} />
      )}
    </div>
  );
};

SignUp.layout = 'entry';
SignUp.type = 'signup';

export { getServerSideProps };

export default SignUp;

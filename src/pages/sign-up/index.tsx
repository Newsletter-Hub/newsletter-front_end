import React, { useState } from 'react';

import SignUpForm from '@/components/SignUp';
import withLayout from '@/components/withLayout';

const SignUp = () => {
  const [email, setEmail] = useState('');
  return (
    <div className={`shadow-md pt-20 px-16 pb-16 ${email && 'max-w-[496px]'}`}>
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

export default withLayout(SignUp, 'entry', { type: 'signup' });

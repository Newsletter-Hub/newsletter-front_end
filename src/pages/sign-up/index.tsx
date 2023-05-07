import React, { useState } from 'react';

import EntryLayout from '@/components/EntryLayout';
import SignUpForm from '@/components/SignUp';

const SignUp = () => {
  const [email, setEmail] = useState('');
  return (
    <EntryLayout type="signup">
      <div
        className={`shadow-md pt-20 px-16 pb-16 ${email && 'max-w-[496px]'}`}
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
            To confirm your email address, tap the button in the email we sent
            to <span className="font-semibold">{email}</span>.
          </p>
        ) : (
          <SignUpForm setEmail={setEmail} />
        )}
      </div>
    </EntryLayout>
  );
};

export default SignUp;

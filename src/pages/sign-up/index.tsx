import React from 'react';

import EntryLayout from '@/components/EntryLayout';
import SignUpForm from '@/components/SignUp';

const SignUp = () => {
  return (
    <EntryLayout type="signup">
      <div className="shadow-md pt-20 px-16 pb-16">
        <p className="text-3xl text-googleBlack font-semibold text-center mb-11">
          Sign up
        </p>
        <SignUpForm />
      </div>
    </EntryLayout>
  );
};

export default SignUp;

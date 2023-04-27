import React, { useState } from 'react';

import { Payload } from '@/assets/types/signup-types';

import EntryLayout from '@/components/EntryLayout';
import SignUpForm from '@/components/SignUp';
import BasicInformation from '@/components/SignUp/BasicInformation';

export const UserContext = React.createContext<Payload>({
  email: '',
  password: '',
  confirm_password: '',
});

const SignUp = () => {
  const [page, setPage] = useState(0);
  const [payload, setPayload] = useState<Payload>({
    email: '',
    password: '',
    confirm_password: '',
  });
  const pageToShow = [
    <SignUpForm
      key={0}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
    <BasicInformation
      key={1}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
  ];
  const titles = ['Sign Up', 'Basic Information'];
  return (
    <UserContext.Provider value={payload}>
      <EntryLayout type="signup">
        <div className="shadow-md pt-20 px-16 pb-16">
          <p className="text-3xl text-googleBlack font-semibold text-center mb-11">
            {titles[page]}
          </p>
          {pageToShow[page]}
        </div>
      </EntryLayout>
    </UserContext.Provider>
  );
};

export default SignUp;
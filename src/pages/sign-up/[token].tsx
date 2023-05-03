import React, { useState } from 'react';

import { Payload } from '@/assets/types/signup-types';

import EntryLayout from '@/components/EntryLayout';
import BasicInformation from '@/components/SignUp/BasicInformation';

export const UserContext = React.createContext<Payload>({
  email: '',
  password: '',
  confirm_password: '',
});

const SignUpInfo = () => {
  const [page, setPage] = useState(0);
  const [payload, setPayload] = useState<Payload>({
    email: '',
    password: '',
    confirm_password: '',
  });
  const pageToShow = [
    <BasicInformation
      key={1}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
  ];
  const titles = ['Basic Information'];
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

export default SignUpInfo;

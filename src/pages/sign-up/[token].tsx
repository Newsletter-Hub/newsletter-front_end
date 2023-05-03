import React, { useState } from 'react';

import { Payload } from '@/assets/types/signup-types';
import UserType from '@/components/SignUp/UserType';

import EntryLayout from '@/components/EntryLayout';
import BasicInformation from '@/components/SignUp/BasicInformation';
import ProfilePicture from '@/components/SignUp/ProfilePicture';

export const UserContext = React.createContext<Payload>({
  dateBirth: '',
  country: '',
  state: '',
  username: '',
  profileType: '',
  avatar: '',
});

const SignUpInfo = () => {
  const [page, setPage] = useState(0);
  const [payload, setPayload] = useState<Payload>({});
  const pageToShow = [
    <BasicInformation
      key={1}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
    <UserType
      key={2}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
    <ProfilePicture
      key={3}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
    />,
  ];
  const titles = ['Basic Information', 'Your Type', 'Choose Your Profile PIC'];
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

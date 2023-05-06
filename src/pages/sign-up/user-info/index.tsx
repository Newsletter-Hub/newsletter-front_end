import React, { useState } from 'react';

import { getInterests } from '@/pages/api/user/interests';

import { Interest } from '@/types/interests';
import { Payload } from '@/types/signup';

import EntryLayout from '@/components/EntryLayout';
import BasicInformation from '@/components/SignUp/BasicInformation';
import ChooseInterests from '@/components/SignUp/ChooseInterests';
import ProfilePicture from '@/components/SignUp/ProfilePicture';
import UserType from '@/components/SignUp/UserType';

export const UserContext = React.createContext<Payload>({
  dateBirth: '',
  country: '',
  state: '',
  username: '',
  profileType: '',
  avatar: '',
  interests: [],
});

interface SignUpInfoProps {
  interests: Interest[];
}
const SignUpInfo = ({ interests }: SignUpInfoProps) => {
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
    <ChooseInterests
      key={3}
      payload={payload}
      setPayload={setPayload}
      setPage={setPage}
      page={page}
      interests={interests}
    />,
  ];
  const titles = [
    'Basic Information',
    'Your Type',
    'Choose Your Profile PIC',
    'Choose interests',
  ];
  return (
    <UserContext.Provider value={payload}>
      <EntryLayout type="signup">
        <div className="shadow-md p-12 rounded-3xl">
          <p className="text-3xl text-googleBlack font-semibold text-center mb-12">
            {titles[page]}
          </p>
          {pageToShow[page]}
        </div>
      </EntryLayout>
    </UserContext.Provider>
  );
};

export const getServerSideProps = async () => {
  const interests = await getInterests();
  if (!interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      interests: interests,
    },
  };
};

export default SignUpInfo;

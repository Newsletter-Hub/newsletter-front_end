import { getInterests } from '@/actions/user/interests';
import React, { useState } from 'react';
import { GetStaticProps } from 'next';

import { Interest } from '@/types/interests';
import { Payload } from '@/types/signup';

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
  interests?: Interest[];
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
      <div className="md:shadow-md md:p-12 rounded-3xl mt-4 md:mt-0">
        <p className="text-center mb-[2px] font-medium">Step {page + 1}/4</p>
        <p className="text-3xl text-dark-blue font-semibold text-center mb-12">
          {titles[page]}
        </p>
        {pageToShow[page]}
      </div>
    </UserContext.Provider>
  );
};

export const getStaticProps: GetStaticProps = async () => {
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

SignUpInfo.layout = 'entry';
SignUpInfo.type = 'signup';

SignUpInfo.title = 'Sign Up | Newsletter Hub';
SignUpInfo.description =
  'Sign up today to Newsletter Hub and start curating and sharing your newsletter tastes.';
export default SignUpInfo;

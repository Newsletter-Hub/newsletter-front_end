import { getUserMe } from '@/actions/user';
import { getInterests } from '@/actions/user/interests';
import { useState } from 'react';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { Interest } from '@/types/interests';
import { UserMe } from '@/types/user';

import Button from '@/components/Button';
import Edit from '@/components/Profile/Edit';
import ProfileInterests from '@/components/Profile/Interests';
import Tabs from '@/components/Tabs';

interface SettingsProps {
  user: UserMe;
  interests: Interest[];
}

const Settings = ({ user, interests }: SettingsProps) => {
  const [interestsPayload, setInterestsPayload] = useState(user.interests);

  const handleInterestClick = (item: Interest) => {
    if (interestsPayload.some(interest => interest.id === item.id)) {
      const formattedInterests = interestsPayload.filter(
        interest => interest.id !== item.id
      );
      setInterestsPayload(formattedInterests);
    } else {
      setInterestsPayload([...interestsPayload, item]);
    }
  };

  const tabs = [
    {
      title: 'Edit profile',
      value: 'edit',
      content: <Edit user={user} />,
    },
    {
      title: 'Interests',
      value: 'interests',
      content: (
        <ProfileInterests
          interests={interests}
          interestsPayload={interestsPayload}
          handleInterestClick={handleInterestClick}
        />
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'edit') {
      setInterestsPayload(user.interests);
    }
  };
  return (
    <div>
      <div className="pt-[72px] px-[17%]">
        <h1 className="text-7xl text-dark-blue font-medium mb-10">
          Account settings
        </h1>
        <Tabs tabs={tabs} handleChange={handleTabChange} />
      </div>
      <div className="w-full shadow-md pl-[17%] flex gap-12 font-inter items-center py-5">
        <span className="text-base text-dark-blue cursor-pointer">
          Reset all changes
        </span>
        <Button label="Save" rounded="xl" customStyles="max-w-[101px]" />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const user = await getUserMe({ token });
  const interests = await getInterests();
  if (!user) {
    return {
      props: {
        notFound: true,
      },
    };
  }
  return {
    props: { layoutProps: { isFooter: false }, user, interests },
  };
};

export default Settings;

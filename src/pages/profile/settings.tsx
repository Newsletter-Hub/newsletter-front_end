import { getUserMe, updateUser } from '@/actions/user';
import { getInterests } from '@/actions/user/interests';
import { useRef, useState } from 'react';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { Interest } from '@/types/interests';
import { UserMe } from '@/types/user';

import Button from '@/components/Button';
import Edit from '@/components/Profile/Edit';
import { EditProfilePayload } from '@/components/Profile/Edit';
import ProfileInterests from '@/components/Profile/Interests';
import Tabs from '@/components/Tabs';

interface SettingsProps {
  userMe: UserMe;
  interests: Interest[];
}

interface EditRefType {
  resetForm: () => void;
  submitForm: () => void;
}

const Settings = ({ userMe, interests }: SettingsProps) => {
  const [interestsPayload, setInterestsPayload] = useState(userMe.interests);
  const [user, setUser] = useState(userMe);
  const [isDirty, setIsDirty] = useState(false);
  const editRef = useRef<EditRefType | null>(null);

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

  const onEditSubmit = async (data: EditProfilePayload) => {
    const result = await updateUser({
      ...data,
      interests: user.interests && user.interests.map(item => item.id),
      type: 'update',
    });
    if (result?.response) {
      const user = await getUserMe({ token: null });
      if (user.response) {
        setUser(user.response as UserMe);
      }
    }
  };

  const resetChanges = () => {
    if (activeTab === 'edit') {
      if (editRef.current) {
        editRef.current.resetForm();
      }
    } else {
      setInterestsPayload(user.interests);
    }
  };

  const onSubmit = async () => {
    if (activeTab === 'edit') {
      if (editRef.current) {
        editRef.current.submitForm();
      }
    } else {
      const user = await updateUser({
        interests: interestsPayload.map(item => item.id),
        type: 'interests',
      });
      if (user?.response) {
        setInterestsPayload(user.response.interests);
      }
    }
  };

  const tabs = [
    {
      title: 'Edit profile',
      value: 'edit',
      content: (
        <Edit
          user={user}
          onSubmit={onEditSubmit}
          ref={editRef}
          setIsDirty={setIsDirty}
        />
      ),
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
    setIsDirty(false);
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
        <span
          className="text-base text-dark-blue cursor-pointer"
          onClick={resetChanges}
        >
          Reset all changes
        </span>
        <Button
          label="Save"
          rounded="xl"
          customStyles="max-w-[101px]"
          onClick={onSubmit}
          disabled={
            activeTab === 'edit'
              ? !isDirty
              : JSON.stringify(interestsPayload) ===
                JSON.stringify(user.interests)
          }
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const user = await getUserMe({ token });
  const interests = await getInterests();
  if (user.error) {
    return {
      props: {
        notFound: true,
      },
    };
  }
  return {
    props: {
      layoutProps: { isFooter: false },
      userMe: user.response,
      interests: interests || null,
    },
  };
};

export default Settings;

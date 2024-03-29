import { getUserMe, updateUser } from '@/actions/user';
import { getInterests } from '@/actions/user/interests';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useRef, useState } from 'react';

import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import format from 'date-fns/format';

import { Interest } from '@/types/interests';
import { User } from '@/types/user';

import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Edit from '@/components/Profile/Edit';
import { EditProfilePayload } from '@/components/Profile/Edit';
import ProfileInterests from '@/components/Profile/Interests';
import Tabs from '@/components/Tabs';
import PrivateRoute from '@/components/PrivateRoute';

interface SettingsProps {
  interests: Interest[];
}

interface EditRefType {
  resetForm: () => void;
  submitForm: () => void;
}

const Settings = ({ interests }: SettingsProps) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);
  const [interestsPayload, setInterestsPayload] = useState(
    user?.interests || []
  );
  const [isDirty, setIsDirty] = useState(false);
  const editRef = useRef<EditRefType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const date = new Date(data.dateOfBirth as string);
    const formattedUser = {
      avatar: user?.avatar,
      country: user?.country,
      state: user?.state,
      dateOfBirth: user?.dateOfBirth,
      username: user?.username,
      email: user?.email,
      profileType: user?.profileType,
      description: user?.description,
    };
    const changedFields = Object.keys(formattedUser).filter(
      key =>
        formattedUser[key as keyof typeof formattedUser] !==
        data[key as keyof typeof data]
    );
    if (!(changedFields.length === 1 && changedFields.includes('email'))) {
      setIsLoading(true);
      await updateUser({
        ...data,
        interests: user?.interests && user.interests.map(item => item.id),
        type: 'update',
        dateBirth: data.dateOfBirth && format(date, 'yyyy-MM-dd'),
      })
        .then(async res => {
          if (res) {
            const user = await getUserMe({ token: null });
            if (user.response) {
              setUser(user.response as User);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      if (data.email !== user?.email) {
        setIsVerifyEmailModalOpen(true);
      }
    } else {
      setIsVerifyEmailModalOpen(true);
    }
  };

  const resetChanges = () => {
    if (activeTab === 'edit') {
      if (!isDirty) {
        return;
      }
      if (editRef.current) {
        editRef.current.resetForm();
      }
    } else if (user) {
      if (
        JSON.stringify(interestsPayload) === JSON.stringify(user?.interests)
      ) {
        return;
      }
      setInterestsPayload(user?.interests);
    }
  };

  const onSubmit = async () => {
    if (activeTab === 'edit') {
      if (editRef.current) {
        editRef.current.submitForm();
      }
    } else {
      setIsLoading(true);
      const user = await updateUser({
        interests: interestsPayload.map(item => item.id),
        type: 'interests',
      }).finally(() => setIsLoading(false));
      if (user?.response) {
        setInterestsPayload(user.response.interests);
        const getUser = await getUserMe({ token: null });
        if (getUser.response) {
          setUser(getUser.response as User);
        }
      }
    }
  };

  const [activeTab, setActiveTab] = useState('edit');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsDirty(false);
    if (value === 'edit' && user) {
      setInterestsPayload(user.interests);
    }
  };
  const tabs = [
    {
      title: 'Edit profile',
      value: 'edit',
      content: (
        <Edit
          user={user as User}
          onSubmit={onEditSubmit}
          ref={editRef}
          setIsDirty={setIsDirty}
          isVerifyEmailModalOpen={isVerifyEmailModalOpen}
          setIsVerifyEmailModalOpen={setIsVerifyEmailModalOpen}
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

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return <Loading />;
  }
  return (
    <PrivateRoute>
      <div className="md:pt-[72px] pt-3 max-w-[1280px] px-3 mx-auto">
        <h1 className="md:text-7xl text-5xl text-dark-blue font-medium mb-10">
          Account settings
        </h1>
        <Tabs tabs={tabs} handleChange={handleTabChange} />
      </div>
      <div className="w-full shadow-md md:pl-[17%] flex justify-between px-3 md:pr-0 md:justify-normal gap-12 font-inter items-center py-5">
        <span
          className={`text-base ${
            (activeTab === 'edit'
              ? !isDirty
              : JSON.stringify(interestsPayload) ===
                JSON.stringify(user?.interests)) &&
            'text-dark-grey cursor-default hover:text-dark-grey'
          } text-dark-blue cursor-pointertransition-colors duration-200 ease-in-out hover:text-primary cursor-pointer`}
          onClick={resetChanges}
        >
          Reset all changes
        </span>
        <Button
          label="Save"
          rounded="xl"
          customStyles="w-[101px]"
          onClick={onSubmit}
          loading={isLoading}
          disabled={
            activeTab === 'edit'
              ? !isDirty
              : JSON.stringify(interestsPayload) ===
                JSON.stringify(user?.interests)
          }
        />
      </div>
    </PrivateRoute>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const interests = await getInterests();
  return {
    props: {
      layoutProps: { isFooter: false },
      interests: interests || null,
    },
  };
};
Settings.title = 'Settings | Newsletter Hub';
Settings.description = 'View and change your settings on Newsletter Hub.';
export default Settings;

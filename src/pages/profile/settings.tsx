import { getUserMe } from '@/actions/user';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { UserMe } from '@/types/user';

import Button from '@/components/Button';
import Edit from '@/components/Profile/Edit';
import Tabs from '@/components/Tabs';

interface SettingsProps {
  user: UserMe;
}

const Settings = ({ user }: SettingsProps) => {
  const tabs = [
    {
      title: 'Edit profile',
      value: 'edit',
      content: <Edit user={user} />,
    },
    {
      title: 'Interests',
      value: 'interests',
      content: <div></div>,
    },
  ];
  return (
    <div>
      <div className="pt-[72px] px-[17%]">
        <h1 className="text-7xl text-dark-blue font-medium mb-10">
          Account settings
        </h1>
        <Tabs tabs={tabs} />
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
  if (!user) {
    return {
      props: {
        notFound: true,
      },
    };
  }
  return {
    props: { layoutProps: { isFooter: false }, user },
  };
};

export default Settings;

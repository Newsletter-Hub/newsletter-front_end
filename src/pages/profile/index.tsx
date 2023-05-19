import { getNewslettersList } from '@/actions/newsletters';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import UserPage from '@/components/User/UserPage';

interface ProfilePageProps {
  newslettersListData: NewslettersListData;
}

const ProfilePage = ({ newslettersListData }: ProfilePageProps) => {
  const [user, setUser] = useState<UserMe | ''>('');

  useEffect(() => {
    const cookieUser = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : '';
    setUser(cookieUser);
  }, []);
  return (
    <UserPage user={user as UserMe} newslettersListData={newslettersListData} />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
  });
  if (!newsletterList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
    },
  };
};

export default ProfilePage;

import { getNewslettersList } from '@/actions/newsletters';
import { useUser } from '@/contexts/UserContext';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import UserPage from '@/components/User/UserPage';

interface ProfilePageProps {
  newslettersListData: NewslettersListData;
}

const ProfilePage = ({ newslettersListData }: ProfilePageProps) => {
  const { user } = useUser();
  return (
    <UserPage user={user as UserMe} newslettersListData={newslettersListData} />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const cookies = parseCookies(context);
  const user = cookies.user as UserMe | undefined;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const authorId = user && user.id ? +user.id : undefined;
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
    authorId,
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

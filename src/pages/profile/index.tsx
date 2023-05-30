import { getMySubscriptions, getNewslettersList } from '@/actions/newsletters';
import { useUser } from '@/contexts/UserContext';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import UserPage from '@/components/User/UserPage';

interface ProfilePageProps {
  newslettersListData: NewslettersListData;
  followingNewsletterListData: NewslettersListData;
}

const ProfilePage = ({
  newslettersListData,
  followingNewsletterListData,
}: ProfilePageProps) => {
  const { user } = useUser();
  return (
    <UserPage
      user={user as UserMe}
      newslettersListData={newslettersListData}
      followingNewsletterListData={followingNewsletterListData}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const cookies = parseCookies(context);
  const user = cookies.user as UserMe | undefined;
  const token = cookies.accessToken ? cookies.accessToken : null;
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
  const followingNewsletterList = await getMySubscriptions({
    entity: 'Newsletter',
    page: 1,
    pageSize: 6,
    token,
  });
  if (!newsletterList || !followingNewsletterList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      followingNewsletterListData:
        followingNewsletterList.newslettersListData || null,
    },
  };
};

export default ProfilePage;

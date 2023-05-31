import { getMySubscriptions, getNewslettersList } from '@/actions/newsletters';
import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';
import { useUser } from '@/contexts/UserContext';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import UserPage from '@/components/User/UserPage';

interface ProfilePageProps {
  newslettersListData: NewslettersListData;
  followingNewsletterListData: NewslettersListData;
  notificationsData: NotificationData;
}

const ProfilePage = ({
  newslettersListData,
  followingNewsletterListData,
  notificationsData,
}: ProfilePageProps) => {
  const { user } = useUser();
  return (
    <UserPage
      notificationsData={notificationsData}
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
  if (!user) {
    return {
      redirect: {
        destination: '/sign-up',
        permanent: false,
      },
    };
  }
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
  const notificationsList = await getNotifications({
    notificationRecipientId: authorId,
    isOwnAccount: true,
    page: 1,
    pageSize: 6,
    token,
  });
  if (!newsletterList || !followingNewsletterList || !notificationsList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      followingNewsletterListData:
        followingNewsletterList.newslettersListData || null,
      notificationsData: notificationsList.notificationsData,
    },
  };
};

export default ProfilePage;

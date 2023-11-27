import { getNewslettersList } from '@/actions/newsletters';
import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import UserPage from '@/components/User/UserPage';
import { getUserById } from '@/actions/user';

interface UserPageProps {
  newslettersListData: NewslettersListData;
  notificationsData: NotificationData;
  user: User;
}

const ProfilePage = ({
  newslettersListData,
  notificationsData,
  user,
}: UserPageProps) => {
  return (
    <UserPage
      notificationsData={notificationsData}
      user={user}
      newslettersListData={newslettersListData}
      isProfile={false}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const cookies = parseCookies(context);
  const id = context.query.userId;
  const token = cookies.accessToken ? cookies.accessToken : null;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const userId = id ? +id : undefined;
  const user = await getUserById({ token, userId });
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'date',
    orderDirection: 'DESC',
    categoriesIds,
    authorId: userId,
    token,
  });
  const notificationsList = await getNotifications({
    notificationRecipientId: userId,
    isOwnAccount: false,
    page: 1,
    pageSize: 6,
    token,
  });
  if (!newsletterList || !notificationsList || !user || user.error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      notificationsData: notificationsList.notificationsData,
      user: user.response,
    },
  };
};

export default ProfilePage;

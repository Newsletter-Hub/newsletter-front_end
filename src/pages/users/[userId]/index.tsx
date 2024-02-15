import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { User } from '@/types/user';

import UserPage from '@/components/User/UserPage';
import { getUserById } from '@/actions/user';

interface UserPageProps {
  notificationsData: NotificationData;
  user: User;
}

const ProfilePage = ({ notificationsData, user }: UserPageProps) => {
  return (
    <UserPage
      notificationsData={notificationsData}
      user={user}
      isProfile={false}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const id = context.query.userId;
  const token = cookies.accessToken ? cookies.accessToken : null;
  const userId = id ? +id : undefined;
  const notificationsList = await getNotifications({
    notificationRecipientId: userId,
    isOwnAccount: false,
    page: 1,
    pageSize: 6,
    token,
  });
  const user = await getUserById({ token, userId });
  if (!notificationsList || !user || user.error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      notificationsData: notificationsList.notificationsData,
      user: user.response,
    },
  };
};

export default ProfilePage;

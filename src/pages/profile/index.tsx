import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';
import { useUser } from '@/contexts/UserContext';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import UserPage from '@/components/User/UserPage';
import PrivateRoute from '@/components/PrivateRoute';
import { getUserMe } from '@/actions/user';

interface ProfilePageProps {
  newslettersListData: NewslettersListData;
  followingNewsletterListData: NewslettersListData;
  notificationsData: NotificationData;
  userMe: User;
}

const ProfilePage = ({
  newslettersListData,
  followingNewsletterListData,
  notificationsData,
  userMe,
}: ProfilePageProps) => {
  return (
    <PrivateRoute>
      <UserPage
        notificationsData={notificationsData}
        user={userMe}
        newslettersListData={newslettersListData}
        followingNewsletterListData={followingNewsletterListData}
      />
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const user = cookies.user as User | undefined;
  const token = cookies.accessToken ? cookies.accessToken : null;
  const authorId = user && user.id ? +user.id : undefined;
  if (!user) {
    return {
      redirect: {
        destination: '/sign-up',
        permanent: false,
      },
    };
  }
  const notificationsList = await getNotifications({
    notificationRecipientId: authorId,
    isOwnAccount: true,
    page: 1,
    pageSize: 6,
    token,
  });

  let userMe = null;
  if (token) {
    userMe = await getUserMe({ token });
  }
  if (!notificationsList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      notificationsData: notificationsList.notificationsData,
      userMe: userMe?.response,
    },
  };
};

export default ProfilePage;

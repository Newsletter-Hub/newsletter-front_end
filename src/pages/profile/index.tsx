import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import UserPage from '@/components/User/UserPage';
import PrivateRoute from '@/components/PrivateRoute';
import { getUserMe } from '@/actions/user';
import { getUserSubscription } from '@/actions/paymentSubscription';
import { GetUserSubscriptionResponse } from '@/types/paymentSubscription.type';

interface ProfilePageProps {
  followingNewsletterListData: NewslettersListData;
  notificationsData: NotificationData;
  userMe: User;
  subscription: GetUserSubscriptionResponse | null;
}

const ProfilePage = ({
  followingNewsletterListData,
  notificationsData,
  userMe,
  subscription,
}: ProfilePageProps) => {
  return (
    <PrivateRoute>
      <UserPage
        notificationsData={notificationsData}
        user={userMe}
        followingNewsletterListData={followingNewsletterListData}
        subscription={subscription}
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
  let subscription = null;
  if (token) {
    userMe = await getUserMe({ token });
    subscription = await getUserSubscription({ token });
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
      subscription,
    },
  };
};
ProfilePage.title = 'Profile | Newsletter Hub';
ProfilePage.description = 'Edit your profile on Newsletter Hub.';
export default ProfilePage;

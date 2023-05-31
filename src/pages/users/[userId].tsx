import { getNewslettersList } from '@/actions/newsletters';
import {
  NotificationData,
  getNotifications,
} from '@/actions/user/notifications';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import UserPage from '@/components/User/UserPage';
import { getUserById } from '@/actions/user';

interface UserPageProps {
  newslettersListData: NewslettersListData;
  notificationsData: NotificationData;
  user: UserMe;
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
  const userMe = cookies.user as UserMe | undefined;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const userId = id ? +id : undefined;
  const myId = userMe && userMe.id ? +userMe.id : undefined;
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'date',
    orderDirection: 'DESC',
    categoriesIds,
    authorId: userId,
    myId,
  });
  const notificationsList = await getNotifications({
    notificationRecipientId: userId,
    isOwnAccount: false,
    page: 1,
    pageSize: 6,
    token,
  });
  const user = await getUserById({ token, userId });
  if (!newsletterList || !notificationsList || !user) {
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

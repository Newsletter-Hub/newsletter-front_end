import { NotificationData } from '@/actions/user/notifications';
import Button from '../Button';

import Link from 'next/link';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import BookmarkIcon from '@/assets/icons/bookmark';
import EditIcon from '@/assets/icons/edit';

import Avatar from '../Avatar';
import Notification from '../Notification';
import { useState } from 'react';
import { getNotifications } from '@/actions/user/notifications';
import { useRouter } from 'next/router';

interface UserPageProps {
  newslettersListData: NewslettersListData;
  followingNewsletterListData?: NewslettersListData;
  user: User;
  isProfile?: boolean;
  notificationsData: NotificationData;
}

const UserPage = ({
  user,
  isProfile = true,
  notificationsData,
}: UserPageProps) => {
  const [notificationsInfo, setNotificationsInfo] = useState(notificationsData);
  const [page, setPage] = useState(1);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationRecipientId = user && user.id ? +user.id : undefined;
  const router = useRouter();
  const loadMore = async () => {
    setNotificationLoading(true);
    setPage(prevPage => prevPage + 1);

    const response = await getNotifications({
      page: 1,
      pageSize: 5 * (page + 1),
      isOwnAccount: isProfile,
      notificationRecipientId,
    }).finally(() => setNotificationLoading(false));

    if (response.notificationsData) {
      setNotificationsInfo(response.notificationsData);
    }
  };
  // const tabs = [
  //   {
  //     title: 'Your Newsletters',
  //     value: 'userNewsletters',
  //     content: (
  //       <UserNewsletters
  //         newslettersListData={newslettersListData}
  //         isProfile={isProfile}
  //         user={user}
  //       />
  //     ),
  //   },
  //   {
  //     title: 'Newsletters Following',
  //     value: 'followngNewsletters',
  //     content: (
  //       <FollowingNewsletters
  //         newslettersListData={followingNewsletterListData}
  //         isProfile={isProfile}
  //       />
  //     ),
  //   },
  // ];
  return (
    <div className="bg-profile bg-cover bg-no-repeat bg-top w-screen pt-20 flex flex-col items-center">
      {user && (
        <>
          <Avatar
            src={user.avatar}
            width={252}
            height={252}
            alt="User avatar"
            className="rounded-full min-h-[252px] object-cover border-[7px] border-primary mb-8"
            username={user.username}
            size="xl"
          />
          <h1 className="text-dark-blue text-5xl font-medium">
            {user.username}
          </h1>
          {user.profileType && isProfile && (
            <p className="mb-[4px] font-inter text-dark-grey text-lg">
              (
              {user.profileType.charAt(0).toUpperCase() +
                user.profileType.slice(1)}
              )
            </p>
          )}
          <div className="text-center flex flex-wrap justify-center">
            <p className="font-inter text-dark-grey text-sm mb-8 max-w-[512px] px-3">
              {user.description}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-6 gap-2 text-sm font-semibold font-inter items-center text-dark-grey mb-8">
            {user.amountUserFollowers > 0 ? (
              <Link href={`${router.asPath}/followers`}>
                {user.amountUserFollowers} Follower
                {user.amountUserFollowers !== 1 && 's'}
              </Link>
            ) : (
              <div>{user.amountUserFollowers} Followers</div>
            )}
            <div className="w-1.5 h-1.5 bg-light-grey rounded-full hidden md:block"></div>
            {user.amountUserFollowing > 0 ? (
              <Link href={`${router.asPath}/users-following`}>
                {user.amountUserFollowing} User
                {user.amountUserFollowing !== 1 && 's'} Following
              </Link>
            ) : (
              <div>
                {user.amountUserFollowing} User
                {user.amountUserFollowing !== 1 && 's'} Following
              </div>
            )}
            <div className="w-1.5 h-1.5 bg-light-grey rounded-full hidden md:block"></div>
            {user.amountFollowingNewsletters > 0 ? (
              <Link href={`${router.asPath}/newsletters-following`}>
                {user.amountFollowingNewsletters} Newsletter
                {user.amountFollowingNewsletters > 1 && 's'} Following
              </Link>
            ) : (
              <div>
                {user.amountFollowingNewsletters} Newsletter
                {user.amountFollowingNewsletters > 1 && 's'} Following
              </div>
            )}
          </div>
          {isProfile && (
            <div className="flex gap-8 items-center mb-[88px]">
              <Link href="profile/settings" className="flex items-center gap-2">
                <EditIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue transition-colors duration-200 ease-in-out hover:text-primary hover:border-b-primary">
                  Edit a profile
                </span>
              </Link>
              <Link
                href="profile/bookmarks"
                className="flex items-center gap-2"
              >
                <BookmarkIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue transition-colors duration-200 ease-in-out hover:text-primary hover:border-b-primary">
                  Bookmarks
                </span>
              </Link>
            </div>
          )}
        </>
      )}
      <div className="max-w-[1280px] px-5 w-full">
        {/* {isProfile ? (
          <div className="mb-[88px]">
            <Tabs tabs={tabs} />
          </div>
        ) : (
          <UserNewsletters
            newslettersListData={newslettersListData}
            isProfile={isProfile}
            user={user}
          />
        )} */}
        {Boolean(notificationsInfo.total) && (
          <>
            <h3 className="font-medium text-5xl text-dark-blue mb-10">
              Recent Activities
            </h3>
            <div className="flex flex-col">
              {notificationsInfo.notifications.map((notification, index) => (
                <Notification
                  isProfile={isProfile}
                  key={notification.id}
                  notification={notification}
                  isLast={Boolean(
                    notificationsInfo.notifications.length === index + 1
                  )}
                />
              ))}
              {notificationsInfo.nextPage && (
                <Button
                  label="See More"
                  variant="outlined-secondary"
                  size="full"
                  rounded="xl"
                  bold
                  onClick={loadMore}
                  loading={notificationLoading}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;

import { NotificationData } from '@/actions/user/notifications';
import Button from '../Button';

import Link from 'next/link';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import BookmarkIcon from '@/assets/icons/bookmark';
import EditIcon from '@/assets/icons/edit';

import Avatar from '../Avatar';
import Notification from '../Notification';
import FollowingNewsletters from '../Profile/FollowingNewsletters';
import UserNewsletters from '../Profile/UserNewsletters';
import Tabs from '../Tabs';
import { useState } from 'react';
import { getNotifications } from '@/actions/user/notifications';

interface UserPageProps {
  newslettersListData: NewslettersListData;
  followingNewsletterListData?: NewslettersListData;
  user: UserMe;
  isProfile?: boolean;
  notificationsData: NotificationData;
}

const UserPage = ({
  user,
  newslettersListData,
  followingNewsletterListData,
  isProfile = true,
  notificationsData,
}: UserPageProps) => {
  const [notificationsInfo, setNotificationsInfo] = useState(notificationsData);
  const [page, setPage] = useState(1);
  const notificationRecipientId = user.id ? +user.id : undefined;
  const loadMore = async () => {
    setPage(prevPage => prevPage + 1);

    const response = await getNotifications({
      page: 1,
      pageSize: 5 * (page + 1),
      isOwnAccount: true,
      notificationRecipientId,
    });

    if (response.notificationsData) {
      setNotificationsInfo(response.notificationsData);
    }
  };
  const tabs = [
    {
      title: `${
        isProfile ? 'Your Newsletters' : `${user.username} Newsletters`
      }`,
      value: 'userNewsletters',
      content: (
        <UserNewsletters
          newslettersListData={newslettersListData}
          isProfile={isProfile}
          user={user}
        />
      ),
    },
    {
      title: 'Newsletters Following',
      value: 'followngNewsletters',
      content: (
        <FollowingNewsletters
          newslettersListData={followingNewsletterListData}
          isProfile={isProfile}
        />
      ),
    },
  ];
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
          <p className="text-center max-w-[512px] font-inter text-dark-grey text-sm mb-8">
            {user.description}
          </p>
          <div className="flex gap-6 text-sm font-semibold font-inter items-center text-dark-grey mb-8">
            <span>{user.amountUserFollowers} Followers</span>
            <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
            <span>{user.amountUserFollowing} Following</span>
          </div>
          {isProfile && (
            <div className="flex gap-8 items-center mb-[88px]">
              <Link href="profile/settings" className="flex items-center gap-2">
                <EditIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue">
                  Edit a profile
                </span>
              </Link>
              <Link
                href="profile/bookmarks"
                className="flex items-center gap-2"
              >
                <BookmarkIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue">
                  Bookmarks
                </span>
              </Link>
            </div>
          )}
        </>
      )}
      <div className="max-w-[1280px] px-[10%] w-full">
        <div className="mb-[88px]">
          <Tabs tabs={tabs} />
        </div>
        {notificationsInfo.total && (
          <>
            <h3 className="font-medium text-5xl text-dark-blue mb-10">
              Recent Activities
            </h3>
            <div className="flex flex-col gap-6">
              {notificationsInfo.notifications.map(notification => (
                <Notification
                  key={notification.id}
                  notificationAuthor={notification.notificationAuthor}
                  notificationType={notification.notificationType}
                  entity={notification.entity}
                  entityType={notification.entityType}
                  notificationAuthorId={notification.notificationAuthorId}
                  notificationRecipientId={notification.notificationRecipientId}
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

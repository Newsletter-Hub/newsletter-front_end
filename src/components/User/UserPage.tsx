import { NotificationData } from '@/actions/user/notifications';
import { follow, unfollow } from '@/actions/newsletters';
import { getUserById } from '@/actions/user';
import Button from '../Button';

import Link from 'next/link';

import { useUser } from '@/contexts/UserContext';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';
import { FollowingPayload } from '@/types';

import BookmarkIcon from '@/assets/icons/bookmark';
import EditIcon from '@/assets/icons/edit';
import PlusIcon from '@/assets/icons/plus';
import VerifiedWithTooltip from '../VerifiedWithTooltip';

import { setRedirectPath } from '@/helpers/redirectPathLocalStorage';

import Avatar from '../Avatar';
import Notification from '../Notification';
import { useState } from 'react';
import { getNotifications } from '@/actions/user/notifications';
import { useRouter } from 'next/router';

interface UserPageProps {
  followingNewsletterListData?: NewslettersListData;
  user: User;
  isProfile?: boolean;
  notificationsData: NotificationData;
}

const UserPage = ({
  user: userFromProps,
  isProfile: isProfileFromProps = true,
  notificationsData,
}: UserPageProps) => {
  const [user, setUser] = useState(userFromProps);
  const [notificationsInfo, setNotificationsInfo] = useState(notificationsData);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const notificationRecipientId = user && user.id ? +user.id : undefined;
  const router = useRouter();
  const currentUser = useUser().user;
  const isProfile = isProfileFromProps || user.id === currentUser?.id;
  const loadMore = async () => {
    setNotificationLoading(true);
    const nextPage = notificationsData.nextPage;
    if (nextPage == null) return;

    const response = await getNotifications({
      page: nextPage,
      pageSize: 6,
      isOwnAccount: isProfile,
      notificationRecipientId,
    }).finally(() => setNotificationLoading(false));
    const prevNotifications = notificationsInfo.notifications;
    if (response.notificationsData) {
      const newNotifications = response.notificationsData.notifications;
      setNotificationsInfo({
        ...response.notificationsData,
        notifications: prevNotifications
          ? prevNotifications.concat(newNotifications)
          : newNotifications,
      });
    }
  };

  const handleFollow = async ({ entityId, followed }: FollowingPayload) => {
    if (!currentUser) {
      const storedRedirectPath = `/users/${entityId}`;
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    } else {
      setFollowLoading(true);
      if (followed) {
        const response = await unfollow({ entityId, entityType: 'User' });
        if (response?.ok) {
          const getUserMeResponse = await getUserById({
            userId: entityId,
          }).finally(() => setFollowLoading(false));
          if (getUserMeResponse.response) {
            setUser(getUserMeResponse.response);
          }
        } else {
          setFollowLoading(false);
        }
      } else {
        const response = await follow({ entityId, entityType: 'User' });
        if (response?.ok) {
          const getUserMeResponse = await getUserById({
            userId: entityId,
          }).finally(() => setFollowLoading(false));
          if (getUserMeResponse.response) {
            setUser(getUserMeResponse.response);
          }
        } else {
          setFollowLoading(false);
        }
      }
    }
  };

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
          <div className="flex flex-row items-center">
            <h1 className="text-dark-blue text-5xl font-medium">
              {user.username}
            </h1>
            {user.isVerifiedOwner && (
              <VerifiedWithTooltip tooltipText="User is a verified newsletter owner" />
            )}
          </div>
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
              <Link
                href="/profile/settings"
                className="flex items-center gap-2"
              >
                <EditIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue transition-colors duration-200 ease-in-out hover:text-primary hover:border-b-primary">
                  Edit profile
                </span>
              </Link>
              <Link
                href="/profile/bookmarks"
                className="flex items-center gap-2"
              >
                <BookmarkIcon />
                <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue transition-colors duration-200 ease-in-out hover:text-primary hover:border-b-primary">
                  Bookmarks
                </span>
              </Link>
            </div>
          )}
          {!isProfile && (
            <Button
              rounded="xl"
              fontSize="md"
              height="sm"
              customStyles="w-full sm:w-fit"
              loading={followLoading}
              onClick={() =>
                handleFollow({
                  entityId: user.id,
                  followed: user.followed,
                })
              }
              variant={user.followed ? 'outlined-secondary' : 'primary'}
              label={
                user.followed ? (
                  'Following'
                ) : (
                  <span className="flex items-center gap-2">
                    <PlusIcon />
                    Follow
                  </span>
                )
              }
            />
          )}
        </>
      )}
      <div className="max-w-[1280px] px-5 w-full">
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

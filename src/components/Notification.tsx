import Link from 'next/link';

import { Notification as NotificationType } from '@/types/user';
import { format, parseISO } from 'date-fns';

import Avatar from './Avatar';
import StarRating from './StarRating';
import { useUser } from '@/contexts/UserContext';
import VerifiedWithTooltip from './VerifiedWithTooltip';

interface NotificationProps {
  notification: NotificationType;
  isProfile?: boolean;
  isLast: boolean;
}

const Notification = ({
  notification,
  isProfile,
  isLast,
}: NotificationProps) => {
  const userState =
    notification.notificationAuthorId ===
      notification.notificationRecipientId && isProfile ? (
      'You'
    ) : (
      <div className="flex flex-row">
        <Link
          href={`/users/${notification.notificationAuthorId}`}
          className="max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] md:max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis block"
        >
          {notification.notificationAuthor?.username}
        </Link>
        {notification.notificationAuthor?.isVerified && <VerifiedWithTooltip />}
      </div>
    );
  const { user } = useUser();
  return (
    <div
      className={`flex justify-between md:items-center py-4 font-inter flex-col md:flex-row ${
        !isLast && 'border-b border-b-light-grey'
      }`}
    >
      <div className="flex items-center gap-8">
        <Avatar
          src={notification.notificationAuthor?.avatar}
          width={48}
          height={48}
          alt="Notification author"
          username={notification.notificationAuthor?.username}
          className="h-[48px] object-cover"
        />
        {notification.notificationType === 'newNewsletter' &&
          notification.entity && (
            <div className="text-base text-dark-grey flex md:items-center gap-4 flex-col md:flex-row">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="text-dark-blue font-semibold text-base whitespace-nowrap overflow-hidden text-ellipsis">
                  {userState}
                </div>
                <span>added the</span>
              </div>
              <Link
                href={`/newsletters/${notification.entity?.id}`}
                className="text-primary font-semibold block md:max-w-[400px] max-w-[200px] xl:max-w-[700px] lg:max-w-[550px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ease-in-out hover:text-dark-blue"
              >
                {'title' in notification.entity && notification.entity.title}
              </Link>
            </div>
          )}
        {notification.notificationType === 'newReview' &&
          notification.entity && (
            <div>
              <div className="text-base text-dark-grey flex lg:items-center gap-4 mb-[6px] flex-col lg:flex-row">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="text-dark-blue font-semibold text-base">
                    {userState}
                  </div>
                  <span>rated</span>
                  {'newsletter' in notification.entity && (
                    <Link
                      href={`/newsletters/${notification.entity.newsletter.id}`}
                      className="text-primary font-semibold block md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ease-in-out hover:text-dark-blue"
                    >
                      {notification.entity.newsletter.title}
                    </Link>
                  )}
                </div>
                {'rating' in notification.entity && (
                  <StarRating
                    value={notification.entity.rating}
                    readonly
                    customStyles="lg:ml-4 md:mb-2 lg:mb-0"
                  />
                )}
              </div>
              <p className="text-dark-blue text-base pt-3 md:pt-0">
                “
                {'comment' in notification.entity &&
                  notification.entity.comment}
                “
              </p>
            </div>
          )}
        {notification.notificationType === 'subscriptionToUser' &&
          notification.entity && (
            <div className="flex gap-4 md:items-center flex-col md:flex-row">
              <div className="text-dark-blue font-semibold text-base">
                <div className="flex flex-row">
                  <Link
                    href={`/users/${notification.notificationAuthorId}`}
                    className="max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] md:max-w-[200px] lg:max-w-[400px] xl:max-w-[700px] overflow-hidden whitespace-nowrap text-ellipsis block"
                  >
                    {notification.notificationAuthor?.username ===
                    user?.username
                      ? 'You'
                      : notification.notificationAuthor?.username}
                  </Link>
                  {notification.notificationAuthor?.username !==
                    user?.username &&
                    user?.isVerified && <VerifiedWithTooltip />}
                </div>
              </div>
              <span className="text-base text-dark-grey flex flex-row">
                {user && user.id === notification.notificationRecipientId
                  ? 'started following you'
                  : 'started following'}
                {(!user ||
                  (user &&
                    user.id !== notification.notificationRecipientId)) && (
                  <div className="flex flex-row">
                    <Link
                      href={`/users/${notification.notificationRecipientId}`}
                    >
                      &nbsp;
                      {'username' in notification.entity &&
                        notification.entity.username}
                    </Link>
                    {user?.isVerified && <VerifiedWithTooltip />}
                  </div>
                )}
              </span>
            </div>
          )}
        {notification.notificationType === 'subscriptionToNewsletter' &&
          notification.entity && (
            <div className="flex gap-4 md:items-center flex-col md:flex-row">
              <div className="text-dark-blue font-semibold text-base">
                {userState}
              </div>
              <span className="text-base text-dark-grey">
                started following
              </span>
              <Link
                href={`/newsletters/${notification.entity?.id}`}
                className="text-primary font-semibold block md:max-w-[220px] lg:max-w-[450px] max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] xl:max-w-[700px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ease-in-out hover:text-dark-blue"
              >
                {'title' in notification.entity && notification.entity.title}
              </Link>
            </div>
          )}
      </div>
      <span className="text-sm text-grey w-full md:w-fit text-end mt-4 md:mt-0">
        {format(parseISO(notification.createdAt as string), 'dd.MM.yyyy')}
      </span>
    </div>
  );
};

export default Notification;

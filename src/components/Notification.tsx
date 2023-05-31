import Link from 'next/link';

import { Notification as NotificationType } from '@/types/user';

import Avatar from './Avatar';
import StarRating from './StarRating';
import Button from './Button';
import PlusIcon from '@/assets/icons/plus';

const Notification = ({ ...notification }: NotificationType) => {
  const userState =
    notification.notificationAuthorId ===
    notification.notificationRecipientId ? (
      'You'
    ) : (
      <Link
        href={`users/${notification.notificationAuthorId}`}
        className="hover:text-primary"
      >
        {notification.notificationAuthor?.username}
      </Link>
    );
  return (
    <div className="flex py-4 items-center gap-8 font-inter">
      <Avatar
        src={notification.notificationAuthor?.avatar}
        width={48}
        height={48}
        alt="Notification author"
        username={notification.notificationAuthor?.username}
      />
      {notification.notificationType === 'newNewsletter' &&
        notification.entity && (
          <div className="text-base text-dark-grey flex items-center gap-4">
            <div className="text-dark-blue font-semibold text-base">
              {userState}
            </div>
            <span>created the &nbsp;</span>
            <Link
              href={`newsletters/${notification.entity?.id}`}
              className="text-primary font-semibold block max-w-[550px] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {'title' in notification.entity && notification.entity.title}
            </Link>
          </div>
        )}
      {notification.notificationType === 'newReview' && notification.entity && (
        <div>
          <div className="text-base text-dark-grey flex items-center gap-4 mb-[6px]">
            <div className="text-dark-blue font-semibold text-base">
              {userState}
            </div>
            <span>
              rated{' '}
              {notification.notificationAuthorId !==
              notification.notificationRecipientId
                ? 'your'
                : notification.notificationAuthor?.username}{' '}
              &nbsp;
            </span>
            <Link
              href={`newsletters/${notification.entity?.id}`}
              className="text-primary font-semibold block max-w-[550px] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {'newsletter' in notification.entity &&
                notification.entity.newsletter.title}
            </Link>
            {'rating' in notification.entity && (
              <StarRating
                value={notification.entity.rating}
                readonly
                customStyles="ml-4"
              />
            )}
          </div>
          <p className="text-dark-blue text-base">
            “{'comment' in notification.entity && notification.entity.comment}“
          </p>
        </div>
      )}
      {notification.notificationType === 'subscriptionToUser' &&
        notification.entity && (
          <div className="flex gap-4 items-center">
            <div className="text-dark-blue font-semibold text-base">
              {userState}
            </div>
            <span className="text-base text-dark-grey">
              started following you
            </span>
            <Link href={`users/${notification.notificationAuthorId}`}>
              <Button
                rounded="xl"
                label={
                  <p className="flex items-center gap-2">
                    <PlusIcon />
                    <span className="text-base">Follow back</span>
                  </p>
                }
              />
            </Link>
          </div>
        )}
      {notification.notificationType === 'subscriptionToNewsletter' &&
        notification.entity && (
          <div className="flex gap-4 items-center">
            <div className="text-dark-blue font-semibold text-base">
              {userState}
            </div>
            <span className="text-base text-dark-grey">
              started following your
            </span>
            <Link
              href={`newsletters/${notification.entity?.id}`}
              className="text-primary font-semibold block max-w-[550px] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {'title' in notification.entity && notification.entity.title}
            </Link>
          </div>
        )}
    </div>
  );
};

export default Notification;
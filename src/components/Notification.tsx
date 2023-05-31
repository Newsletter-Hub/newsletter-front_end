import { Notification } from '@/types/user';
import Avatar from './Avatar';
import Link from 'next/link';

const Notification = ({ ...notification }: Notification) => {
  return (
    <div className="flex py-4 items-center gap-8 font-inter">
      <Avatar
        src={notification.notificationAuthor?.avatar}
        width={48}
        height={48}
        alt="Notification author"
        username={notification.notificationAuthor?.username}
      />
      <div className="flex items-center gap-4">
        <div className="text-dark-blue font-semibold text-base">
          <span>
            {notification.notificationAuthorId ===
            notification.notificationRecipientId
              ? 'You'
              : notification.notificationAuthor?.username}
          </span>
        </div>
        {notification.notificationType === 'newNewsletter' &&
          notification.entity && (
            <div className="text-base text-dark-grey flex items-center">
              <span>created the &nbsp;</span>
              <Link
                href={`newsletter/${notification.entity?.id}`}
                className="text-primary font-semibold block max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {'title' in notification.entity && notification.entity.title}
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default Notification;

import { Interest } from './interests';
import { NewsletterData, Review } from './newsletters';

export interface User {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
  averageUserRating: number;
  amountUserRatings: number;
  description?: string;
  amountUserFollowers: number;
}

export interface UserMe {
  id?: string;
  email: string;
  username: string;
  interests: Interest[];
  profileType: 'reader' | 'writter';
  avatar: string;
  dateOfBirth: string;
  country: string;
  state: string;
  description?: string;
  googleId: number | null;
  amountUserFollowers: number;
  amountUserFollowing: number;
}

export interface Notification {
  id?: number;
  entityId?: number;
  entityType?: 'newsletter' | 'user';
  notificationType?:
    | 'newNewsletter'
    | 'newReview'
    | 'subscriptionToUser'
    | 'subscriptionToNewsletter';
  notificationRecipientId?: number;
  notificationAuthorId?: number;
  notificationAuthor?: UserMe;
  entity?: UserMe | Review | NewsletterData;
  createdAt?: string;
}

import { Interest } from './interests';
import { NewsletterData, Review } from './newsletters';

export interface User {
  id: number;
  email: string;
  username: string;
  interests: Interest[];
  profileType: 'reader' | 'writer';
  avatar: string;
  dateOfBirth: string;
  country: string;
  state: string;
  description?: string;
  googleId: number | null;
  amountUserFollowers: number;
  amountUserFollowing: number;
  amountFollowingNewsletters: number;
  followed: boolean;
  isVip?: boolean;
  isVerified?: boolean;
}

export interface UserList {
  users: User[];
  total: number;
  nextPage: number;
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
  notificationAuthor?: User;
  entity?: User | Review | NewsletterData;
  createdAt?: string;
}

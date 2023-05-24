import { Interest } from './interests';

export interface User {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
  averageUserRating: number;
  amountUserRatings: number;
}

export interface UserMe {
  email: string;
  username: string;
  interests: Interest[];
  profileType: 'reader' | 'writter';
  avatar: string;
  dateOfBirth: string;
  country: string;
  state: string;
  description?: string;
}

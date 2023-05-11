export interface User {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
  averageUserRating: number;
  amountUserRatings: number;
}

export interface UserMe {
  profileType: 'writter' | 'reader';
  username: string;
  email: string;
  avatar?: string;
}

export interface User {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
}

export interface UserMe {
  profileType: 'writter' | 'reader';
  username: string;
  email: string;
  avatar?: string;
}

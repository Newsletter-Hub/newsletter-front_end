import { publicApi } from '@/config/ky';

interface User {
  email: string;
  password: string;
}

export const login = async ({ email, password }: User) => {
  const response = await publicApi
    .post('auth/sign-in', { json: { email, password } })
    .json();
  return response;
};

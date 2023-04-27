import { publicApi } from '@/config/ky';
import { NextRouter } from 'next/router';

interface User {
  email: string;
  password: string;
  router: NextRouter;
}

export const login = async ({ email, password, router }: User) => {
  try {
    const response = await publicApi
      .post('auth/sign-in', { json: { email, password } })
      .json()
      .then(() => router.push('/'));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const googleAuth = async ({ token }: { token: string }) => {
  try {
    const response = await publicApi
      .post('auth/google', { json: { token } })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

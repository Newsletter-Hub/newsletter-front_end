import { NextRouter } from 'next/router';

import api from '@/config/ky';

interface User {
  email: string;
  password: string;
  router: NextRouter;
}

interface GoogleAuth {
  token: string;
  router: NextRouter;
}

interface SignupUser extends User {
  username: string;
}

export const login = async ({ email, password, router }: User) => {
  try {
    const response = await api
      .post('auth/sign-in', { json: { email, password } })
      .json()
      .then(() => router.push('/'));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const googleAuth = async ({ token, router }: GoogleAuth) => {
  try {
    const response = await api
      .post('auth/google', { json: { token } })
      .json()
      .then(() => router.push('/'));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const signup = async ({
  email,
  password,
  username,
  router,
}: SignupUser) => {
  try {
    const response = await api
      .post('auth/sign-up', {
        json: { email, password, username },
      })
      .json()
      .then(() => router.push('/sign-up/verify-email'));
    return response;
  } catch (error) {
    console.log(error);
  }
};

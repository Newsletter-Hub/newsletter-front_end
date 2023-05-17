import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';

import { NextRouter } from 'next/router';
import { NextResponse } from 'next/server';

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

interface UserResponse {
  profilyType: string;
  username: string;
  avatar: string;
}

export const login = async ({ email, password, router }: User) => {
  try {
    const response = await api
      .post('auth/sign-in', {
        json: { email, password },
      })
      .json()
      .then(res => {
        Cookies.set('user', JSON.stringify(res), { expires: 1 });
        router.push('/');
      });
    return response;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to login');
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
}: SignupUser): Promise<NextResponse | undefined> => {
  try {
    const response = await api.post('auth/sign-up', {
      json: { email, password, username },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async ({ email }: { email?: string }) => {
  try {
    const response = await api
      .post('auth/forgot-password', {
        json: { email },
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async ({
  resetPasswordToken,
  newPassword,
  router,
}: {
  resetPasswordToken?: string | string[];
  newPassword?: string;
  router: NextRouter;
}): Promise<NextResponse | undefined> => {
  try {
    const response = await api.put('auth/reset-password', {
      json: { resetPasswordToken, newPassword },
    });
    if (response.ok) {
      router.push('/login');
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

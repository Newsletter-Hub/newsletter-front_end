import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';

import { NextRouter } from 'next/router';
import { NextResponse } from 'next/server';

import api from '@/config/ky';

import { User } from '@/types/user';
import { toast } from 'react-toastify';

interface LoginUser {
  email: string;
  password: string;
  router: NextRouter;
  setUser?: (user: User) => void;
}

interface LogOutPayload {
  setUser: (user: User | null) => void;
}

interface GoogleAuth {
  token: string;
  router: NextRouter;
  setUser?: (user: User) => void;
}

interface SignupUser extends LoginUser {
  username: string;
}

interface ChangeEmailPayload {
  password: string;
  newEmail: string;
}

interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export const login = async ({
  email,
  password,
  router,
  setUser,
}: LoginUser) => {
  try {
    const response = await api
      .post('auth/sign-in', {
        json: { email, password },
      })
      .json()
      .then(res => {
        Cookies.set('user', JSON.stringify(res), { expires: 1 });
        if (setUser) {
          setUser(res as User);
        }
        router.push('/');
      });
    return response;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to login');
  }
};

export const googleAuth = async ({ token, router, setUser }: GoogleAuth) => {
  try {
    const response = await api
      .post('auth/google', { json: { token } })
      .json()
      .then(res => {
        Cookies.set('user', JSON.stringify(res), { expires: 1 });
        router.push('/');
        if (setUser) {
          setUser(res as User);
        }
      });
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
    throwErrorMessage(error as HTTPError, 'Failed to create user');
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

export const changeEmail = async ({
  password,
  newEmail,
}: ChangeEmailPayload) => {
  try {
    const response = await api.put('auth/change-email', {
      json: { newEmail, password },
    });
    return response;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to change email');
  }
};

export const changePassword = async ({
  password,
  newPassword,
}: ChangePasswordPayload) => {
  try {
    const response = await api.put('auth/change-password', {
      json: { newPassword, password },
    });
    return response;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to change password');
  }
};

export const logout = ({ setUser }: LogOutPayload) => {
  try {
    setUser(null);
    api.post('auth/sign-out', { credentials: 'include' }).then(() => {
      Cookies.remove('user');
    });
  } catch (error) {
    console.error(error);
  }
};

export const signUpSetCookie = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  try {
    const response = await api.post('auth/set-cookie', {
      json: { accessToken },
    });
    const res: User = await response.json();
    return res;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Invalid access token');
    console.log(error);
  }
};

export const resendVerifyEmail = async ({ email }: { email: string }) => {
  try {
    const response = await api.post('auth/resend-email-confirmation-link', {
      json: { email },
    });
    if (response.ok) {
      toast.success('New verification email was sended');
    }
    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Invalid email');
    console.log(error);
  }
};

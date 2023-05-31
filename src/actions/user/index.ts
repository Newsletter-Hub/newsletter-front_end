import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import { UserList } from '@/pages/users';

import api from '@/config/ky';

import { Payload } from '@/types/signup';
import { UserMe } from '@/types/user';

interface GetUserMePayload {
  token?: string | null;
}

interface GetUserMeResponse {
  response?: UserMe;
  error?: string;
}

interface UpdateUserResponse {
  error?: string;
  response?: UserMe;
}

interface GetUsersListProps {
  page: number;
  pageSize: number;
  order: string;
  orderDirection: string;
  search?: string;
  myId?: number;
}

export const updateUser = async ({
  dateBirth,
  country,
  state,
  username,
  profileType,
  avatar,
  interests,
  type = 'signup',
  description,
  router,
  setUser,
}: Payload): Promise<UpdateUserResponse | undefined> => {
  try {
    const formData = new FormData();
    dateBirth && formData.append('dateOfBirth', dateBirth as string);
    country && formData.append('country', country as string);
    state && formData.append('state', state as string);
    username && formData.append('username', username as string);
    profileType && formData.append('profileType', profileType as string);
    description && formData.append('description', description as string);
    avatar && formData.append('avatar', avatar as Blob);
    if (interests?.length) {
      for (let i = 0; i < interests.length; i++) {
        formData.append('interestIds[]', JSON.stringify(interests[i]));
      }
    }
    const response = await fetch('/api/users', {
      body: formData,
      method: 'PUT',
      credentials: 'include',
    });

    if (response.ok) {
      const res = await response.json();
      Cookies.set('user', JSON.stringify(res), { expires: 1 });
      if (setUser) {
        setUser(res as UserMe);
      }
      if (router) {
        router.push('/');
      }

      toast.success(
        type === 'signup'
          ? 'User successfully created'
          : type === 'update'
          ? 'Your info successfully updated'
          : 'Your interests successfully updated'
      );

      return { response: res };
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to update user');
    return { error: 'Failed to update user' };
  }
};

export const getUserMe = async ({
  token,
}: GetUserMePayload): Promise<GetUserMeResponse> => {
  try {
    const headers = token ? { Cookie: `accessToken=${token}` } : {};
    const response: UserMe = await api
      .get('users', {
        headers,
        credentials: 'include',
      })
      .json();
    return { response };
  } catch (error) {
    return { error: 'Failed to get user' };
  }
};

export const getUsersList = async ({
  page,
  pageSize,
  order,
  orderDirection,
  search = '',
  myId,
}: GetUsersListProps) => {
  try {
    const user = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : undefined;
    const response: UserList = await api
      .get('users/public-users-list', {
        searchParams: { page, pageSize, order, orderDirection, search },
      })
      .json();
    const userId = user ? user.id : myId;
    if (userId) {
      response.users.forEach(user => {
        if (user.followersIds.includes(userId as number)) {
          user.followed = true;
        }
      });
    }
    return response;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch users list' };
  }
};

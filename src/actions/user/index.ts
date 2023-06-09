import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import { Payload } from '@/types/signup';
import { UserList, User } from '@/types/user';

interface GetUserMePayload {
  token?: string | null;
}

interface GetUserByIdPayload extends GetUserMePayload {
  userId?: number;
}

interface GetUserMeResponse {
  response?: User;
  error?: string;
}

interface UpdateUserResponse {
  error?: string;
  response?: User;
}

export interface GetSimpleUserListProps {
  page: number;
  pageSize: number;
  token?: string;
}

export interface GetAdvancedUsersListProps extends GetSimpleUserListProps {
  order: string;
  orderDirection: string;
  search?: string;
}

interface UserListResponse {
  userList?: UserList;
  error?: string;
}

export type GetAdvancedUserListType = (
  props: GetAdvancedUsersListProps
) => Promise<UserListResponse>;

export type GetSimpleUserListType = (
  props: GetSimpleUserListProps
) => Promise<UserListResponse>;

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
    const response = await api.put('users', {
      body: formData,
    });

    if (response.ok) {
      const res: User = await response.json();
      Cookies.set('user', JSON.stringify(res), { expires: 1 });
      if (setUser) {
        setUser(res as User);
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
    console.log(error);
    throwErrorMessage(error as HTTPError, 'Failed to update user');
    return { error: 'Failed to update user' };
  }
};

export const getUserMe = async ({
  token,
}: GetUserMePayload): Promise<GetUserMeResponse> => {
  try {
    const headers = token ? { Cookie: `accessToken=${token}` } : {};
    const response: User = await api
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

export const getUserById = async ({
  token,
  userId,
}: GetUserByIdPayload): Promise<GetUserMeResponse> => {
  try {
    const headers = token ? { Cookie: `accessToken=${token}` } : {};
    const response: User = await api
      .get(`users/public-user/${userId}`, {
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
  token,
}: GetAdvancedUsersListProps): Promise<UserListResponse> => {
  try {
    const response: UserList = await api
      .get('users/public-users-list', {
        searchParams: { page, pageSize, order, orderDirection, search },
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { userList: response };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch users list' };
  }
};

export const getFollowers = async ({
  page,
  pageSize,
  token,
}: GetSimpleUserListProps): Promise<UserListResponse> => {
  try {
    const response: UserList = await api
      .get('subscriptions/subscribers', {
        searchParams: { page, pageSize },
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { userList: response };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch users list' };
  }
};

export const getUserSubscriptions = async ({
  page,
  pageSize,
  token,
}: GetSimpleUserListProps): Promise<UserListResponse> => {
  try {
    const response: UserList = await api
      .get('subscriptions/my-subscriptions', {
        searchParams: { page, pageSize, entity: 'User' },
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { userList: response };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch users list' };
  }
};

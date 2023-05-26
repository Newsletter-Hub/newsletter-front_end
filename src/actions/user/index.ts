import { toast } from 'react-toastify';

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
    }).then(res => res.json());
    if (response) {
      toast.success(
        type === 'signup'
          ? 'User succesfully created'
          : type === 'update'
          ? 'Your info succesfully updated'
          : 'Your interests succesfully updated'
      );
    }
    return { response };
  } catch (error) {
    console.log(error);
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
}: GetUsersListProps) => {
  try {
    const response = await api
      .get('users/public-users-list', {
        searchParams: { page, pageSize, order, orderDirection, search },
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch users list' };
  }
};

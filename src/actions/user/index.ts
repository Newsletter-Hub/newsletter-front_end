import api, { postApi } from '@/config/ky';

import { Payload } from '@/types/signup';

interface GetUserMePayload {
  token?: string;
}

interface UpdateUserResponse {
  error?: string;
  response?: object;
}

export const updateUser = async ({
  dateBirth,
  country,
  state,
  username,
  profileType,
  avatar,
  interests,
}: Payload): Promise<UpdateUserResponse | undefined> => {
  try {
    const formData = new FormData();
    dateBirth && formData.append('dateOfBirth', dateBirth as string);
    country && formData.append('country', country as string);
    state && formData.append('state', state as string);
    username && formData.append('username', username as string);
    profileType && formData.append('profileType', profileType as string);
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
    return { response };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to update user' };
  }
};

export const getUserMe = async ({ token }: GetUserMePayload) => {
  try {
    const response = await api
      .get('users', {
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to get user' };
  }
};

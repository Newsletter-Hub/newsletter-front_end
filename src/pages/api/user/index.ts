import { Payload } from '@/types/signup';

export const updateUser = async ({
  dateBirth,
  country,
  state,
  username,
  profileType,
  avatar,
  interests,
}: Payload) => {
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
    const response = await fetch(
      'https://newsletter-back-quzx.onrender.com/users',
      {
        body: formData,
        method: 'PUT',
        credentials: 'include',
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

import { publicApi } from '@/config/ky';

export const getInterests = async () => {
  try {
    const response = await publicApi.get('interests').json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

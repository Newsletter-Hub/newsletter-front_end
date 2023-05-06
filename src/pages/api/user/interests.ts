import api from '@/config/ky';

export const getInterests = async () => {
  try {
    const response = await api.get('interests').json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

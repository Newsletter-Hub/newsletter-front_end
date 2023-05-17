import api from '@/config/ky';

export const getCategories = async () => {
  try {
    const response = await api.get('interests/categories-list').json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

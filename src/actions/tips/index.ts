import throwErrorMessage from '@/helpers/throwErrorMessage';
// import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
// import { toast } from 'react-toastify';

import api from '@/config/ky';

import { GetTipsPayload, GetTipsResponse } from '@/types/tips.type';

export const getTips = async ({
  token,
  newsletterId,
  page,
  limit,
}: GetTipsPayload) => {
  try {
    const headers = token ? { Cookie: `accessToken=${token}` } : {};
    const response: GetTipsResponse = await api
      .get(`tips?newsletterId=${newsletterId}&page=${page}&limit=${limit}`, {
        headers,
        credentials: 'include',
      })
      .json();
    return { response };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get tips');
    return { error: 'Failed to get tips' };
  }
};

import throwErrorMessage from '@/helpers/throwErrorMessage';
// import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import {
  GetPaypalPartnerLinksOptions,
  GetPaypalPartnerLinksResponse,
} from '@/types/tips.type';

export const getPaypalPartnerLinks = async ({
  email,
}: GetPaypalPartnerLinksOptions): Promise<
  GetPaypalPartnerLinksResponse | undefined
> => {
  const payload = {
    email,
  };

  try {
    const response = await api.post('paypal/partner-referral', {
      json: payload,
    });

    if (!response) {
      toast.error('Failed to get partner links!');
      return;
    }

    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get partner links');
  }
};

// export const getTips = async ({
//   token,
//   newsletterId,
//   page,
//   limit,
// }: GetTipsPayload) => {
//   try {
//     const headers = token ? { Cookie: `accessToken=${token}` } : {};
// const response: GetTipsResponse = await api
//   .get(`tips?newsletterId=${newsletterId}&page=${page}&limit=${limit}`, {
//     headers,
//     credentials: 'include',
//   })
//   .json();
// return { response };
//   } catch (error) {
//     throwErrorMessage(error as HTTPError, 'Failed to get tips');
//     return { error: 'Failed to get tips' };
//   }
// };

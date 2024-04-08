import throwErrorMessage from '@/helpers/throwErrorMessage';
// import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
// import { toast } from 'react-toastify';

import api from '@/config/ky';

import {
  GetUserSubscriptionPayload,
  GetUserSubscriptionResponse,
  PaymentSubscription,
} from '@/types/paymentSubscription.type';

export const getUserSubscription = async ({
  token,
}: GetUserSubscriptionPayload): Promise<GetUserSubscriptionResponse> => {
  try {
    const headers = token ? { Cookie: `accessToken=${token}` } : {};
    const response: PaymentSubscription = await api
      .get('payment-subscription/subscription', {
        headers,
        credentials: 'include',
      })
      .json();
    return { response };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get subscription');
    return { error: 'Failed to get subscription' };
  }
};

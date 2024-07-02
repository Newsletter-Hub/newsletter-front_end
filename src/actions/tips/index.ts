import throwErrorMessage from '@/helpers/throwErrorMessage';
// import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import {
  CreateTipOrderOptions,
  CreateTipOrderResponse,
  GetPaypalPartnerLinksOptions,
  GetPaypalPartnerLinksResponse,
  GetTipsOptions,
  GetTipsResponse,
  HandleTipCaptureResponse,
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

export const createTipOrder = async ({
  clientId,
  partnerId,
  tipAmount,
  comment,
}: CreateTipOrderOptions): Promise<CreateTipOrderResponse | undefined> => {
  const payload = {
    clientId,
    partnerId,
    tipAmount,
    ...(comment && { comment }),
  };

  try {
    const response = await api.post('paypal/create-order', {
      json: payload,
    });

    if (!response) {
      toast.error('Failed to create tip order!');
      return;
    }

    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to create tip order');
  }
};

export const handleTipCapture = async (
  orderId?: string
): Promise<HandleTipCaptureResponse | undefined> => {
  const payload = {
    orderId,
  };

  try {
    const response = await api.post('paypal/tip-capture', {
      json: payload,
    });

    if (!response) {
      toast.error('Failed to capture tip');
      return;
    }

    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to capture tip');
  }
};

export const getTips = async ({
  newsletterId,
  page,
  limit,
}: GetTipsOptions): Promise<GetTipsResponse | undefined> => {
  try {
    const response = await api.get(`tips/tips?newsletterId`, {
      searchParams: { newsletterId, page, limit },
    });

    if (!response) {
      toast.error('Failed to get tips');
      return;
    }

    return response.json();
  } catch (error) {
    console.error('Failed to get tips', error);
    return;
  }
};

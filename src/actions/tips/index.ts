import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import {
  GetPaypalPartnerLinksOptions,
  GetPaypalPartnerLinksResponse,
  GetTipsOptions,
  GetTipsResponse,
  HandlePaypalPartnerStatusOptions,
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

export const handlePaypalPartnerStatus = async ({
  trackingId,
  merchantIdInPayPal,
}: HandlePaypalPartnerStatusOptions): Promise<
  GetPaypalPartnerLinksResponse | undefined
> => {
  const payload = {
    trackingId,
    merchantIdInPayPal,
  };

  try {
    const response = await api.post('paypal/partner-status', {
      json: payload,
    });

    if (!response) {
      toast.error('Failed to get partner status!');
      return;
    }

    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get partner status');
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

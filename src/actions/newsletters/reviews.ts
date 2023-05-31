import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import { GetReviewResponse } from '@/types/newsletters';
import { ReviewResponse } from '@/types/newsletters';

interface ReviewPayload {
  comment?: string;
  rating: number;
  newsletterId: number;
}

interface CreateReviewResponse {
  error?: string;
}

interface GetReviewsQuery {
  page: number;
  pageSize: number;
  newsletterId?: number;
}

export const createReview = async ({
  comment,
  rating,
  newsletterId,
}: ReviewPayload): Promise<CreateReviewResponse> => {
  try {
    const payload = comment
      ? {
          comment,
          rating,
          newsletterId,
        }
      : { rating, newsletterId };
    const response = await api.post('reviews', {
      json: payload,
    });
    if (response) {
      toast.success('Thanks for your review!');
    }
    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to create review');
    return {
      error: 'Failed to create reviews',
    };
  }
};

export const getReviews = async ({
  newsletterId,
  page = 1,
  pageSize = 5,
}: GetReviewsQuery): Promise<GetReviewResponse> => {
  try {
    const searchParams: {
      page: number;
      pageSize: number;
      newsletterId?: number;
    } = {
      page,
      pageSize,
    };
    if (newsletterId) {
      searchParams.newsletterId = newsletterId;
    }
    const reviews: ReviewResponse = await api
      .get(`reviews`, {
        searchParams,
      })
      .json();
    return { reviews };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get reviews',
    };
  }
};

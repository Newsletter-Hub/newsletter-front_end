import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import {
  GetReviewResponse,
  GetUserReviewForNewsletterResponse,
} from '@/types/newsletters';
import {
  ReviewResponse,
  UserReviewForNewsletterResponse,
} from '@/types/newsletters';

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

interface UpdateReviewPayload {
  comment?: string;
  rating: number;
  id: number;
}
interface DeleteReviewPayload {
  reviewId: string | number;
}

interface GetUserReviewForNewsletterPayload {
  newsletterId: number;
  token?: string | null;
}
export interface DeleteReviewResponse {
  error?: string;
  isDeleted?: string;
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
      error: 'Failed to create review',
    };
  }
};

export const getUserReviewForNewsletter = async ({
  newsletterId,
  token,
}: GetUserReviewForNewsletterPayload): Promise<GetUserReviewForNewsletterResponse> => {
  try {
    const review: UserReviewForNewsletterResponse = await api
      .get(`reviews/user-review-for-newsletter/${newsletterId}`, {
        headers: { Cookie: `accessToken=${token}` },
      })
      .json();
    return { review };
  } catch (error) {
    return {
      review: null,
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

export const updateReview = async ({
  comment,
  rating,
  id,
}: UpdateReviewPayload): Promise<CreateReviewResponse> => {
  try {
    const payload = comment
      ? {
          comment,
          rating,
        }
      : { rating };
    const response = await api.put(`reviews/${id}`, {
      json: payload,
    });
    if (response) {
      toast.success('Review succesfully updated');
    }
    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to update review');
    return {
      error: 'Failed to update review',
    };
  }
};

export const deleteReview = async ({
  reviewId,
}: DeleteReviewPayload): Promise<DeleteReviewResponse> => {
  try {
    const response = await api.delete(`reviews/${reviewId}`).json();
    toast.success('Review was succesfully deleted');
    return { isDeleted: response as string };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to delete review');
    return { error: 'Failed to delete review' };
  }
};

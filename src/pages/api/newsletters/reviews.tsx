import { NextApiRequest, NextApiResponse } from 'next';

import api from '@/config/ky';

interface ReviewPayload {
  comment?: string;
  rating: number;
  newsletterId: number;
}

interface Reviewer {
  username?: string;
  country?: string;
  avatar?: string;
}

export interface Review {
  rating?: number;
  reviewer: Reviewer;
  comment?: string;
  id?: number;
  createdAt?: string;
}

export interface ReviewResponse {
  reviews: Review[];
  total?: number;
  lastPage?: number;
}

export interface GetReviewResponse {
  reviews?: ReviewResponse;
  error?: string;
}

interface CreateReviewResponse {
  error?: string;
}

interface GetReviewsQuery {
  page: number;
  pageSize: number;
  newsletterId: number;
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
    return response.json();
  } catch (error) {
    console.log(error);
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
    const reviews: ReviewResponse = await api
      .get(`reviews`, {
        searchParams: {
          newsletterId,
          page,
          pageSize,
        },
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

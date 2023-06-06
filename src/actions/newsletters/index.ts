import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';

import api from '@/config/ky';

import { NewsletterData, NewslettersListData } from '@/types/newsletters';
import { toast } from 'react-toastify';
import { NextRouter } from 'next/router';

interface NewsletterLink {
  link?: string;
}

export interface NewsletterLinkResponse {
  id: number;
  link?: string;
  title: string;
  description: string;
  image: string;
}

interface Newsletter {
  id?: number;
  link?: string;
  title?: string;
  description?: string;
  image?: Blob | string;
  interests?: number[];
  newsletterAuthor?: string;
  averageDuration: string;
  pricingType: 'free' | 'paid';
  router?: NextRouter;
}

export interface GetNewsletterResponse {
  newsletterData?: NewsletterData;
  error?: string;
}

export interface GetNewsletterListProps {
  page?: number;
  pageSize?: number;
  order?: string;
  orderDirection?: string;
  categoriesIds?: number[] | [];
  pricingTypes?: string[];
  durationFrom?: number;
  durationTo?: number;
  ratings?: number[];
  search?: string;
  authorId?: number;
  myId?: number;
  entity?: 'Newsletter' | 'User';
  token?: string | null;
}

export interface FollowPayload {
  entityId: number;
  entityType: 'Newsletter' | 'User';
}

export const newsletterVerifyOwnership = async ({
  link,
}: NewsletterLink): Promise<NewsletterLinkResponse | undefined> => {
  try {
    const response = await api.post('newsletters/verify-ownership', {
      json: { link },
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to add newsletter');
    console.log(error);
  }
};

export const newsletterLink = async ({
  link,
}: NewsletterLink): Promise<NewsletterLinkResponse | undefined> => {
  try {
    const response = await api.post('newsletters', { json: { link } });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to add newsletter');
    console.log(error);
  }
};

export const newsletterUpdate = async ({
  id,
  link,
  title,
  description,
  newsletterAuthor,
  image,
  interests,
  averageDuration,
  pricingType,
  router,
}: Newsletter): Promise<NewsletterLinkResponse | undefined> => {
  try {
    const formData = new FormData();
    link && formData.append('link', link as string);
    title && formData.append('title', title as string);
    description && formData.append('description', description as string);
    newsletterAuthor &&
      formData.append('newsletterAuthor', newsletterAuthor as string);
    averageDuration &&
      formData.append('averageDuration', averageDuration as string);
    pricingType && formData.append('pricing', pricingType as string);
    image && formData.append('image', image as Blob);
    if (interests?.length) {
      for (let i = 0; i < interests.length; i++) {
        formData.append('interestIds[]', JSON.stringify(interests[i]));
      }
    }
    const response = await api.put(`newsletters/${id}`, { body: formData });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = (await response.json()) as NewsletterLinkResponse;
    if (response.ok) {
      toast.success('Newsletter succesfully added');
      if (router) {
        router.push(`/newsletters/${res.id}`);
      }
    }
    return res;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to update newsletter');
    return undefined;
  }
};

export const getNewsletter = async ({
  id,
  token,
}: {
  id: number;
  token?: string;
}): Promise<GetNewsletterResponse> => {
  try {
    const newsletterData: NewsletterData = await api
      .get(`newsletters/${id}`, {
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();

    return { newsletterData };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get newsletter');
    return {
      error: 'Failed to get newsletter',
    };
  }
};

export const getNewslettersList = async ({
  page = 1,
  pageSize = 5,
  order,
  orderDirection = 'ASC',
  categoriesIds,
  pricingTypes,
  durationFrom,
  durationTo,
  ratings,
  search,
  authorId,
  token,
}: GetNewsletterListProps) => {
  try {
    const user = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : undefined;
    let url = `newsletters?page=${page}&pageSize=${pageSize}&order=${order}&orderDirection=${orderDirection}`;

    if (pricingTypes && pricingTypes.length > 0) {
      pricingTypes.forEach((type, index) => {
        url += `&pricingTypes[${index}]=${type}`;
      });
    }

    if (categoriesIds && categoriesIds.length > 0) {
      categoriesIds.forEach((id, index) => {
        url += `&categoriesIds[${index}]=${id}`;
      });
    }

    if (ratings && ratings.length > 0) {
      ratings.forEach((id, index) => {
        url += `&ratings[${index}]=${id}`;
      });
    }

    if (durationFrom && (durationFrom !== 1 || durationTo !== 60))
      url += `&durationFrom=${durationFrom}`;
    if (durationTo && (durationFrom !== 1 || durationTo !== 60))
      url += `&durationTo=${durationTo}`;
    if (search) url += `&search=${search}`;
    if (authorId) url += `&authorId=${authorId}`;

    const newslettersListData: NewslettersListData = await api
      .get(url, {
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();

    return { newslettersListData };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get newsletter');
    return {
      error: 'Failed to get newsletters',
    };
  }
};

export const getMySubscriptions = async ({
  entity = 'Newsletter',
  page,
  pageSize,
  token,
}: GetNewsletterListProps) => {
  try {
    const searchParams =
      entity && page && pageSize ? { entity, page, pageSize } : undefined;
    const newslettersListData: NewslettersListData = await api
      .get('subscriptions/my-subscriptions', {
        searchParams,
        headers: { Cookie: `accessToken=${token}` },
      })
      .json();

    return { newslettersListData };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get newsletter',
    };
  }
};

export const follow = async ({ entityId, entityType }: FollowPayload) => {
  try {
    const response = await api.post('subscriptions', {
      json: { entityId, entityType },
    });
    return response;
  } catch (error) {
    console.log(error);
    throwErrorMessage(error as HTTPError, `Failed to follow ${entityType}`);
  }
};

export const unfollow = async ({ entityId, entityType }: FollowPayload) => {
  try {
    const response = await api.delete('subscriptions', {
      searchParams: { entityId, entityType },
    });
    return response;
  } catch (error) {
    console.log(error);
    throwErrorMessage(error as HTTPError, `Failed to delete ${entityType}`);
  }
};

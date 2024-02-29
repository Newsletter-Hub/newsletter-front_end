import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';

import api from '@/config/ky';

import { NewsletterData, NewslettersListData } from '@/types/newsletters';
import { toast } from 'react-toastify';
import { NextRouter } from 'next/router';

interface NewsletterLink {
  link?: string;
}

export interface NewsletterLinkResponse {
  newsletterAuthor?: string;
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
  pricingType: 'free' | 'paid' | 'free_and_paid';
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

export interface ReportNewsletterResponse {
  error?: string;
  isReported?: boolean;
}

export interface ReportPayload {
  newsletterId: number;
  report: string;
}

export interface ClaimRequestPayload {
  newsletterId: number;
}

export interface ClaimRequestResponse {
  error?: string;
  isRequested?: boolean;
}

export const parseNewsletter = async ({
  link,
}: NewsletterLink): Promise<NewsletterLinkResponse | undefined> => {
  try {
    const response = await api.post('newsletters/parse-newsletter', {
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
  interests,
  averageDuration,
  pricingType,
  router,
}: Newsletter): Promise<NewsletterLinkResponse | undefined> => {
  try {
    const response = await api.put(`newsletters/${id}`, {
      json: { interestIds: interests, averageDuration, pricing: pricingType },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = (await response.json()) as NewsletterLinkResponse;
    if (response.ok) {
      if (router) {
        toast.success('Newsletter succesfully updated');
        router.push(`/newsletters/${res.id}`);
      }
    }
    return res;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to update newsletter');
    return undefined;
  }
};

export const newsletterUpdateAsOwner = async ({
  id,
  link,
  title,
  description,
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
    averageDuration &&
      formData.append('averageDuration', averageDuration as string);
    pricingType && formData.append('pricingType', pricingType as string);
    image && formData.append('image', image as Blob);
    if (interests?.length) {
      for (let i = 0; i < interests.length; i++) {
        formData.append('interestIds[]', JSON.stringify(interests[i]));
      }
    }
    const response = await api.put(`newsletters/owner-update/${id}`, {
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = (await response.json()) as NewsletterLinkResponse;
    if (response.ok) {
      if (router) {
        toast.success('Newsletter succesfully updated');
        router.push(`/newsletters/${res.id}`);
      }
    }
    return res;
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to update newsletter');
    return undefined;
  }
};

export const createNewsletter = async ({
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
    const response = await api.post('newsletters', {
      json: {
        link,
        title,
        description,
        newsletterAuthor,
        image,
        interestIds: interests,
        averageDuration,
        pricingType,
      },
    });
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
  orderDirection = 'DESC',
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

export const getNewsletterSubscriptions = async ({
  entity = 'Newsletter',
  page,
  pageSize,
  token,
  authorId,
}: GetNewsletterListProps) => {
  try {
    const searchParams =
      entity && page && pageSize && authorId
        ? { entity, page, pageSize, userId: authorId }
        : undefined;
    const newslettersListData: NewslettersListData = await api
      .get('subscriptions/subscriptions', {
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

export const newsletterReport = async ({
  report,
  newsletterId,
}: ReportPayload): Promise<ReportNewsletterResponse | undefined> => {
  try {
    await api
      .post('reports', {
        json: { report, newsletterId },
      })
      .then(() => {
        toast.success('Report was succesfully sended');
        return { isReported: true };
      });
  } catch (error) {
    console.log(error);
    throwErrorMessage(error as HTTPError, 'Failed to send report');
    return { error: 'Failed to send report' };
  }
};

export const claimNewsletterRequest = async ({
  newsletterId,
}: ClaimRequestPayload): Promise<ReportNewsletterResponse | undefined> => {
  try {
    await api
      .post('claims', {
        json: { newsletterId },
      })
      .then(() => {
        toast.success('Claim request was successful');
        return { isRequested: true };
      });
  } catch (error) {
    console.log(error);
    throwErrorMessage(error as HTTPError, 'Failed to request newsletter claim');
    return { error: 'Failed to request newsletter claim' };
  }
};

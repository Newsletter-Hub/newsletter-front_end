import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';

import api from '@/config/ky';

import { NewsletterData, NewslettersListData } from '@/types/newsletters';

interface NewsletterLink {
  link?: string;
}

export interface NewsletterLinkResponse {
  id: number;
  link?: string;
}

interface Newsletter {
  id?: number;
  link?: string;
  title?: string;
  description?: string;
  image?: Blob | string;
  interests?: number[];
  newsletterAuthor?: string;
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
    } else {
      return undefined;
    }
  } catch (error) {
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
}: Newsletter): Promise<NewsletterLinkResponse | undefined> => {
  const formData = new FormData();
  link && formData.append('link', link as string);
  title && formData.append('title', title as string);
  description && formData.append('description', description as string);
  newsletterAuthor &&
    formData.append('newsletterAuthor', newsletterAuthor as string);
  image && formData.append('image', image as Blob);
  if (interests?.length) {
    for (let i = 0; i < interests.length; i++) {
      formData.append('interestIds[]', JSON.stringify(interests[i]));
    }
  }
  const response = await fetch(
    `https://newsletter-back-quzx.onrender.com/newsletters/${id}`,
    {
      body: formData,
      method: 'PUT',
      credentials: 'include',
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    return undefined;
  }
};

export const getNewsletter = async ({
  id,
  myId,
}: {
  id: number;
  myId?: number;
}): Promise<GetNewsletterResponse> => {
  try {
    const user = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : undefined;
    const newsletterData: NewsletterData = await api
      .get(`newsletters/${id}`)
      .json();
    console.log(newsletterData, 'here');
    if (myId || (user && user.id)) {
      newsletterData.followed = newsletterData.followersIds.includes(
        myId || user.id
      );
    }
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
  myId,
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

    const newslettersListData: NewslettersListData = await api.get(url).json();
    const userId = user ? user.id : myId;
    if (authorId || userId) {
      newslettersListData.newsletters.forEach(newsletter => {
        if (newsletter.followersIds.includes(authorId || (userId as number))) {
          newsletter.followed = true;
        }
      });
    }
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
    newslettersListData.newsletters.forEach(item => (item.followed = true));

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

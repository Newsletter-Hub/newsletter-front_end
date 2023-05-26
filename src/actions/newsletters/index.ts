import api from '@/config/ky';

import { NewsletterData } from '@/types/newsletters';

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
  page: number;
  pageSize: number;
  order: string;
  orderDirection?: string;
  categoriesIds?: number[] | [];
  pricingTypes?: string[];
  durationFrom?: number;
  durationTo?: number;
  ratings?: number[];
  search?: string;
  authorId?: number;
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
}: {
  id: number;
}): Promise<GetNewsletterResponse> => {
  try {
    const newsletterData: NewsletterData = await api
      .get(`newsletters/${id}`)
      .json();
    return { newsletterData };
  } catch (error) {
    console.error(error);
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

    const newslettersListData: NewsletterData[] = await api.get(url).json();
    return { newslettersListData };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get newsletter',
    };
  }
};

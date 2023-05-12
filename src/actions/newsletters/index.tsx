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
}: {
  page?: number;
  pageSize?: number;
}) => {
  try {
    const newslettersListData: NewsletterData[] = await api
      .get('newsletters', { searchParams: { page, pageSize } })
      .json();
    return { newslettersListData };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get newsletter',
    };
  }
};

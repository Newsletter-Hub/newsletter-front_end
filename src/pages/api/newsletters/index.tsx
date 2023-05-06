import { NextResponse } from 'next/server';

import api from '@/config/ky';

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

export const newsletterVerifyOwnership = async ({
  link,
}: NewsletterLink): Promise<NextResponse | undefined> => {
  try {
    const response = await api.post('newsletters/verify-ownership', {
      json: { link },
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
}: Newsletter) => {
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
  return response;
};
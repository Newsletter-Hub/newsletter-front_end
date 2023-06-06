import { Dispatch, SetStateAction } from 'react';

import { Interest } from './interests';
import { User } from './user';

export interface AddNewsletterPayload {
  link?: string;
  title?: string;
  description?: string;
  author?: string;
  image?: string;
  topics: [];
  id?: number;
}

export interface NewsletterFormProps {
  setPayload: Dispatch<SetStateAction<AddNewsletterPayload>>;
  payload: AddNewsletterPayload;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  interests?: Interest[];
}

export interface NewsletterData {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  newsletterAuthor?: string;
  interests?: Interest[];
  addedByUser?: User;
  averageRating: number;
  amountRatings: number;
  link: string;
  averageDuration: number;
  pricing: string;
  createdAt: string;
  followed: boolean;
  followersIds: number[];
  amountFollowers: number;
}

export interface Newsletter {
  total?: number;
  newsletters?: NewsletterData[];
  nextPage?: number;
}

export interface NewslettersListData {
  total: number;
  newsletters: NewsletterData[];
}

export interface Reviewer {
  username: string;
  avatar: string;
  country: string;
  id: number;
}

export interface Review {
  reviewer: Reviewer;
  newsletter: NewsletterData;
  createdAt: string;
  id: number;
  comment: string;
  rating: number;
}

export interface ReviewResponse {
  reviews: Review[];
  total?: number;
  lastPage?: number;
  nextPage?: number;
}

export interface GetReviewResponse {
  reviews?: ReviewResponse;
  error?: string;
}

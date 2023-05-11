import { Dispatch, SetStateAction } from 'react';

import { Interest } from './interests';
import { User } from './user';

export interface AddNewsletterPayload {
  link?: string;
  title?: string;
  description?: string;
  author?: string;
  image?: File | string;
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
  title?: string;
  description?: string;
  image?: string;
  newsletterAuthor?: string;
  interests?: Interest[];
  addedByUser?: User;
  averageRating: number;
  amountRatings: number;
}

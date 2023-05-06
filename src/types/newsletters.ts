import { Dispatch, SetStateAction } from 'react';

import { Interest } from './interests';

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

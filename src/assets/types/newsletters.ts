import { Dispatch, SetStateAction } from 'react';

export interface AddNewsletterPayload {
  link?: string;
  title?: string;
  description?: string;
  author?: string;
  image?: File | string;
  topics: [];
}

export interface NewsletterFormProps {
  setPayload: Dispatch<SetStateAction<AddNewsletterPayload>>;
  payload: AddNewsletterPayload;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

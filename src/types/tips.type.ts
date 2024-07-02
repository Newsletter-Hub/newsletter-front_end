import { User } from './user';

export interface GetPaypalPartnerLinksOptions {
  email: string;
}

export enum PayPalReferralLinkRelation {
  Self = 'self',
  ActionUrl = 'action_url',
}

type PayPalReferralLinkModel = {
  description: string;
  href: string;
  method: string;
  rel: PayPalReferralLinkRelation;
};

export interface GetPaypalPartnerLinksResponse {
  data: PayPalReferralLinkModel[];
}

type NewsletterModel = {
  id: number;
  link: string;
  title: string;
  description: null | string;
  averageDuration: number;
  pricing: string;
  newsletterAuthor: null | User;
  image: null | string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type TipItemModel = {
  id: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  payer: User;
  newsletter: NewsletterModel;
  comment?: string;
};

export type CreateTipOrderOptions = {
  clientId: number;
  partnerId: number;
  tipAmount: string;
  comment?: string;
};

export type CreateTipOrderResponse = {
  data: {
    checkoutUrl: string;
  };
};

export type HandleTipCaptureResponse = {
  data: {
    orderId: string;
  };
};

export type GetTipsOptions = {
  newsletterId: number;
  page: number;
  limit: string;
};

export type GetTipsResponse = {
  data: {
    tips: TipItemModel[];
    total: number;
    prevPage: undefined | number;
    nextPage: undefined | number;
    lastPage: number;
    currentPage: number;
  };
};

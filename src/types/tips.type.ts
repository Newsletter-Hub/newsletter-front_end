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

export interface GetTipsPayload {
  token?: string | null;
  newsletterId: string;
  page: string;
  limit: string;
}

type TipItem = {
  amount: number;
  createdAt: string;
  note: string;
  tipper: Tipper;
};

export interface GetTipsResponse {
  tips: {
    tips: TipItem[];
    total: number;
    currentPage: 1;
    nextPage: null | number;
    prevPage: null | number;
    lastPage: number;
  };
  token: string;
}

export interface Tipper {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
}

export type CreateTipOrderOptions = {
  clientId: number;
  partnerId: number;
  tipAmount: string;
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

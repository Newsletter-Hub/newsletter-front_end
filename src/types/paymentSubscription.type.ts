export interface GetUserSubscriptionPayload {
  token?: string | null;
}

export interface GetUserSubscriptionResponse {
  response?: PaymentSubscription;
  error?: string;
}

export type PaymentSubscription = {
  subscription: {
    isActive: null | boolean;
    isExpired: null | boolean;
  };
};

export interface CancelSubscriptionPayload {
  token?: string | null;
  reason: string;
}

export type CancelSubscriptionResponse = {
  isSuccess: boolean;
};

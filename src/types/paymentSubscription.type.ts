export interface GetUserSubscriptionPayload {
  token?: string | null;
}

export interface GetUserSubscriptionResponse {
  response?: PaymentSubscription;
  error?: string;
}

export type PaymentSubscription = {
  susbcription: null | boolean;
};

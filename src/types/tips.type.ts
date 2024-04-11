export interface GetTipsPayload {
  token?: string | null;
}

type TipItem = {
  amount: number;
  createdAt: string;
  note: string;
  tipper: Tipper;
};

export interface GetTipsResponse {
  tips: TipItem[];
}

export interface Tipper {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
}

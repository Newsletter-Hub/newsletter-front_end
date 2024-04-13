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

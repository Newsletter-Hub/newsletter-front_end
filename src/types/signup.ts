import { Dispatch, SetStateAction } from 'react';

export interface Payload {
  dateBirth?: string;
  country?: string;
  state?: string;
  username?: string;
  profileType?: string;
  avatar?: Blob | string;
  avatarURL?: string | ArrayBuffer;
  interests?: number[];
}

export interface UserInfoStepsProps {
  payload: Payload;
  setPayload: Dispatch<SetStateAction<Payload>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

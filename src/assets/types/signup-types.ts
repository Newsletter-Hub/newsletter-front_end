import { SetStateAction, Dispatch } from 'react';

export interface Payload {
  dateBirth?: string;
  country?: string;
  state?: string;
  username?: string;
  profileType?: string;
  avatar?: string;
  avatarURL?: string | ArrayBuffer;
}

export interface UserInfoStepsProps {
  payload: object;
  setPayload: Dispatch<SetStateAction<Payload>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

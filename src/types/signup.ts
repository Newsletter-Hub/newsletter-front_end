import { Dispatch, SetStateAction } from 'react';

import { NextRouter } from 'next/router';

import { UserMe } from './user';

export interface Payload {
  dateBirth?: string;
  country?: string;
  state?: string;
  username?: string;
  profileType?: string;
  avatar?: Blob | string;
  avatarURL?: string | ArrayBuffer;
  interests?: number[];
  type?: 'signup' | 'update' | 'interests';
  description?: string;
  router?: NextRouter;
  setUser?: (user: UserMe | null) => void;
}

export interface UserInfoStepsProps {
  payload: Payload;
  setPayload: Dispatch<SetStateAction<Payload>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

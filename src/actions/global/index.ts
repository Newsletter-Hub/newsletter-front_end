import api from '@/config/ky';

import { NewsletterData } from '@/types/newsletters';
import { User } from '@/types/user';

export interface GlobalSearchPayload {
  search: string;
}

export interface GlobalSearchResponse {
  users: User[];
  newsletters: NewsletterData[];
}

export const search = async ({
  search,
}: GlobalSearchPayload): Promise<GlobalSearchResponse | undefined> => {
  try {
    const response = await api.get('search', { searchParams: { search } });
    if (response.ok) {
      return await response.json();
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

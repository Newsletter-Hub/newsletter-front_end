import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';

import api from '@/config/ky';

export const getNotifications = async ({
  newsletterId,
  token,
}: BookmarkWithIdPayload) => {
  try {
    const notifications = await api
      .get(`bookmarks/${newsletterId}`, {
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { notifications };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get notifications');
    return {
      error: 'Failed to get newsletter',
    };
  }
};

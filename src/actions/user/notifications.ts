import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';

import api from '@/config/ky';

import { Notification } from '@/types/user';

interface GetNotificationsPayload {
  notificationRecipientId?: number;
  isOwnAccount: boolean;
  token: string | null;
  page: number;
  pageSize: number;
}
export interface NotificationData {
  notifications: Notification[];
  nextPage: number | null;
  total: number;
}

interface GetNotificationsResponse {
  notificationsData?: NotificationData;
  error?: string;
}

export const getNotifications = async ({
  notificationRecipientId,
  isOwnAccount,
  token,
  page,
  pageSize,
}: GetNotificationsPayload): Promise<GetNotificationsResponse> => {
  try {
    const notificationsData: NotificationData = await api
      .get(`notifications`, {
        searchParams: {
          notificationRecipientId: notificationRecipientId || '',
          isOwnAccount,
          page,
          pageSize,
        },
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { notificationsData };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to get notifications');
    return {
      error: 'Failed to get newsletter',
    };
  }
};

import throwErrorMessage from '@/helpers/throwErrorMessage';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

interface BookmarkWithIdPayload {
  newsletterId: string;
  token?: string;
}

export interface AddToBookmarkResponse {
  error?: string;
  bookmark?: object;
}

export interface DeleteBookmarkResponse {
  error?: string;
  isDeleted?: string;
}

export const getBookmarkById = async ({
  newsletterId,
  token,
}: BookmarkWithIdPayload) => {
  try {
    const bookmark = await api
      .get(`bookmarks/${newsletterId}`, {
        headers: {
          Cookie: `accessToken=${token}`,
        },
      })
      .json();
    return { bookmark };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get newsletter',
    };
  }
};

export const addToBookmark = async ({
  newsletterId,
}: BookmarkWithIdPayload): Promise<AddToBookmarkResponse> => {
  try {
    const response = await api
      .post('bookmarks', { json: { newsletterId } })
      .json();
    if (response) {
      toast.success('Succesfully added to bookmark');
    }
    return { bookmark: response as object };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to add bookmark');
    return { error: 'Failed to add bookmark' };
  }
};

export const deleteBookmark = async ({
  newsletterId,
}: BookmarkWithIdPayload): Promise<DeleteBookmarkResponse> => {
  try {
    const response = await api.delete(`bookmarks/${newsletterId}`).json();
    return { isDeleted: response as string };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to delete bookmark' };
  }
};

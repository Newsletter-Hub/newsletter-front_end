import throwErrorMessage from '@/helpers/throwErrorMessage';
import Cookies from 'js-cookie';
import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

import api from '@/config/ky';

import { NewslettersListData } from '@/types/newsletters';

import { GetNewsletterListProps } from '.';

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
    toast.success('Bookmark is succesfully deleted');
    return { isDeleted: response as string };
  } catch (error) {
    throwErrorMessage(error as HTTPError, 'Failed to delete bookmark');
    return { error: 'Failed to delete bookmark' };
  }
};

export const getBookmarksList = async ({
  page = 1,
  pageSize = 5,
  order,
  orderDirection = 'ASC',
  categoriesIds,
  pricingTypes,
  durationFrom,
  durationTo,
  ratings,
  search,
  token,
  myId,
}: GetNewsletterListProps) => {
  try {
    const user = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : undefined;
    let url = `newsletters/newsletters-in-bookmarks?page=${page}&pageSize=${pageSize}&order=${order}&orderDirection=${orderDirection}`;

    if (pricingTypes && pricingTypes.length > 0) {
      pricingTypes.forEach((type, index) => {
        url += `&pricingTypes[${index}]=${type}`;
      });
    }

    if (categoriesIds && categoriesIds.length > 0) {
      categoriesIds.forEach((id, index) => {
        url += `&categoriesIds[${index}]=${id}`;
      });
    }

    if (ratings && ratings.length > 0) {
      ratings.forEach((id, index) => {
        url += `&ratings[${index}]=${id}`;
      });
    }

    if (durationFrom && (durationFrom !== 1 || durationTo !== 60))
      url += `&durationFrom=${durationFrom}`;
    if (durationTo && (durationFrom !== 1 || durationTo !== 60))
      url += `&durationTo=${durationTo}`;
    if (search) url += `&search=${search}`;

    const newslettersListData: NewslettersListData = await api
      .get(url, { headers: { Cookie: `accessToken=${token}` } })
      .json();
    const userId = user ? user.id : myId;
    if (userId) {
      newslettersListData.newsletters.forEach(newsletter => {
        if (newsletter.followersIds.includes(userId as number)) {
          newsletter.followed = true;
        }
      });
    }
    return { newslettersListData };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get newsletter',
    };
  }
};

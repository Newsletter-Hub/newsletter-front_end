import { getBookmarksList } from '@/actions/newsletters/bookmarks';
import { getInterests } from '@/actions/user/interests';
import React from 'react';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { UserMe } from '@/types/user';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { NewslettersPageProps } from '@/components/Newsletter/NewsletterList';

const BookmarksPage = ({
  newslettersListData,
  interests,
}: NewslettersPageProps) => {
  return (
    <NewslettersList
      newslettersListData={newslettersListData}
      interests={interests}
      getNewslettersList={getBookmarksList}
      type="bookmark"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const user: UserMe = cookies.user;
  const bookmarkList = await getBookmarksList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
    token,
    myId: user && user.id ? +user.id : undefined,
  });
  const interests = await getInterests();
  if (!bookmarkList || !interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: bookmarkList.newslettersListData || null,
      interests: interests,
    },
  };
};

export default BookmarksPage;

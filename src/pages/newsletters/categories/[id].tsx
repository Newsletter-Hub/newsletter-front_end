import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import React from 'react';

import { GetServerSideProps } from 'next';

import { User } from '@/types/user';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { NewslettersPageProps } from '@/components/Newsletter/NewsletterList';
import parseCookies from 'next-cookies';

const NewslettersPage = ({
  newslettersListData,
  interests,
}: NewslettersPageProps) => {
  return (
    <NewslettersList
      newslettersListData={newslettersListData}
      interests={interests}
      getNewslettersList={getNewslettersList}
      type="newsletter"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params, req } = context;
  const user: User = req.cookies.user
    ? JSON.parse(req.cookies.user as string)
    : undefined;
  const categoryId = params && params.id;
  const search = (context.query && (context.query.search as string)) || '';
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : undefined;
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
    search,
    myId: user && user.id ? +user.id : undefined,
    token,
  });
  const interests = await getInterests();
  if (newsletterList.error || !interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      interests: interests,
    },
  };
};

export default NewslettersPage;

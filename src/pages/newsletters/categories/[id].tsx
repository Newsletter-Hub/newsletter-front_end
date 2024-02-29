import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import React from 'react';

import { GetServerSideProps } from 'next';

import { User } from '@/types/user';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { NewslettersPageProps } from '@/components/Newsletter/NewsletterList';
import parseCookies from 'next-cookies';
import Head from 'next/head';

const NewslettersPage = ({
  newslettersListData,
  interests,
  categoryId,
  categoryName,
}: NewslettersPageProps) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <>
      <Head>
        <title>
          {categoryName && categoryName !== ''
            ? `${categoryName} | Newsletter Hub`
            : 'Trending Newsletters | Join Newsletter Hub Today'}
        </title>
        <meta
          name="description"
          content={
            categoryName && categoryName !== ''
              ? `Discover, rate and follow the best ${categoryName} newsletters of ${currentYear}, with user-submitted ratings and reviews.`
              : 'Search our extensive newsletter database to find the best newsletters to subscribe to across various categories. Follow newsletters and users, and be part of a community that celebrates quality content.'
          }
        />
      </Head>
      <NewslettersList
        newslettersListData={newslettersListData}
        interests={interests}
        getNewslettersList={getNewslettersList}
        type="newsletter"
        categoryId={categoryId}
        categoryName={categoryName}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params, req } = context;
  const user: User = req.cookies.user
    ? JSON.parse(req.cookies.user as string)
    : undefined;
  const interestName = params && params.id;
  const interests = await getInterests();
  let categoryId: number | string | null = null;
  let categoryName: string | null = null;
  if (interestName !== 'all' && interests instanceof Array) {
    const category = interests.find(
      interest => interest.interestName === interestName
    );
    categoryId = category.id;
    categoryName = category.interestName;
  }
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
  if (newsletterList.error || !interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      interests: interests,
      categoryName: categoryName,
      categoryId: categoryId,
    },
  };
};

export default NewslettersPage;

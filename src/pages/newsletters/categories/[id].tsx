import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import React from 'react';

import { GetServerSideProps } from 'next';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { NewslettersPageProps } from '@/components/Newsletter/NewsletterList';

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
  const { params } = context;
  const categoryId = params && params.id;
  const search = (context.query && (context.query.search as string)) || '';
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
    search,
  });
  const interests = await getInterests();
  if (!newsletterList || !interests) {
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

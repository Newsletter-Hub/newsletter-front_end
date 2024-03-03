import { useState } from 'react';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';
import Head from 'next/head';

import { User } from '@/types/user';
import { getNewslettersList } from '@/actions/newsletters';
import { NewslettersPageProps } from '@/components/Newsletter/NewsletterList';
import NewslettersList from '@/components/Newsletter/NewsletterList';

import PrivateRoute from '@/components/PrivateRoute';

const ClaimNewslettersPage = ({
  newslettersListData,
}: NewslettersPageProps) => {
  return (
    <>
      <Head>
        <title>Claim a Newsletter | Newsletter Hub</title>
        <meta
          name="description"
          content="Claim a newsletter that has been added to our site to unlock all our features to help you grow your newsletter."
        />
      </Head>
      <PrivateRoute>
        <NewslettersList
          newslettersListData={newslettersListData}
          getNewslettersList={getNewslettersList}
          isRated={false}
          isFollowEnable={false}
          layout="claim_newsletter"
          type="newsletter"
          title="Claim a Newsletter"
          defaultSortType="date"
          subTitle="Locate your newsletter below to claim it.
          If your newsletter has not been added yet, you can easily do so by clicking 'Add Newsletter' in the nav menu.
          "
          onlyShowUnclaimed={true}
        />
      </PrivateRoute>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const user = cookies.user as User | undefined;
  const token = cookies.accessToken ? cookies.accessToken : null;
  if (!user) {
    return {
      redirect: {
        destination: '/sign-up',
        permanent: false,
      },
    };
  }
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'date',
    orderDirection: 'DESC',
    categoriesIds: [],
    onlyShowUnclaimed: true,
    token,
  });

  if (!newsletterList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
    },
  };
};
export default ClaimNewslettersPage;

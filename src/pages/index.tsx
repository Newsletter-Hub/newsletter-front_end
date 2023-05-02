import Head from 'next/head';
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Layout from '@/components/Layout';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';
import TrendingNewslettersBlock from '@/components/HomePage/TrendingNewslettersBlock';
import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import { getCookies } from 'cookies-next';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="bg-white px-32 pt-32">
          <MainBlock />
          <ReviewsBlock />
          <TrendingNewslettersBlock />
          <GetStartedBlock />
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

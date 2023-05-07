import { ReactElement } from 'react';

import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';
import TrendingNewslettersBlock from '@/components/HomePage/TrendingNewslettersBlock';
import Layout from '@/components/Layout';

import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <main>
        <div className="px-32 pt-32">
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

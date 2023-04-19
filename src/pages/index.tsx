import Head from 'next/head';
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Layout from '@/components/Layout';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="bg-white px-32 pt-32">
        <div className="flex">
          <h1 className="text-7xl">
            Your Hub for Newsletter Reviews and Discovery
          </h1>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

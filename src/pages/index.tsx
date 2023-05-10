import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import { getUserMe } from '@/pages/api/user';

import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';
import TrendingNewslettersBlock from '@/components/HomePage/TrendingNewslettersBlock';
import withLayout from '@/components/withLayout';

const Home = () => {
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

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  if (token) {
    const response = await getUserMe({ token });
    return {
      props: {
        user: response,
      },
    };
  }

  return {
    props: {
      user: null,
    },
  };
};

export default withLayout(Home);

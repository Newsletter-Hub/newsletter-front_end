import { getReviews } from '@/actions/newsletters/reviews';

import { Review } from '@/types/newsletters';

import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';

interface HomeProps {
  reviewData: { reviews: Review[]; nextPage: number; total: number };
}

const Home = ({ reviewData }: HomeProps) => {
  return (
    <main>
      <div className="lg:pt-[88px] pt-16 max-w-[1280px] mx-auto px-4">
        <MainBlock />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8804004591913052"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8804004591913052"
          data-ad-slot="2040931016"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <ReviewsBlock reviewData={reviewData} />
      </div>
      {/* <GetStartedBlock /> */}
    </main>
  );
};

export const getServerSideProps = async () => {
  const reviewData = await getReviews({ page: 1, pageSize: 5 });
  if (!reviewData) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      reviewData: reviewData.reviews || null,
    },
  };
};

export default Home;

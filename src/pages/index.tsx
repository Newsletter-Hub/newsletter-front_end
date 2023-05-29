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
    <>
      <main>
        <div className="lg:px-[17%] lg:pt-32 pt-16 px-[5%]">
          <MainBlock />
          <ReviewsBlock reviewData={reviewData} />
        </div>
        <GetStartedBlock />
      </main>
    </>
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

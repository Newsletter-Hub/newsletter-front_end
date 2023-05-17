import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';
import TrendingNewslettersBlock from '@/components/HomePage/TrendingNewslettersBlock';

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

export default Home;

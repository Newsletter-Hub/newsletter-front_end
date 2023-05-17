import GetStartedBlock from '@/components/HomePage/GetStartedBlock';
import MainBlock from '@/components/HomePage/MainBlock';
import ReviewsBlock from '@/components/HomePage/ReviewsBlock';

const Home = () => {
  return (
    <>
      <main>
        <div className="px-32 pt-32">
          <MainBlock />
          <ReviewsBlock />
        </div>
        <GetStartedBlock />
      </main>
    </>
  );
};

export default Home;

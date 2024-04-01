import TopBanner from '@/components/Subscription/TopBanner';

const Subscription = () => {
  return (
    <main className="flex flex-col items-center pt-20">
      <TopBanner />
    </main>
  );
};

Subscription.title = 'Subscription | Newsletter Hub';
Subscription.description = 'Choose your plan';

export default Subscription;

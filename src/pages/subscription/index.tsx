import TopBanner from '@/components/Subscription/TopBanner';
import Benefits from '@/components/Subscription/Benefits';
import HowItWorks from '@/components/Subscription/HowItWorks';
import ChoosePlan from '@/components/Subscription/ChoosePlan';

const Subscription = () => {
  return (
    <main className="flex flex-col items-center pt-20 gap-y-24">
      <TopBanner />
      <Benefits />
      <HowItWorks />
      <ChoosePlan />
    </main>
  );
};

Subscription.title = 'Subscription | Newsletter Hub';
Subscription.description = 'Choose your plan';

export default Subscription;

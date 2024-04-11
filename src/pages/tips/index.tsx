import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import PrivateRoute from '@/components/PrivateRoute';
// import TopBanner from '@/components/Subscription/TopBanner';
// import Benefits from '@/components/Subscription/Benefits';
// import HowItWorks from '@/components/Subscription/HowItWorks';
// import ChoosePlan from '@/components/Subscription/ChoosePlan';

// import { getUserMe } from '@/actions/user';
import { getTips } from '@/actions/tips/index';

import { User } from '@/types/user';
// import { GetUserSubscriptionResponse } from '@/types/paymentSubscription.type';

interface TipsProps {
  tips: any;
}

const Tips = ({ tips }: TipsProps) => {
  console.log('tips', tips);

  return (
    <PrivateRoute>
      <div className="flex flex-col items-center pt-20 gap-y-24">
        {/* <TopBanner />
        <Benefits />
        <HowItWorks />
        <ChoosePlan
          userMe={userMe}
          subscription={{
            isActive: subscription.response?.subscription?.isActive || null,
            isExpired: subscription.response?.subscription?.isExpired || null,
          }}
          token={token}
        /> */}
      </div>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { query } = context;
  const { newsletterId } = query;
  const cookies = parseCookies(context);
  const user = cookies.user as User | undefined;
  const token = cookies.accessToken ? cookies.accessToken : null;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  let tips = null;
  if (token) {
    tips = await getTips({ token });
  }

  return {
    props: { newsletterId, tips: tips?.response?.tips },
  };
};

Tips.title = 'Tips | Newsletter Hub';
Tips.description = 'Your tips';

export default Tips;

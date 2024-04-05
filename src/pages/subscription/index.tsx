import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

import PrivateRoute from '@/components/PrivateRoute';
import TopBanner from '@/components/Subscription/TopBanner';
import Benefits from '@/components/Subscription/Benefits';
import HowItWorks from '@/components/Subscription/HowItWorks';
import ChoosePlan from '@/components/Subscription/ChoosePlan';

import { getUserMe } from '@/actions/user';

import { User } from '@/types/user';

interface SubscriptionProps {
  userMe: User;
}

const Subscription = ({ userMe }: SubscriptionProps) => {
  return (
    <PrivateRoute>
      <div className="flex flex-col items-center pt-20 gap-y-24">
        <TopBanner />
        <Benefits />
        <HowItWorks />
        <ChoosePlan userMe={userMe} />
      </div>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
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

  let userMe = null;
  if (token) {
    userMe = await getUserMe({ token });
  }

  return {
    props: {
      userMe: userMe?.response,
    },
  };
};

Subscription.title = 'Subscription | Newsletter Hub';
Subscription.description = 'Choose your plan';

export default Subscription;

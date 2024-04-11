import { GetServerSideProps } from 'next';
import Link from 'next/link';
import parseCookies from 'next-cookies';

import PrivateRoute from '@/components/PrivateRoute';

import ArrowLeft from '@/assets/icons/arrowLeft';
import TipItem from '@/components/Tips/TipItem';

import { getTips } from '@/actions/tips/index';

import { User } from '@/types/user';
import { GetTipsResponse } from '@/types/tips.type';

const Tips = ({ tips }: GetTipsResponse) => {
  console.log('tips', tips);

  return (
    <PrivateRoute>
      <div className="flex flex-col items-start xs:pt-6 xs:px-2.5 pt-20 gap-y-10 max-w-[1062px] mx-auto">
        <Link
          href="/profile/newsletters-owned"
          className="flex items-center gap-x-3 font-inter text-lg"
        >
          <ArrowLeft className="stroke-black" />
          Back to Your Newsletters
        </Link>

        <h2 className="font-medium text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-lightBlack">
          Tips
        </h2>

        <ul className="w-full">
          {tips.map(({ tipper, amount, note, createdAt }, i) => (
            <TipItem
              key={i}
              tipper={tipper}
              amount={amount}
              note={note || ''}
              date={createdAt}
              isLastItem={tips.length - 1 === i ? true : false}
            />
          ))}
        </ul>
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

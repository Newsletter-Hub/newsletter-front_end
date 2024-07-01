import { GetServerSideProps } from 'next';
import Link from 'next/link';
import parseCookies from 'next-cookies';
import { useRouter } from 'next/router';
import { useState } from 'react';

import PrivateRoute from '@/components/PrivateRoute';

import ArrowLeft from '@/assets/icons/arrowLeft';
import TipItem from '@/components/Tips/TipItem';
import Button from '@/components/Button';

import { getTips } from '@/actions/tips/index';

import { User } from '@/types/user';
import { GetTipsResponse } from '@/types/tips.type';

const TIPS_PER_PAGE = '5';

const Tips = ({ tips: initialTips, token }: GetTipsResponse) => {
  const [tips, setTips] = useState(initialTips);

  const router = useRouter();
  const { query } = router;

  const newsletterId = query.newsletterId as string;

  // const loadMore = async () => {
  //   const response = await getTips(Number(newsletterId));
  //   console.log('response', response);

  //   // const loadMore = async () => {
  //   //   const response = await getTips({
  //   //     token,
  //   //     newsletterId,
  //   //     page: String(tips.nextPage),
  //   //     limit: TIPS_PER_PAGE,
  //   //   });

  //   // setTips(prevTips => ({
  //   //   ...prevTips,
  //   //   ...response.response?.tips,
  //   //   tips: [...prevTips.tips, ...(response.response?.tips.tips || [])],
  //   // }));

  //   // setTips(prevTips => ({
  //   //   ...prevTips,
  //   //   ...response.response?.tips,
  //   //   tips: [...prevTips.tips, ...(response.response?.tips.tips || [])],
  //   // }));
  // };

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
          {tips.tips.map(({ tipper, amount, note, createdAt }, i) => (
            <TipItem
              key={i}
              tipper={tipper}
              amount={amount}
              note={note || ''}
              date={createdAt}
              isLastItem={tips.tips.length - 1 === i ? true : false}
            />
          ))}
        </ul>

        <Button
          label={tips.nextPage ? 'Load more' : "That's all"}
          variant="outlined-secondary"
          size="md"
          customStyles="mx-auto"
          disabled={!tips.nextPage}
          // onClick={loadMore}
        />
      </div>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { query } = context;
  const newsletterId =
    typeof query.newsletterId === 'string' && query.newsletterId;
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
  if (token && newsletterId) {
    tips = await getTips(Number(newsletterId));
    console.log('tips', tips);
  }
  // if (token && newsletterId) {
  //   tips = await getTips({
  //     token,
  //     newsletterId,
  //     page: '1',
  //     limit: TIPS_PER_PAGE,
  //   });
  // }

  return {
    props: { tips: tips?.response?.tips, token },
  };
};

Tips.title = 'Tips | Newsletter Hub';
Tips.description = 'Your tips';

export default Tips;

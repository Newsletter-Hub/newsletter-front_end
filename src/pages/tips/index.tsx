import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import parseCookies from 'next-cookies';

import PrivateRoute from '@/components/PrivateRoute';
import TipItem from '@/components/Tips/TipItem';
import Button from '@/components/Button';

import ArrowLeft from '@/assets/icons/arrowLeft';

import { getTips } from '@/actions/tips';
import { User } from '@/types/user';
import { TipItemModel } from '@/types/tips.type';

const TIPS_PER_PAGE = '3';

interface TipsProps {
  tips: TipItemModel[];
  total: number;
  prevPage: undefined | number;
  nextPage: undefined | number;
  lastPage: number;
  currentPage: number;
}

const Tips = (initialTips: TipsProps) => {
  const [tips, setTips] = useState(initialTips);

  const isTips = !!initialTips?.tips?.length;

  const router = useRouter();
  const { query } = router;

  const newsletterId = query.newsletterId as string;

  const loadMore = async () => {
    if (!tips?.nextPage) return;

    const response = await getTips({
      newsletterId: Number(newsletterId),
      page: tips.nextPage,
      limit: TIPS_PER_PAGE,
    });

    setTips(prevTips => ({
      ...prevTips,
      ...response?.data,
      tips: [...prevTips.tips, ...(response?.data?.tips || [])],
    }));
  };

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
          {isTips
            ? tips.tips.map(({ payer, amount, comment, createdAt }, i) => (
                <TipItem
                  key={i}
                  tipper={payer}
                  amount={amount}
                  note={comment || ''}
                  date={createdAt}
                  isLastItem={tips?.tips?.length - 1 === i ? true : false}
                />
              ))
            : 'There are no tips ...'}
        </ul>

        <Button
          label={tips.nextPage ? 'Load more' : "That's all"}
          variant="outlined-secondary"
          size="md"
          customStyles="mx-auto"
          disabled={!tips.nextPage}
          onClick={loadMore}
        />
      </div>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { query } = context;
  const newsletterId =
    typeof query?.newsletterId === 'string' && query.newsletterId;
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
    const response = await getTips({
      newsletterId: Number(newsletterId),
      page: 1,
      limit: TIPS_PER_PAGE,
    });
    tips = response?.data;
  }

  return {
    props: { ...tips },
  };
};

export default Tips;

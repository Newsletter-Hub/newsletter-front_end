import { GetServerSideProps } from 'next';
import Link from 'next/link';
import parseCookies from 'next-cookies';

import ArrowLeft from '@/assets/icons/arrowLeft';

import { getTips } from '@/actions/tips';
import { User } from '@/types/user';
import { TipItem } from '@/types/tips.type';

const Tips = ({ tips }: { tips: TipItem[] }) => {
  console.log('tips', tips);

  return (
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
    </div>
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

  let tips: TipItem[] = [];
  if (token && newsletterId) {
    const response = await getTips(Number(newsletterId));
    tips = response?.data?.tips || [];
  }

  return {
    props: { tips },
  };
};

export default Tips;

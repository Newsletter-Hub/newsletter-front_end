import { ParsedUrlQuery } from 'querystring';

import { GetServerSidePropsContext } from 'next';
import parseCookies from 'next-cookies';

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  const cookies = parseCookies(context);
  const user = cookies.user || null;

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

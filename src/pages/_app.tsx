import { getUserMe } from '@/actions/user';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NextPage, NextPageContext } from 'next';
import parseCookies from 'next-cookies';
import type { AppProps } from 'next/app';

import withLayout, { EntryType, LayoutType } from '@/components/withLayout';

import '@/styles/globals.css';

const queryClient = new QueryClient();

type MyComponentType = NextPage & {
  layout?: LayoutType;
  type?: EntryType;
};
function MyApp({
  Component,
  pageProps,
}: AppProps & { Component: MyComponentType }) {
  const LayoutComponent = withLayout(Component, Component.layout, {
    type: Component.type as EntryType,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutComponent {...pageProps} />
      <ToastContainer position="top-right" autoClose={1500} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: NextPage;
  ctx: NextPageContext;
}) => {
  let pageProps = {};

  if (typeof Component.getInitialProps === 'function') {
    pageProps = await Component.getInitialProps(ctx);
  }

  const cookies = parseCookies(ctx);
  const token = cookies.accessToken ? cookies.accessToken : null;

  if (token) {
    const response = await getUserMe({ token });
    return { pageProps: { ...pageProps, user: response } };
  }

  return { pageProps: { ...pageProps, user: null } };
};

export default MyApp;

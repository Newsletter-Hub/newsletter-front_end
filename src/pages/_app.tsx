import { getUserMe } from '@/actions/user';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NextPage } from 'next';
import parseCookies from 'next-cookies';
import type { AppContext, AppProps } from 'next/app';

import { UserMe } from '@/types/user';

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
  user,
}: AppProps & { Component: MyComponentType; user: UserMe }) {
  const LayoutComponent = withLayout(Component, Component.layout, {
    type: Component.type as EntryType,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider defaultUser={user}>
        <LayoutComponent {...pageProps} />
      </UserProvider>
      <ToastContainer position="top-right" autoClose={1500} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;
  const cookies = parseCookies(ctx);
  const token = cookies.accessToken ? cookies.accessToken : null;

  let user = null;
  if (token) {
    user = await getUserMe({ token });
  }

  return { user: user?.response };
};

export default MyApp;

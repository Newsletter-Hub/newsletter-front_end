/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { getUserMe } from '@/actions/user';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NextPage } from 'next';
import parseCookies from 'next-cookies';
import type { AppContext, AppProps } from 'next/app';
import Script from 'next/script';

import { User } from '@/types/user';

import withLayout, { EntryType, LayoutType } from '@/components/withLayout';

import '@/styles/globals.css';


const queryClient = new QueryClient();

type MyComponentType = NextPage & {
  layout?: LayoutType;
  type?: EntryType;
  title?: string;
  description?: string;
};
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    displayPreferenceModal?: any;
  }
}
function MyApp({
  Component,
  pageProps,
  user,
}: AppProps & { Component: MyComponentType; user: User }) {
  const LayoutComponent = withLayout(
    Component,
    Component.layout,
    Component.title,
    Component.description,
    {
      type: Component.type as EntryType,
    }
  );
  return (
    <>
      <Script
        src="https://app.termly.io/resource-blocker/b185aa98-dd3c-4278-ae9f-97c364ddebf5?autoBlock=on"
        strategy="beforeInteractive"
        async
      />
      <QueryClientProvider client={queryClient}>
        <UserProvider defaultUser={user}>
          <LayoutComponent {...pageProps} />
        </UserProvider>
        <ToastContainer position="top-right" autoClose={1500} />
      </QueryClientProvider>
    </>
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

  return { user: user?.response || null };
};

export default MyApp;

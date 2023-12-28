import { getUserMe } from '@/actions/user';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NextPage } from 'next';
import parseCookies from 'next-cookies';
import type { AppContext, AppProps } from 'next/app';

import { User } from '@/types/user';

import withLayout, { EntryType, LayoutType } from '@/components/withLayout';

import '@/styles/globals.css';
import Head from 'next/head';

const queryClient = new QueryClient();

type MyComponentType = NextPage & {
  layout?: LayoutType;
  type?: EntryType;
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
  const LayoutComponent = withLayout(Component, Component.layout, {
    type: Component.type as EntryType,
  });
  return (
    <>
      <Head>
        <script>
          {`
            // Define dataLayer and the gtag function.
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}// Default all categories to 'denied' 
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'denied',
              'social_storage': 'denied',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
            });
        `}
        </script>
        <script
          async
          type="text/javascript"
          src="https://app.termly.io/resource-blocker/b185aa98-dd3c-4278-ae9f-97c364ddebf5?autoBlock=on"
        ></script>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_DATA_AD_CLIENT}`}
          crossOrigin="anonymous"
        ></script>
      </Head>
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

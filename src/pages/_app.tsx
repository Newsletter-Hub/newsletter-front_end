import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NextPage } from 'next';
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

export default MyApp;

import { ReactElement, ReactNode } from 'react';

import { Alegreya } from 'next/font/google';
import Head from 'next/head';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={alegreya.className}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;

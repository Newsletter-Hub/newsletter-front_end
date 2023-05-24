import { ReactNode } from 'react';

import { Alegreya } from 'next/font/google';
import Head from 'next/head';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  isFooter?: boolean;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({ children, isFooter }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={alegreya.className}>
        <Header />
        {children}
        {isFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;

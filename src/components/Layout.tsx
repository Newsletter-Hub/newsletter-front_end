import { ReactElement, ReactNode } from 'react';

import { Alegreya } from 'next/font/google';
import Head from 'next/head';

import { UserMe } from '@/types/user';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  user?: UserMe | null;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={alegreya.className}>
        <Header user={user} />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;

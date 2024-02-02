import { ReactNode } from 'react';

import { Alegreya } from 'next/font/google';
import Head from 'next/head';

import Footer from './Footer';
import Header from './Header';
import AdblockModal from './Modals/AdblockModal';

interface LayoutProps {
  children: ReactNode;
  isFooter?: boolean;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({ children, isFooter = true }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={alegreya.className}>
        <Header />
        <AdblockModal />
        <div className={`overflow-x-hidden ${isFooter && 'pb-5'}`}>
          <div className="mx-auto">{children}</div>
          {isFooter && <Footer />}
        </div>
      </div>
    </>
  );
};

export default Layout;

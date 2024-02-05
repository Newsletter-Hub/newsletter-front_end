import { ReactNode } from 'react';

import { Alegreya } from 'next/font/google';
import Head from 'next/head';

import Footer from './Footer';
import Header from './Header';
import AdblockModal from './Modals/AdblockModal';

interface LayoutProps {
  children: ReactNode;
  isFooter?: boolean;
  title: string;
  description: string;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({
  children,
  isFooter = true,
  title = 'Top Newsletters Discovery & Reviews | Join Newsletter Hub Today',
  description = 'Find the best newsletters to subscribe to across various categories. Follow leading newsletters and users, and be part of a community that celebrates quality content.',
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />{' '}
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

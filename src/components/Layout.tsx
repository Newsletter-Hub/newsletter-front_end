import type { ReactElement } from 'react';

import { Alegreya } from 'next/font/google';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactElement;
}

const alegreya = Alegreya({ subsets: ['latin'] });

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={alegreya.className}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

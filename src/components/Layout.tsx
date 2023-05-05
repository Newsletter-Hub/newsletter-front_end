import type { ReactElement } from 'react';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="font-body">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

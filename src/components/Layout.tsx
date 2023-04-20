import type { ReactElement } from 'react';
import Header from './Header';
import Footer from './Footer';

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

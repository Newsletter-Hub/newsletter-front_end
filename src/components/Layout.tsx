import type { ReactElement } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;

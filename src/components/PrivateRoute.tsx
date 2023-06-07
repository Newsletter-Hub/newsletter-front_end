import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

import { useUser } from '../contexts/UserContext';
import Loading from './Loading';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return <Loading fullScreen />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

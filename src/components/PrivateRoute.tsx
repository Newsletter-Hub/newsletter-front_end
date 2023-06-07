import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

import { useUser } from '../contexts/UserContext';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  return <>{children}</>;
};

export default PrivateRoute;

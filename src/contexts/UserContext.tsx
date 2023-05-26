import React, { ReactNode, createContext, useContext, useState } from 'react';

import { UserMe } from '@/types/user';

interface UserContext {
  user: UserMe | null;
  setUser: React.Dispatch<React.SetStateAction<UserMe | null>>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  defaultUser: UserMe | null;
}

export const UserProvider = ({ children, defaultUser }: UserProviderProps) => {
  console.log(defaultUser);
  const [user, setUser] = useState<UserMe | null>(defaultUser || null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

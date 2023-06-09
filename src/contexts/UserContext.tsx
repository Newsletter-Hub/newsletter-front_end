import React, { ReactNode, createContext, useContext, useState } from 'react';

import { User } from '@/types/user';

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  defaultUser: User | null;
}

export const UserProvider = ({ children, defaultUser }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(defaultUser || null);

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

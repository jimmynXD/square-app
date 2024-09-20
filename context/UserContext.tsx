'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  userId: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

import { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface User {
  // Define your user type
}

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => null,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const value: UserContextProps = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
import { createContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { createUserDocumentFromAuth, loginAsUser, onAuthStateChangedListener } from '../utils/firebase/firebase.utils';
import { User } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore';

interface UserContextProps {
  currentUser: DocumentData | null | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>;
  loginUser: (advertiserId: string) => Promise<void>;
}

export const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => null,
  loginUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<DocumentData | null>();

  const loginUser = async (advertiserId: string)  => {
    const user = await loginAsUser(advertiserId);
    if (user && user.advertiserId === advertiserId) {
      setCurrentUser(user);
    }
  }

  const value: UserContextProps = { currentUser, setCurrentUser, loginUser};

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user: User) => {
      if (user) {
        try {
          const userDocument = await createUserDocumentFromAuth(user);
          setCurrentUser(userDocument);
        } catch (error: any) {
          console.error('Error creating/retrieving user document:', error.message);
        } finally {

        }
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
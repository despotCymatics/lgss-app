import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  DocumentReference,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  getFirestore,
  setDoc,
  DocumentData,
  collection,
  query,
  where,
} from 'firebase/firestore';

export interface LPUser {
  id: string;
  email: string;
  displayName: string;
  advertiserId: string;
  role: string;
}

interface CreateUserParams {
  email: string;
  password: string;
  displayName: string;
  advertiserId: string;
}

interface CreateUserResult {
  success: boolean;
  error?: string;
  user?: UserCredential;
}

interface SignInUserParams {
  email: string;
  password: string;
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

//console.log(firebaseConfig);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
//export const signInWithPopup = () => { }

export const db = getFirestore();

interface AdditionalInformation {
  [key: string]: any;
}

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation?: AdditionalInformation
): Promise<DocumentData | null> => {
  if (!userAuth) return null;

  const userDocRef: DocumentReference = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (err: any) {
      console.error('Error creating the user', err.message);
      throw err; // Rethrow the error to propagate it up the call stack if needed
    }
  }

  return userSnapshot.data() ?? null;
};

export const createUser = async ({
  email,
  password,
  displayName,
  advertiserId,
}: CreateUserParams): Promise<CreateUserResult> => {
  if (!email || !password || !displayName || !advertiserId) {
    throw new Error('Missing fields!');
  }
  try {
    const userResponse: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userResponse.user.uid) {
      // Create user document
      const docResponse = await createUserDocumentFromAuth(userResponse.user, {
        displayName,
        advertiserId,
        role: 'buyer',
      });
      console.log(docResponse);

      return { success: true, user: userResponse };
    } else {
      throw new Error('User creation failed unexpectedly.');
    }
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    return { success: false, error: error.message as string };
  }
};

export const updateUser = async ({
  id,
  email,
  displayName,
  advertiserId,
  role,
}: {
  id: string;
  email?: string;
  displayName?: string;
  advertiserId?: string;
  role?: string;
}): Promise<{ success: boolean; error?: string }> => {
  if (!id) {
      throw new Error('Missing user ID!');
  }

  const firestore = getFirestore(firebaseApp);

  try {
      const userRef = doc(firestore, 'users', id);

      const updatedData: { [key: string]: string | undefined } = {};
      if (email) updatedData.email = email;
      if (displayName) updatedData.displayName = displayName;
      if (advertiserId) updatedData.advertiserId = advertiserId;
      if (role) updatedData.role = role;

      await updateDoc(userRef, updatedData);

      return { success: true };
  } catch (error: any) {
      console.error('Error in editUser:', error.message);
      return { success: false, error: error.message as string };
  }
};

export const loginAsUser = async (advertiserId: string) => {
  const firestore = getFirestore(firebaseApp);

  try {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, where('advertiserId', '==', advertiserId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as LPUser;
    } else {
      console.error('No user found with the given advertiserId');
    }
  } catch (error: any) {
    console.error('Error logging in as user:', error.message);
  }
};

export const signInUser = async ({ email, password }: SignInUserParams) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const SignOutUser = () => signOut(auth);

export const onAuthStateChangedListener = (callback: any) => {
  onAuthStateChanged(auth, callback);
};

export  const fetchUsers = async () => {
  const firestore = getFirestore(firebaseApp);
  const usersCollection = collection(firestore, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LPUser));  
  
  return usersList;
};


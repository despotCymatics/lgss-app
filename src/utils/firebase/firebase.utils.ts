
import {initializeApp} from 'firebase/app'
import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, User, UserCredential, signInWithEmailAndPassword} from 'firebase/auth'
import { DocumentReference, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

interface CreateUserParams {
  email: string;
  password: string;
  displayName: string;
  advertiserId: string;
}

interface CreateUserResult {
  success: boolean;
  error?: string;
  user?: UserCredential
}

interface SignInUserParams {
  email: string;
  password: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyAZOS7FSyEQX4WZb8Bj9s5qM7PZbElr_0g",
  authDomain: "lgss-db.firebaseapp.com",
  projectId: "lgss-db",
  storageBucket: "lgss-db.appspot.com",
  messagingSenderId: "967093546241",
  appId: "1:967093546241:web:51a16e0c1e59af58527f00"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account'
})

export const auth = getAuth()
//export const signInWithPopup = () => { }

export const db = getFirestore()

interface AdditionalInformation {
  [key: string]: any;
}

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: AdditionalInformation
): Promise<void> => {
  if (!userAuth) return;

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
    const userResponse: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (userResponse.user.uid) {
      // Create user document
      const docResponse = await createUserDocumentFromAuth(userResponse.user, { displayName, advertiserId, role:'buyer' });
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

export const signInUser = async ({email, password}: SignInUserParams) => {

 return await signInWithEmailAndPassword(auth, email, password)
}
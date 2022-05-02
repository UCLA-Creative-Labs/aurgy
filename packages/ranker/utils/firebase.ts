import firebase from 'firebase/compat/app';
import {DocumentReference, arrayUnion, doc, Firestore, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore';

const FIREBASE_PROD = {
  apiKey: 'AIzaSyBvE0smBOTAgVcV6zSoRzeGqG41fCcpxRg',
  projectId: 'aurgy-bfd43',
};

!firebase.apps.length
  ? (firebase.initializeApp(FIREBASE_PROD))
  : firebase.app();

interface PutFieldProps {
  path: string;
  key: string;
  value: any;
}

interface GetProps {
  path: string;
}

interface PutProps {
  path: string;
  data: Record<string, any>;
  defaults?: Record<string, any>;
}

export class _Firebase {
  public readonly db: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  public doc(path: string): DocumentReference {
    return doc(this.db, path);
  }

  public async get({path}: GetProps): Promise<any | null> {
    const docRef = this.doc(path);
    const item = await getDoc(docRef);
    if (!item.exists()) return null;
    return item.data();
  }

  public async put({path, data, defaults = {}}: PutProps): Promise<boolean> {
    const docRef = this.doc(path);
    const item = await getDoc(docRef);
    const action = item.exists()
      ? updateDoc(docRef, data)
      : setDoc(docRef, {...data, ...defaults});

    return action
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  public async updateArrayField({path, key, value}: PutFieldProps): Promise<boolean> {
    const docRef = this.doc(path);
    const item = await getDoc(docRef);
    if (!item.exists) return false;
    return updateDoc(docRef, {[key]: arrayUnion(value)})
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

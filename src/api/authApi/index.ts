import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { firebaseAuth } from "@/firebase/firebase-config";

export const createUser = async (correo: string, password?: string) => {
  await createUserWithEmailAndPassword(
    firebaseAuth,
    correo,
    password ? password : correo
  );
};

export const signIn = async (correo: string, password?: string) => {
  return await signInWithEmailAndPassword(
    firebaseAuth,
    correo,
    password ? password : correo
  );
};

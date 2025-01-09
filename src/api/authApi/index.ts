import { createUserWithEmailAndPassword } from "firebase/auth";

import { firebaseAuth } from "@/firebase/firebase-config";

export const createUser = async (correo: string, password?: string) => {
  await createUserWithEmailAndPassword(firebaseAuth, correo, password ? password : correo);
};

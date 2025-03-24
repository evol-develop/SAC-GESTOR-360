import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";

import { firebaseDB as db } from "@/firebase/firebase-config";
import { type AuthState } from "@/contexts/Auth/types";

export const createItem = async (
  collectionName: string,
  data: any,
  withEmpresa = true
) => {
  const idEmpresa = getIdEmpresa();
  if (withEmpresa) data = { ...data, idEmpresa };

  const colRef = collection(db, collectionName);
  const result = await addDoc(colRef, data);
  return { ...data, id: result.id };
};

export const getItemById = async (collectionName: string, id: string) => {
  if (!id) return;
  const docRef = doc(db, collectionName, id);
  const result = await getDoc(docRef);
  return { ...result.data(), id: result.id };
};

export const updateItem = async (
  collectionName: string,
  id: string,
  data: any
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
  return await getItemById(collectionName, id);
};

export const deleteItem = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const getItemsByCondition = async (
  collectionName: string,
  campo: string,
  operador: WhereFilterOp,
  valor: any
) => {
  const colRef = collection(db, collectionName);
  const result = await getDocs(
    query(
      colRef,
      where(campo, operador, valor),
      where("idEmpresa", "==", getIdEmpresa())
    )
  );
  return getArrayFromCollection(result);
};

export const getItemsByConditionNoIdEmpresa = async (
  collectionName: string,
  campo: string,
  operador: WhereFilterOp,
  valor: any
) => {
  const colRef = collection(db, collectionName);
  const result = await getDocs(query(colRef, where(campo, operador, valor)));
  return getArrayFromCollection(result);
};

const getArrayFromCollection = (collection: QuerySnapshot<DocumentData>) => {
  return collection.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getIdEmpresa = () => {
  const AuthState = JSON.parse(
    localStorage.getItem("AuthState") || "{}"
  ) as AuthState;
  return AuthState?.user?.empresa?.id || "";
};

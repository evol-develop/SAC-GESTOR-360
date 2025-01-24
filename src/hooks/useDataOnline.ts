import {
  WhereFilterOp,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { firebaseDB } from "@/firebase/firebase-config";

interface Props {
  collectionName: string;
  campo: string;
  operador: WhereFilterOp;
  valor: any;
  limite?: number;
}

export const useDataOnline = ({
  collectionName,
  campo,
  operador,
  valor,
  limite = 10,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const { idEmpresa } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = query(
          collection(firebaseDB, collectionName),
          where(campo, operador, valor),
          where("idEmpresa", "==", idEmpresa),
          limit(limite)
        );
        onSnapshot(response, (querySnapshot) => {
          const retrivedData = querySnapshot.docs.map((item) => {
            return { ...item.data(), id: item.id };
          });
          setData(retrivedData);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [collectionName, campo, operador, valor, limite, idEmpresa]);

  return {
    data,
  };
};

export const useNotificaciones = ({
  collectionName,
  campo,
  operador,
  valor,
  limite = 10,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const { idEmpresa } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = query(
          collection(firebaseDB, collectionName),
          where(campo, operador, valor),
          where("idEmpresa", "==", idEmpresa),
          orderBy("fecha", "desc"),
          limit(limite)
        );
        onSnapshot(response, (querySnapshot) => {
          const retrivedData = querySnapshot.docs.map((item) => {
            return { ...item.data(), id: item.id };
          });
          setData(retrivedData);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [collectionName, campo, operador, valor, limite, idEmpresa]);

  return {
    data,
  };
};

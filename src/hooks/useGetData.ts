import { useEffect } from "react";
import { usePage } from "./usePage";
import { createSlot } from "@/store/slices/page";
import axiosIns from "@/lib/utils/axios";
import axios from "axios";

type GetDataProps = {
  /**
   * Ruta de la API
   * @example '/api/user/getusers'
   * @type {string}
   */
  ruta: string;
  /**
   * Slot de la página
   * @example 'users'
   * @type {string}
   */
  slot: string;
};

export const useGetData = ({ ruta, slot }: GetDataProps) => {
  const { init, dispatch } = usePage(slot);

  useEffect(() => {
    const controller = new AbortController(); // Reemplaza CancelToken por AbortController
    const getData = async () => {
      try {
        const response = await axiosIns.get(ruta, {
          signal: controller.signal,
        });

        dispatch(createSlot({ [slot]: response.data.result }));
      } catch (err) {
        if (axios.isCancel(err) || (err as Error).name === "CanceledError") {
          console.error("Error Request:", (err as Error).message);
        } else {
          console.error(err);
        }
      }
    };
    init();
    getData();

    return () => {
      controller.abort();
    };
  }, [init, dispatch, ruta, slot]);
};

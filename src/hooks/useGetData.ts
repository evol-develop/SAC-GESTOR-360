import axios from "axios";
import { useEffect } from "react";

import {
  unreadNotificationsCount,
  useNotifications,
} from "@/hooks/useNotifications";
import { useAuth } from "./useAuth";
import { usePage } from "@/hooks/usePage";
import { createSlot } from "@/store/slices/page";
import axiosIns, { axiosIns2 } from "@/lib/utils/axios";

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
  /**
   * Slot de la página
   * @example 'users'
   * @type {string}
   */
  facturacion?: boolean;
};

export const useGetData = ({ ruta, slot, facturacion }: GetDataProps) => {
  const { init, dispatch } = usePage(slot);

  useEffect(() => {
    const controller = new AbortController(); // Reemplaza CancelToken por AbortController
    const getData = async () => {
      try {
        if (facturacion) {
          const response = await axiosIns2.get(ruta, {
            signal: controller.signal,
          });

          dispatch(createSlot({ [slot]: response.data.result }));
        } else {
          const response = await axiosIns.get(ruta, {
            signal: controller.signal,
          });

          dispatch(createSlot({ [slot]: response.data.result }));
        }
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

/**
 * Hook para obtener datos de la API cuando llega una notificación
 */
export const useNotificationExecute = ({ ruta, slot }: GetDataProps) => {
  const { authState } = useAuth();
  const { init, dispatch } = usePage(slot);
  const { notifications } = useNotifications();
  const unread = unreadNotificationsCount(notifications, authState);

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await axiosIns.get(ruta, {
          signal: controller.signal,
        });

        dispatch(createSlot({ [slot]: response.data.result }));
      } catch (err) {
        if (axios.isCancel(err) || (err as Error).name === "CanceledError") {
          console.error(
            "Solicitud cancelada por Hook:",
            (err as Error).message
          );
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
  }, [init, dispatch, ruta, slot, unread]);
};

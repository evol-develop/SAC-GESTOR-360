import { useState } from "react";
import { appConfig } from "@/appConfig";
import { clearSlot, initPage } from "@/store/slices/page";
import { useAppDispatch } from "./storeHooks";

export const usePage = (page?: string) => {
  const dispatch = useAppDispatch();
  const namePage = page ? page : "";
  const [pageName] = useState(
    appConfig.NOMBRE +
      " - " +
      namePage.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  );

  const init = () => {
    dispatch(clearSlot());
    dispatch(initPage(pageName));
  };

  return {
    init,
    dispatch,
    pageName,
  };
};

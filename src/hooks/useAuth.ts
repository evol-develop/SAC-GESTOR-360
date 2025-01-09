import { useContext } from "react";

import AuthContext from "@/contexts/Auth/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor AuthContext");
  }
  return context;
};

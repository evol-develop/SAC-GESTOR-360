import { LuLoaderCircle } from "react-icons/lu";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";

interface Props {
  children: React.ReactNode;
}

const Authenticated = ({ children }: Props) => {
  const { authState } = useAuth();
  const location = useLocation();
  const permisos = useAppSelector(
    (state: RootState) => state.permisos.slots.PERMISOS
  ) as any[];

  // Validación de inicialización
  if (!authState) {
    return <Navigate to={"/"} />;
  }

  // Validación de permisos
  if (!permisos) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LuLoaderCircle className="animate-spin" size={48} />
      </div>
    );
  }

  console.log(location.pathname)

  const currentPath = location.pathname
  .replace(/^\/site\//, "")  // Elimina "/site/"
  .replace(/\/[0-9a-fA-F-]{36}\b/g, "") // Elimina el UUID al final
  .replace(/(\/\d+)+$/g, ""); // Elimina todos los segmentos numéricos al final

  console.log(currentPath)

  if (currentPath !== "/site") {
    const permiso = permisos.find((p) => p.ruta === currentPath);

    if (!permiso) {
      return <Navigate to={"/"} />;
    }
  }

  return <>{children}</>;
};

export default Authenticated;

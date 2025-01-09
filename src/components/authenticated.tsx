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

  const currentPath = location.pathname
    .replace("/site/", "")
    .replace(/\/$/, "");
  if (currentPath !== "/site") {
    const permiso = permisos.find((p) => p.ruta === currentPath);

    if (!permiso) {
      return <Navigate to={"/"} />;
    }
  }

  return <>{children}</>;
};

export default Authenticated;

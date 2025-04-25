import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";

import { Menu } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { AuthService } from "@/services/auth.service";

const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const permisos = useAppSelector(
    (state: RootState) => state.permisos.slots.PERMISOS
  ) as Menu[] | undefined;
  const [loading, setLoading] = useState(true);

  // Componente para el loader
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full h-screen">
      <LuLoaderCircle className="animate-spin" size={48} />
    </div>
  );

  const getNormalizedPath = (path: string): string => {
    return path
    .replace(/^\/site\//, "")  // Elimina "/site/"
    //.replace(/\/[0-9a-fA-F-]{36}\b/g, "") // Elimina el UUID al final
    .replace(/\/null\b/g, "")
    .replace(/(\/\d+)+$/g, "") // Elimina todos los segmentos numéricos al final  
   
      // .replace(/^\/site\//, "") // Elimina /site/ del inicio
      // .replace(/\/{2,}/g, "/") // Elimina múltiples slashes consecutivos
      // .replace(/\/$/, "") // Elimina el slash final
    //.toLowerCase(); // Normaliza a minúsculas
  };

  useEffect(() => {
    const validateUserSession = async () => {
      if (!authState.user) {
        try {
          const user = await AuthService.validateSession();
          if (!user) {
            throw new Error("Sesión inválida");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error validando sesión:", error);
          setLoading(false);
          navigate("/", { replace: true, state: { from: location } });
        }
      } else {
        setLoading(false);
      }
    };

    validateUserSession();
  }, [authState.user, location, navigate]);

  if (loading || !permisos || permisos.length === 0) {
    return <LoadingSpinner />;
  }
  //console.log(location.pathname);
  // No validamos permisos si estamos en la ruta principal del sitio
  const currentPath = getNormalizedPath(location.pathname);
  if (currentPath === "/site") {
    return <>{children}</>;
  }

  //console.log(currentPath);
  const tienePermiso = permisos?.some((p) => p.ruta === currentPath);
  if (!tienePermiso) {
    navigate("/", { replace: true, state: { from: location } });
  }

  return <>{children}</>;
};

export default Authenticated;

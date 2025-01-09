import { Routes, Route, Navigate } from "react-router";
import { Suspense, lazy, type ComponentType } from "react";

import Authenticated from "@/components/authenticated";
import SuspenseLoader from "@/components/SuspenseLoader";
import SidebarLayout from "@/layout/sidebar/SidebarLayout";

const Loader =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
      </Suspense>
    );

// Login
const Login = Loader(lazy(() => import("@/content/login")));

// Index
const Index = Loader(lazy(() => import("@/content/site")));

// Configuración
const ManagementUsers = Loader(lazy(() => import("@/content/Users")));
const ManagementEmpresas = Loader(
  lazy(() => import("@/content/catalogos/empresas"))
);
const ManagementRoles = Loader(lazy(() => import("@/content/catalogos/roles")));
const ManagementAutorizaciones = Loader(
  lazy(() => import("@/content/catalogos/autorizaciones"))
);

// Status Pages
const Status404 = Loader(
  lazy(() => import("@/content/pages/Status/Status404"))
);
const Status500 = Loader(
  lazy(() => import("@/content/pages/Status/Status500"))
);
const StatusMaintenance = Loader(
  lazy(() => import("@/content/pages/Status/Maintenance"))
);

export const Router = () => {
  return (
    <Routes>
      {/* Redirección desde la ruta raíz */}
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas de estado */}
      <Route path="/status">
        <Route path="404" element={<Status404 />} />
        <Route path="500" element={<Status500 />} />
        <Route path="maintenance" element={<StatusMaintenance />} />
      </Route>

      {/* Rutas protegidas con SidebarLayout */}
      <Route
        path="/site"
        element={
          <Authenticated>
            <SidebarLayout />
          </Authenticated>
        }
      >
        <Route index element={<Index />} />
        <Route path="configuracion/usuarios" element={<ManagementUsers />} />
        <Route path="configuracion/empresas" element={<ManagementEmpresas />} />
        <Route path="configuracion/roles" element={<ManagementRoles />} />
        <Route
          path="configuracion/autorizaciones"
          element={<ManagementAutorizaciones />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/status/404" replace />} />
    </Routes>
  );
};

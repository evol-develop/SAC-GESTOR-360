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

const NotificacionesYActividad = Loader(
  lazy(() => import("@/content/pages/notificaciones-y-actividad"))
);
const Tareas = Loader(lazy(() => import("@/content/pages/tareas")));

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

//CATALOGOS
const ManagementClientes = Loader(
  lazy(() => import("@/content/catalogos/clientes"))
);
const ManagementAlertas = Loader(
  lazy(() => import("@/content/catalogos/alertas"))
);
const ManagementFacturacion = Loader(
  lazy(() => import("@/content/catalogos/facturacion"))
);
const ManagementLineas = Loader(
  lazy(() => import("@/content/catalogos/lineas"))
);
const ManagementSublineas = Loader(
  lazy(() => import("@/content/catalogos/sublineas"))
);
const ManagementServicios = Loader(
  lazy(() => import("@/content/catalogos/servicios"))
);
const ManagementTipos = Loader(
  lazy(() => import("@/content/catalogos/tiposclientes"))
);

const ManagementDepartamentos = Loader(
  lazy(() => import("@/content/catalogos/departamentos"))
);

//PROCESOS
const ManagementTickets = Loader(
  lazy(() => import("@/content/procesos/tickets"))
);

const ConsultaTickets = Loader(
  lazy(() => import("@/content/procesos/consultaTickets"))
);

const MostrarTicket = Loader(
  lazy(() => import("@/content/procesos/consultaTickets/mostrarTicket"))
);

export const Router = () => {
  return (
    <Routes>
      {/* Redirección desde la ruta raíz */}
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="login" element={<Login />} />

      {/* Rutas de estado */}
      <Route path="status">
        <Route path="404" element={<Status404 />} />
        <Route path="500" element={<Status500 />} />
        <Route path="maintenance" element={<StatusMaintenance />} />
      </Route>

      {/* Rutas protegidas con SidebarLayout */}
      <Route
        path="site"
        element={
          <Authenticated>
            <SidebarLayout />
          </Authenticated>
        }
      >
        <Route index element={<Index />} />
        <Route path="configuracion">
          <Route path="usuarios" element={<ManagementUsers />} />
          <Route path="empresas" element={<ManagementEmpresas />} />
          <Route path="roles" element={<ManagementRoles />} />
          <Route path="autorizaciones" element={<ManagementAutorizaciones />} />
       
          {/* Rutas de estado */}
          <Route path="clientes" element={<ManagementClientes />} />
          <Route path="alertas" element={<ManagementAlertas />} />
          <Route path="facturacion" element={<ManagementFacturacion />} />
          <Route path="lineas" element={<ManagementLineas />} />
          <Route path="sublineas" element={<ManagementSublineas />} />
          <Route path="servicios" element={<ManagementServicios />} />
          <Route path="tipos" element={<ManagementTipos />} />
          <Route path="departamentos" element={<ManagementDepartamentos />} />
        </Route>

        <Route path="procesos">
          <Route path="tickets" element={<ManagementTickets />} />
          <Route path="consultaTickets" element={<ConsultaTickets />} />
          <Route path="consultaTickets/mostrarTicket/:clienteId/:ticketId/:movimientoId" element={<MostrarTicket />} /> 
          {/* <Route path="consultaTickets/mostrarTicket" element={<MostrarTicket />} /> */}
        </Route>

        <Route
          path="notificaciones-y-actividad"
          element={<NotificacionesYActividad />}
        />
        <Route path="tareas" element={<Tareas />} />
      </Route>
      <Route path="*" element={<Navigate to="/status/404" replace />} />
    </Routes>
  );
};

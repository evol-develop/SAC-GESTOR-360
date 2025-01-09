import { Helmet } from "react-helmet-async";

import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { titulos, PAGE_SLOT } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario } from "./config";

const ManagementRoles = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  useGetData({ ruta: "/api/roles/getroles", slot: PAGE_SLOT });

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Roles</title>
      </Helmet>
      <CatalogoHeader
        PAGE_SLOT={PAGE_SLOT}
        createItemCatalogo={createItemCatalogo}
        UpdateItemCatalogo={updateItemCatalogo}
        titulos={titulos}
        Formulario={Formulario}
      />
      <Results />
    </>
  );
};

export default ManagementRoles;

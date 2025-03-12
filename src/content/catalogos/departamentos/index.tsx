import { Helmet } from "react-helmet-async";

import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario } from "./config";

const ManagementDepartamentos = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  useGetData({ ruta: "/api/departamentos/getDepartamentos", slot: PAGE_SLOT });
  useGetData({ ruta: "/api/user/getusers", slot: "USUARIOS" });

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Departamentos</title>
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

export default ManagementDepartamentos;

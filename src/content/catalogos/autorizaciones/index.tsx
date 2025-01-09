import { Helmet } from "react-helmet-async";

import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario } from "./config";

const ManagementAutorizaciones = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  useGetData({
    ruta: "/api/autorizaciones/getautorizaciones",
    slot: PAGE_SLOT,
  });

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Autorizaciones</title>
      </Helmet>
      <CatalogoHeader
        PAGE_SLOT={PAGE_SLOT}
        createItemCatalogo={createItemCatalogo}
        UpdateItemCatalogo={updateItemCatalogo}
        titulos={titulos}
        Formulario={Formulario}
        showCreateButton={false}
      />
      <Results />
    </>
  );
};

export default ManagementAutorizaciones;

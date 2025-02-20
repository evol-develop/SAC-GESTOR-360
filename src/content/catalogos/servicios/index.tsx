import { Helmet } from "react-helmet-async";

import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario } from "./config";
import { useEffect } from "react";

const ManagementClientes = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  useGetData({ ruta: "/api/servicios/getServicios", slot: PAGE_SLOT });

  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=Servicios", slot: "SERVICIOSPRODUCTOS", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=Unidades", slot: "UNIDADES", facturacion: true });

  useGetData({ ruta: "/api/sublineas/getSublineas", slot: "SUBLINEAS" });
  useGetData({ ruta: "/api/lineas/getLineas", slot: "LINEAS" });

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Servicios</title>
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

export default ManagementClientes;

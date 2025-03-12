import { Helmet } from "react-helmet-async";

import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario } from "./config";

const ManagementClientes = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  useGetData({ ruta: "/api/clientes/getClientes", slot: PAGE_SLOT });
  useGetData({ ruta: "/api/alertas/getAlertas", slot: "ALERTAS" });
  useGetData({ ruta: "/api/tipos/getTipos", slot: "TIPOS_CLIENTES" });
  useGetData({ ruta: "/api/servicios/getServicios", slot: "SERVICIOS" });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=UsoCFDI", slot: "CFDI", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=MetodoPago", slot: "FORMASPAGO", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=RegimenFiscal", slot: "REGIMEN", facturacion: true });
  useGetData({ ruta: "/api/departamentos/getDepartamentos", slot: "DEPRATAMENTOS" });

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Clientes</title>
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

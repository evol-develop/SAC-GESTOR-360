import { Helmet } from "react-helmet-async";
import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Formulario, OperacionesFormulario, añadirNota, asignarEvento, ReturnModal } from "./config";
import { usePage } from "@/hooks/usePage"; 
import {deleteSlot, setModalSize} from "@/store/slices/page";

const ManagementClientes = () => {

  //const formulario =useAppSelector((state: RootState) => state.page.slots.formulario as string) ;
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const { dispatch } = usePage(PAGE_SLOT);
  useGetData({ ruta: "/api/clientes/getClientes", slot: PAGE_SLOT });
  useGetData({ ruta: "/api/alertas/getAlertas", slot: "ALERTAS" });
  useGetData({ ruta: "/api/tipos/getTipos", slot: "TIPOS_CLIENTES" });
  useGetData({ ruta: "/api/servicios/getServicios", slot: "SERVICIOS" });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=UsoCFDI", slot: "CFDI", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=MetodoPago", slot: "METODOSPAGO", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=FormasPago", slot: "FormasPago", facturacion: true });
  useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=RegimenFiscal", slot: "REGIMEN", facturacion: true });
  useGetData({ ruta: "/api/departamentos/getDepartamentos", slot: "DEPRATAMENTOS" });
  useGetData({ ruta: "/api/eventos/getEventos", slot: "EVENTOS" });
  useGetData({ ruta: "/api/documentos/getDocumentos", slot: "DOCUMENTOS" });

  const SetSizeModal =() =>{
    dispatch(setModalSize("xl"));
  }

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
        handleOpen={() => { SetSizeModal(); }}
      />

      <ReturnModal/>

      <Results />
    </>
  );
};

export default ManagementClientes;

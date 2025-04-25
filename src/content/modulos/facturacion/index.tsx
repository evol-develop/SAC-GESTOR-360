import { Helmet } from "react-helmet-async";
import { Results } from "./Results";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT, titulos } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { Facturacion, OperacionesFormulario } from "./config";
import { SendFormulario } from "@/config/catalogoGenerico/SendFormulario";

const ManagementFaturacion = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();

  // useGetData({ ruta: "/api/servicios/getServicios", slot: PAGE_SLOT });
  // useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=Servicios", slot: "SERVICIOSPRODUCTOS", facturacion: true });
  // useGetData({ ruta: "/api/getCatalogoSAT?code="+appConfig.TOKEN+"&Catalogo=Unidades", slot: "UNIDADES", facturacion: true });
  // useGetData({ ruta: "/api/sublineas/getSublineas", slot: "SUBLINEAS" });
  // useGetData({ ruta: "/api/lineas/getLineas", slot: "LINEAS" });
  // useGetData({ ruta: "/api/user/getusers", slot: "USUARIOS" });
  // useGetData({ ruta: "/api/departamentos/getDepartamentos", slot: "DEPARTAMENTOS" });
  
  return (
    <>
    <Helmet>
      <title>{appConfig.NOMBRE} - Facturacion</title>
    </Helmet>
     
    <SendFormulario
      PAGE_SLOT={PAGE_SLOT}
      createItemCatalogo={createItemCatalogo}
      UpdateItemCatalogo={updateItemCatalogo}
      titulos={titulos}
      Formulario={Facturacion}/>

    </>
  );
};

export default ManagementFaturacion;

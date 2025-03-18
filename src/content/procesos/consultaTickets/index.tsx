import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { TicketsMovimientos, crearComentario,OperacionesFormulario, asignarUsuario } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import { PAGE_SLOT } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import {titulos} from "./constants";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { Modal } from "@/config/Modal";

const ManagementTickets = () => {

  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const { authState: { user },logout,} = useAuth();
  var url = "/api/tickets/getTicketsByEmpresa";

  console.log(user?.userRoll)
    
  if(user?.userRoll == "Administrador" || user?.userRoll == "Soporte" ){

    url  = `/api/tickets/getTicketsByEmpresa`;

  }
  else if(user?.userRoll == "Cliente"){

    url  = `/api/tickets/getTicketsByClientes/${user?.id}`;

  }
  else{
     url  = `/api/tickets/getTicketsByUsuario`;
  }
  useGetData({ ruta: url, slot: "TICKETS" });
  useGetData({ ruta: "/api/user/getusers", slot: "USUARIOS" });
  

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>

      <TicketsMovimientos/>

      <CatalogoHeader
        PAGE_SLOT={PAGE_SLOT}
        createItemCatalogo={createItemCatalogo}
        UpdateItemCatalogo={updateItemCatalogo}
        titulos={titulos}
        Formulario={ crearComentario}
        showCreateButton={false}
      />

      <Modal
      titulo="Asignar Usuario"
      Content={asignarUsuario}
      />
    </>
  );
};

export default ManagementTickets;


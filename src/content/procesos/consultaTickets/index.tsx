import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { TicketsMovimientos, crearComentario,OperacionesFormulario } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import { PAGE_SLOT } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import {titulos} from "./constants";
const ManagementTickets = () => {
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const { authState: { user },logout,} = useAuth();
  var url = "/api/tickets/getTicketsByEmpresa";
  if(user?.userRoll == "Cliente"){url  = `/api/tickets/getTicketsByClientes/${user?.id}`}
  useGetData({ ruta: url, slot: "TICKETS" });

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
        Formulario={crearComentario }
        showCreateButton={false}
      />
    </>
  );
};

export default ManagementTickets;


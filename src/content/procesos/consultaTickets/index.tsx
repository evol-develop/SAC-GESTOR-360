import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import {Results } from "./Results";
import { useEffect } from "react";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import { PAGE_SLOT, titulos } from "./constants";
import {OperacionesFormulario} from "./config";
import {crearComentario} from "./config";
import { usePage } from "@/hooks/usePage";
import {deleteSlot} from "@/store/slices/page";
const ConsultaTickets = () => {

  const {user} = useAuth();
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const { dispatch } = usePage();

  useGetData({ ruta: `/api/tickets/getTicketsByUsuario/${user?.userRoll != "Cliente" ? 0:user?.clienteId}`, slot: "TICKETS" });


  const eliminarSlots =()=>{
    dispatch(deleteSlot("audios"))
    dispatch(deleteSlot("imagenes"))
    dispatch(deleteSlot("archivos"))
    dispatch(deleteSlot("comentario"));
    dispatch(deleteSlot("tipoOperacion"))
    dispatch(deleteSlot("ticketId"))
    dispatch(deleteSlot("movimientoId"))
    dispatch(deleteSlot("clienteId"))
  }

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>

      <CatalogoHeader
        PAGE_SLOT={PAGE_SLOT}
        createItemCatalogo={createItemCatalogo}
        UpdateItemCatalogo={updateItemCatalogo}
        titulos={titulos}
        Formulario={ crearComentario}
        showCreateButton={false}
        handleClose={eliminarSlots}
        showEncabezado={false}
      />

      <Results/>
    </>
  );
};

export default ConsultaTickets;

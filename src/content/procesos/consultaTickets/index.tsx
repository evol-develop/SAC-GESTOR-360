import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { TicketsMovimientos } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import {Results } from "./Results";
import { Modal } from "@/config/Modal";
import { PAGE_SLOT } from "./constants";

const ManagementTickets = () => {

  const { authState: { user },logout,} = useAuth();
  useGetData({ ruta: "/api/tickets/getTicketsByEmpresa", slot: "TICKETS" });
  
  

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>

      <Modal 
      PAGE_SLOT={PAGE_SLOT} 
      titulo="Movimientos del ticket"
      Content={TicketsMovimientos}
      />
        
        <Results/>
    </>
  );
};

export default ManagementTickets;


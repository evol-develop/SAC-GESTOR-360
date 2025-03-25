import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import {Results } from "./Results";
import { useEffect } from "react";

const ManagementTickets = () => {

  const { authState: { user },logout,} = useAuth();
  useGetData({ ruta: `/api/tickets/getTicketsByUsuario/${user?.userRoll != "Cliente" ? 0:user?.id}`, slot: "TICKETS" });
    

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>

      <Results/>
    </>
  );
};

export default ManagementTickets;

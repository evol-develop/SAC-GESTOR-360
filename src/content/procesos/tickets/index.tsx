
import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { Formulario } from "./config";

const ManagementTickets = () => {

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>
        <Formulario/>
    </>
  );
};

export default ManagementTickets;


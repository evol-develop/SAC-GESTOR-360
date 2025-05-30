import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { Formulario } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import { createSlot } from "@/store/slices/page";

const ManagementTickets = () => {
  const {init, dispatch } = usePage();
  const { authState: { user },logout,} = useAuth();

  //COMPROBAR QUE TIPO DE ROL TIENE EL USUARIO LOGUEADO
  //console.log(user?.id)
  if(user?.userRoll != "Cliente"){
   
    useGetData({ ruta: "/api/clientes/getClientes", slot: "CLIENTES" });
  }else {
    
    dispatch(createSlot({ ["clienteId"]: user?.clienteId }));
  }

  useGetData({ ruta: "/api/user/getusers", slot: "USUARIOS" });

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


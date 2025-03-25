import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect ,useState} from "react";
import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { motion } from "framer-motion"; // 🔹 Asegúrate de importar motion
import { ticketComentariosInterface, ticketInterface, ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import '/node_modules/swiper/swiper-bundle.css'; //ESTE SIRVE PARA EL CARRUSEL DE ARCHIVOS, FOTOS Y AUDIOS
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal,addItemSlot, updateItemSlot, setIsEditing, setModalSize} from "@/store/slices/page";
import { useAuth } from "@/hooks/useAuth";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { toast } from "sonner";
import InfiniteCards from '@/components/InfiniteCards';
import { GrLinkNext } from "react-icons/gr";
import { estatus } from "@/interfaces/procesos/estatus";
import { Autorizar } from "@/components/Autorizar";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import { FaUserCheck } from "react-icons/fa";
import { useParams } from 'react-router';
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from 'react-router';
import { Modal } from "@/config/Modal";
import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import {  crearComentario,OperacionesFormulario, asignarUsuario } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import {titulos} from "./constants";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";


 const mostrarComentarios = () => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(); 
   const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const movimientos = useAppSelector((state: RootState) => state.page.slots.MOVIMIENTOS as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  //const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const [etapas, setEtapas] = useState<any[]>([{ title: "", description: "", id:0, fecha:"", fechaTermina:"" }]);

  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  //const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as number);
  const { authState: { user },logout,} = useAuth();
  const navigate = useNavigate();
   const { clienteId, ticketId, etapaActual, userId,clienteidAuth} = useParams();
  
  const etapaActualNumber = parseInt(etapaActual as string);
  const asignadoId = userId as string;
  const ticketIdNumber = parseInt(ticketId as string);
  const clienteIdNumber = parseInt(clienteId as string);
  const clienteAuth = clienteidAuth as string;

  function BuscarEtapa(id: number): string | undefined {
    return Object.keys(estatus).find(key => estatus[key as keyof typeof estatus] === id);
  }

  const CargarMovimientos = async () => {
    try {
      const response = await axios.get(
        `/api/tickets/getMovimientosByTicket/${ticketId}/${true}`,{headers: { "Content-Type": "application/text" },}
      );

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        const movimientos = response.data.result.map((item:any) => ({
          fechaTermina: item.fechaTermina,
          fecha: item.fechaCrea,
          estado: item.ticketEstatus.nombre,
          id: item.id,
          
        }));

        const ultimoMovimiento = movimientos.length - 1;


        dispatch(createSlot({ movimientoId: movimientos[ultimoMovimiento].id }));
        dispatch(createSlot({ MOVIMIENTOS: movimientos }));
        dispatch(createSlot({ ETAPA: ultimoMovimiento }));
      }

    } catch (err) {
      console.error(err);
    }
  };
    
  useEffect(() => {
    if(ticketId){
    CargarMovimientos();
    }
  }, [ticketId]);


  function OpenModalAsignarUsuario(item : any){
    dispatch(createSlot({ openModal: true }));
  }

  useEffect(() => {
    if (movimientos && movimientos.length > 0) {
      const updatedEtapas = movimientos.map((movimiento :any, index:any) => ({
        title: movimiento.estado, 
        description: movimiento.estado, 
        id: movimiento.id,
        fecha: movimiento.fecha,
        fechaTermina: movimiento.fechaTermina
      }));

      setEtapas(updatedEtapas);
    }
  }, [movimientos]);

  function setShowArchivosFalse(){

    dispatch(deleteSlot("COMENTARIO"))
    dispatch(deleteSlot("SHOWARCHIVOS"))
  }

  function ocultarComentarios(){
    // dispatch(deleteSlot("ticketId"))
    // dispatch(deleteSlot("clienteId"))

    // dispatch(deleteSlot("etapaActual"))
    // dispatch(deleteSlot("userId"))
    
    
    // dispatch(deleteSlot("MOVIMIENTOS"))
    // dispatch(deleteSlot("COMENTARIOS"))

    let url =`/site/procesos/consultaTickets`;
    navigate(url);
  }

  function cambiarEstatus(){
    
      Autorizar(
        () => handleClick(),
        TiposAutorizacion.CambiarEtapa
      );
  }

  const handleClick = async () => {
    
    try {       
         
        const valoresForm = {
          id : ticketId,
          clienteId: clienteId,
          empresaId: idEmpresa
        };

        const response = await axios.post<ResponseInterface>(
          "/api/tickets/registrarMovimiento",
          valoresForm
        );

        if(response.data.isSuccess){
        console.log(response.data.result)

        var movimiento = response.data.result as ticketMovimientoInterface;
        
        console.log(movimiento)
        
        var newMovimiento ={
          fechaTermina: new Date(),
          fecha : movimiento.fechaCrea,
          estado: movimiento.ticketEstatus.nombre,
          id: movimiento.id
        }

         dispatch(
          addItemSlot({ state: "MOVIMIENTOS", data: newMovimiento })
        );      
        dispatch(deleteSlot("COMENTARIOS"))
       

         dispatch(createSlot({ etapaActual: movimiento.ticketEstatusId }));
         dispatch(createSlot({ ETAPA: movimiento.ticketEstatusId-1 }));
        
        toast.success(response.data.message);
        }else{
          toast.error(response.data.message);
        }

      return response.data;

    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar al cambair de etapa");
      toast.error("Error al actualizar al cambair de etapa");
    }
  };
  

  useEffect(() => {

    dispatch(createSlot({ "ticketId": ticketIdNumber }));
    dispatch(createSlot({ "clienteId": clienteIdNumber }));
    dispatch(createSlot({ "etapaActual": etapaActualNumber }));
    dispatch(createSlot({ "asignado": userId }));
    dispatch(createSlot({ "clienteAuth": clienteAuth }));
    
    getUsuarios();
  }, []);


  const getUsuarios = async () => {
    try {
      const response = await axios.get(
        `/api/user/getusers`,{headers: { "Content-Type": "application/text" },}
      );

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        dispatch(createSlot({ "USUARIOS": response.data.result  }));
    
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (<>
  
    <div className="container mx-auto">
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col items-center justify-between w-full sm:flex-row">
        <div className="flex flex-col w-full gap-1 sm:flex-row sm:w-auto">
          <Button
            size="sm"
            variant="default"
            onClick={() => showArchivos ? setShowArchivosFalse() : ocultarComentarios()}
          >
            <span className="hidden lg:inline-block">Volver</span>
            <LuUndo2 />
          </Button>

          {!showArchivos && (
            <>
              {user?.userRoll !== "Cliente" && (
                <>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => cambiarEstatus()}
                    disabled={(etapaActualNumber - 1) === estatus.CERRADO}
                  >
                    <GrLinkNext />
                    Avanzar a la siguiente etapa
                  </Button>

                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => OpenModalAsignarUsuario(e)}
                    disabled={(etapaActualNumber - 1) === estatus.CERRADO}
                  >
                    <FaUserCheck />
                    Asignar Usuario
                  </Button>
                </>
              )}

              {/* <Button size="sm" className="text-xs" onClick={(e) => OpenModalComentario(e)}>
                <CiCirclePlus />
                Añadir comentario
              </Button> */}
            </>
          )}

        </div>

        {!showArchivos && (
             <div className="flex items-center justify-center w-full gap-2 sm:w-auto">
              {user?.userRoll !== "Cliente" && (
                <><div className="p-1 text-xs font-bold text-black border rounded-md ">
                    Usuario asignado :
                  </div><div className="p-1 text-xs text-black border rounded-md">
                      {usuarios && usuarios.find((user) => user.id === asignadoId.toString())?.fullName}
                    </div>
                </>
              )}
              <div className="flex flex-row p-1 text-xs font-bold text-black border rounded-md ">Folio :</div>
                <div className="flex flex-row p-1 text-xs text-black border rounded-md"> # {ticketId}</div>
                <div className="p-1 text-xs font-bold text-black border rounded-md ">
                  Estatus :
                </div>
                <div className="p-1 text-xs text-black border rounded-md">
                  {BuscarEtapa(etapaActualNumber -1)}
                </div>
              </div>
        )}
      </CardHeader>
      <CardContent>
     
      {etapas && etapas.length >0 && (<InfiniteCards etapas={etapas}  />) }
   
     </CardContent>  
    </Card> 
    </div>
  

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

export default mostrarComentarios;
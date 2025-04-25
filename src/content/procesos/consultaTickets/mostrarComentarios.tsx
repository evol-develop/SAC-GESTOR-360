import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect ,useState} from "react";
import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { motion } from "framer-motion";
import {  ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import '/node_modules/swiper/swiper-bundle.css'; 
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { toast } from "sonner";
import InfiniteCards from '@/components/InfiniteCards';
import { GrLinkNext } from "react-icons/gr";
import { estatus } from "@/interfaces/procesos/estatus";
import { Autorizar } from "@/components/Autorizar";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { ModalGenerico } from "@/components/ModalGenerico";
import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import {  OperacionesFormulario } from "./config";
import { useGetData } from "@/hooks/useGetData";
import { PAGE_SLOT } from "./constants";
import { CatalogoHeader } from "@/config/catalogoGenerico";
import {titulos} from "./constants";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { UsuarioAdicionalesInterface } from "@/interfaces/UsuarioAdicionalesInterface";
import {UsersInterface} from "@/interfaces/userInterface";
import { useNotifications } from "@/hooks/useNotifications";
import {Results } from "./Results";
import { Loading } from "@/components/Loading";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { useMemo } from "react";
import { FaUserCheck } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler } from "react-hook-form";
import {Form,FormLabel} from "@/components/ui/form";
import { CardFooter } from "@/components/ui/card";
import { Notification } from "@/contexts/Notifications";
import { LuLoaderCircle } from "react-icons/lu";
import { CropImage } from "@/components/crop-image";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { FaTimes  } from 'react-icons/fa';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.css'; //ESTE SIRVE PARA EL CARRUSEL DE ARCHIVOS, FOTOS Y AUDIOS
import  Reproductor  from "@/components/Reproductor";
import React from "react";
import { uploadImage } from "@/api/storageApi";
import {createSlot,deleteSlot, deleteItemSlot, setIsLoading,setIsOpenModal,setDataModal,addItemSlot, updateItemSlot, setIsEditing, setModalSize} from "@/store/slices/page";
import { crearComentario } from "./config";

 const MostrarComentarios = () => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(); 
   const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const movimientos = useAppSelector((state: RootState) => state.page.slots.MOVIMIENTOS as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  const [etapas, setEtapas] = useState<any[]>([{ title: "", description: "", id:0, fecha:"", fechaTermina:"" }]);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as UsersInterface[] );
  const { authState: { user },logout,} = useAuth();
  const navigate = useNavigate();

  const usuarioAsignado =useAppSelector((state: RootState) => state.page.slots.usuarioAsignado as string );
  const etapaActual =useAppSelector((state: RootState) => state.page.slots.etapaActual as number );
  const clienteId =useAppSelector((state: RootState) => state.page.slots.clienteId as number );
  const { ticketId} = useParams(); //etapaActual, userId,

  const ticketIdNumber = parseInt(ticketId as string);
  
  function BuscarEtapa(id: number) {
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

        //console.log(response.data.result)

        var usuarioAsignado = response.data.result[0].ticket.userId;
        var etapaActual = response.data.result[movimientos.length - 1].ticketEstatusId;
        var clienteAuth = response.data.result[0].clienteAuth;
        var clienteId = response.data.result[0].ticket.clienteId;

        dispatch(createSlot({ usuarioAsignado: usuarioAsignado }));
        dispatch(createSlot({ etapaActual: etapaActual }));
        dispatch(createSlot({ clienteAuth: clienteAuth }));
        dispatch(createSlot({ clienteId: clienteId }));
        
        const ultimoMovimiento = movimientos.length - 1;
        dispatch(createSlot({ movimientoId: movimientos[ultimoMovimiento].id }));
        dispatch(createSlot({ MOVIMIENTOS: movimientos }));
        dispatch(createSlot({ etapaSeleccionada: ultimoMovimiento }));
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
        
        dispatch(deleteSlot("COMENTARIOS_ASIGNADO"))
        dispatch(deleteSlot("COMENTARIOS_CLIENTE"))
        

         dispatch(createSlot({ etapaActual: movimiento.ticketEstatusId }));
         dispatch(createSlot({ etapaSeleccionada: movimiento.ticketEstatusId-1 }));
        
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

  const eliminarSlots =()=>{
    dispatch(deleteSlot("audios"))
    dispatch(deleteSlot("imagenes"))
    dispatch(deleteSlot("archivos"))
    dispatch(deleteSlot("tipoOperacion"))

    dispatch(deleteSlot("comentarioId"))
    dispatch(deleteSlot("comentario"))

    dispatch(deleteSlot("Dirigido"))
    dispatch(deleteSlot("Destinatario"))
  }

  return (<>
  
  {/* style={{maxHeight: 'calc(80vh - 50px)',minHeight: 'calc(200vh - 50px)' }} */}
    <Card >
      <CardHeader className="flex flex-col justify-between items-center w-full sm:flex-row">
        <div className="flex flex-col gap-1 w-full sm:flex-row sm:w-auto">
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
                    disabled={(etapaActual - 1) === estatus.CERRADO}
                  >
                    <GrLinkNext />
                    Siguiente etapa
                  </Button>

                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => OpenModalAsignarUsuario(e)}
                    disabled={(etapaActual - 1) === estatus.CERRADO}
                  >
                    <FaUserCheck />
                    Asignar Usuario
                  </Button>
                </>
              )}

            </>
          )}

        </div>

        {!showArchivos && (
             <div className="flex gap-2 justify-center items-center w-full sm:w-auto">
              {user?.userRoll !== "Cliente" && (
                <><div className="p-1 text-xs font-bold text-black rounded-md border">
                    Usuario asignado :
                  </div>
                  <div className="p-1 text-xs text-black rounded-md border">
                      {usuarios && usuarios.find((user) => user.id === usuarioAsignado)?.fullName}
                    </div>
                </>
              )}
              <div className="flex flex-row p-1 text-xs font-bold text-black rounded-md border">Folio :</div>
                <div className="flex flex-row p-1 text-xs text-black rounded-md border"> # {ticketId}</div>
                <div className="p-1 text-xs font-bold text-black rounded-md border">
                  Estatus :
                </div>
                <div className="p-1 text-xs text-black rounded-md border">
                  {etapaActual && (<>{BuscarEtapa(etapaActual -1)}</>)}
                </div>
              </div>
        )}
      </CardHeader>
      <CardContent >
     
      {etapas && etapas.length >0 && (<InfiniteCards etapas={etapas}  />) }
   
     </CardContent>  
    </Card> 
  
  

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
    
    <ModalGenerico
    titulo="Asignar Usuario"
    Content={asignarUsuario}
    // handleClose={eliminarSlots}
    />

    
        
    </>
  );
};

export const asignarUsuario = () => {
  const { dispatch } = usePage(); 
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const { authState: { user },logout,} = useAuth();
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as any);
  //const userId = useAppSelector((state: RootState) => state.page.slots.userId);
  const { sendNotification } = useNotifications();
  
  const validationSchema = z
    .object({
       userId: z.string()//.optional(),
    })
    
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      userId: dataModal.userId,
    },
  });

    const onSubmit: SubmitHandler<any> = async (valores) => {
  try {          

      const valoresForm = {
        id : ticketId,
        userId: valores.userId,
        clienteId: clienteId
      };

      console.log(valoresForm)

        const response = await axios.post<ResponseInterface>(
          "/api/tickets/asignarUsuario",
          valoresForm
        );
        
      
        generalForm.reset();
        dispatch(deleteSlot("ASIGNARUSUARIO"))
        dispatch(deleteSlot("openModal"));
        dispatch(createSlot({ usuarioAsignado: valores.userId }));
        
        if(response.data.isSuccess){
          
           dispatch(createSlot({ asignado: response.data.result.userId }));
           
           toast.success(response.data.message);

           //console.log(response.data.result)

           const notification: Notification = {
            title: "Se te ha asignado un nuevo ticket con el folio #"+ticketId,
            message: 
            "<a href='/site/procesos/consultaTickets/mostrarArchivos/"
            +ticketId+"/"+0+"' style={{ textDecoration: 'underline', color: 'blue' }}> Ver ticket</a>  <br/>"+
            "<div  className='text-xs'><b>Asunto:</b> "+response.data.result.titulo+" <br/>"+ 
            "<b>Descripción:</b> "+response.data.result.descripcion+" </div>",
            type:"importante",
            groupIds:[],
            userId: valores.userId,
            ticketId: ticketId,
            comentarioId:1,
            motivo:"ticket"
          };
              
          try {
            
            sendNotification(notification);
           
          } catch (error) {
            console.error("Error al enviar la notificación", error);
          }
           
        }else{
          toast.error(response.data.message)
        }
          
        return response.data;

    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar al asignar el usuario");
    }
      
    };

    
  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };

    const usuariosFiltrados = useMemo(() => {
      return usuarios && usuarios.filter(user => user.userRoll !== "Cliente");
    }, [usuarios]);
  
    return (
    <Form {...generalForm}>
      <form onSubmit={generalForm.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-[300px] w-full overflow-y-auto flex flex-col">
          <CardContent className="grid flex-grow grid-cols-4 gap-2 py-3">
            <div>
              <FormLabel className="text-xs">Usuario encargado </FormLabel>
              <Select name="userId" onValueChange={(value) => generalForm.setValue("userId", value)}>
                <SelectTrigger className="w-72">
                  <SelectValue
                    placeholder={
                      usuariosFiltrados && usuariosFiltrados.length > 0
                        ? usuariosFiltrados.find((x) => x.id === generalForm.watch("userId"))?.fullName ||
                          "Selecciona un usuario"
                        : "Cargando..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {usuariosFiltrados &&
                    usuariosFiltrados.map((item: { id: string; fullName: string }) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.fullName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="flex flex-col items-end"  >
                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    type="submit"
                    className="text-xs"
                    disabled={generalForm.formState.isSubmitting}
                  >
                  {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  
                    Asignar usuarios
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
};




export default MostrarComentarios;
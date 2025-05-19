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
import UserAvatar from "@/components/UserAvatar";

 const MostrarComentarios = () => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(); 
   const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const movimientos = useAppSelector((state: RootState) => state.page.slots.MOVIMIENTOS as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  const [etapas, setEtapas] = useState<any[]>([{ title: "", description: "", id:0, fecha:"", fechaTermina:"", ticketEstatusId:0 }]);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as UsersInterface[] );
  const { authState: { user },logout,} = useAuth();
  const navigate = useNavigate();
  const clienteAuth = useAppSelector((state: RootState) => state.page.slots.clienteAuth as any);
  const usuarioAsignado =useAppSelector((state: RootState) => state.page.slots.usuarioAsignado as string );
  const etapaActual =useAppSelector((state: RootState) => state.page.slots.etapaActual as number );
  const clienteId =useAppSelector((state: RootState) => state.page.slots.clienteId as number );
  const clienteNombre =useAppSelector((state: RootState) => state.page.slots.clienteNombre as string );
  const { ticketId} = useParams(); //etapaActual, userId,
  const ticketIdNumber = parseInt(ticketId as string);
  const [ticketEliminado, setTicketEliminado] = useState(false);
  
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
          ticketEstatusId: item.ticketEstatusId
        }));

        console.log(response.data.result)

        var usuarioAsignado = response.data.result[0].ticket.userId;
        var etapaActual = response.data.result[movimientos.length - 1].ticketEstatusId;
        var clienteAuth = response.data.result[0].clienteAuth;
        var clienteId = response.data.result[0].ticket.clienteId;
        var clienteNombre = response.data.result[0].ticket.cliente.email;

        dispatch(createSlot({ usuarioAsignado: usuarioAsignado }));
       
        dispatch(createSlot({ clienteAuth: clienteAuth }));
        dispatch(createSlot({ clienteId: clienteId }));
        dispatch(createSlot({ clienteNombre: clienteNombre }));
        
        const ultimoMovimiento = movimientos.length - 1;
        // dispatch(createSlot({ movimientoId: movimientos[ultimoMovimiento].id }));
        dispatch(createSlot({ MOVIMIENTOS: movimientos }));
        dispatch(createSlot({ etapaSeleccionada: movimientos[ultimoMovimiento].id }));
        dispatch(createSlot({ etapaActual: movimientos[ultimoMovimiento].id }));
       // console.log(response.data.result[0].ticket.eliminado)

        if(response.data.result[0].ticket.eliminado){
          setTicketEliminado(true);
          //OpenModalTicketEliminado();
        }
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


  function OpenModalAsignarUsuario(){
    dispatch(createSlot({ openModal: true }));
     dispatch(createSlot({ formulario: "asignacion" }));
  }

  function OpenModalCambiarEtapa(){
    dispatch(createSlot({ openModal: true }));
     dispatch(createSlot({ formulario: "etapa" }));
  }

  
  // function OpenModalTicketEliminado(){
  //   dispatch(createSlot({ openModal: true }));
  //    dispatch(createSlot({ formulario: "eliminado" }));
  // }

  useEffect(() => {
    if (movimientos && movimientos.length > 0) {
      const updatedEtapas = movimientos.map((movimiento :any, index:any) => ({
        title: movimiento.estado, 
        description: movimiento.estado, 
        id: movimiento.id,
        fecha: movimiento.fecha,
        fechaTermina: movimiento.fechaTermina,
        ticketEstatusId: movimiento.ticketEstatusId
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

  useEffect(() => {

    dispatch(createSlot({ "ticketId": ticketIdNumber }));
    getUsuarios();
    getEtapas();
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

  const getEtapas = async () => {
    try {
      const response = await axios.get(
        `/api/tickets/getEtapas`,{headers: { "Content-Type": "application/text" },}
      );

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        dispatch(createSlot({ "ETAPAS": response.data.result  }));
    
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
  
  {!ticketEliminado ? (<>
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
              {user?.userRoll !== "Cliente"  && (
                <>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => OpenModalCambiarEtapa()}
                    disabled={(etapaActual) === estatus.CANCELADO}
                  >
                    {/* <GrLinkNext /> */}
                    Cambiar de etapa
                  </Button>

                  {user?.userRoll !== "Desarrollo" && (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={(e) => OpenModalAsignarUsuario()}
                    disabled={(etapaActual) === estatus.CANCELADO}
                  >
                    <FaUserCheck />
                    Asignar Usuario
                  </Button>
                  )}
                </>
              )}

            </>
          )}

        </div>

        {!showArchivos && (
          <div className="flex gap-2 justify-center items-center w-full sm:w-auto dark:text-white">
          
            <><div className="p-1 text-xs font-bold text-black dark:text-white">
                Cliente :
              </div>
              
                <UserAvatar
              withTooltip
              userId={clienteId ? clienteId.toString():""}
              className="size-8"
              rounded="rounded-full"
              catalogo="clientes"
              />
          
            </>
          
          {user?.userRoll !== "Cliente" && (
            <><div className="p-1 text-xs font-bold text-black dark:text-white">
                Usuario asignado :
              </div>
          
                <UserAvatar
                withTooltip
                userId={usuarioAsignado}
                className="size-8"
                rounded="rounded-full"
                />
                
            </>
          )}
          <div className="flex flex-row p-1 text-xs font-bold text-black dark:text-white">Folio :</div>
            <div className="flex flex-row p-1 text-xs text-black dark:text-white"> # {ticketId}</div>
            <div className="p-1 text-xs font-bold text-black dark:text-white">
              Estatus :
            </div>
            <div className="p-1 text-xs text-black dark:text-white">
              {etapaActual && (<>{BuscarEtapa(etapaActual)}</>)}
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
      </>):(
        <TicketEliminado/>
      )}
    
    <ReturnModal/>
    
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
  //const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as any);
  //const userId = useAppSelector((state: RootState) => state.page.slots.userId);
  const asignado = useAppSelector((state: RootState) => state.page.slots.usuarioAsignado as string);
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

      //console.log(valoresForm)

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
      return usuarios && usuarios.filter(user => user.userRoll !== "Cliente" && user.id !== asignado );
    }, [usuarios]);
  
    return (
    <Form {...generalForm}>
      <form onSubmit={generalForm.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-[200px] w-full overflow-y-auto flex flex-col">
          <CardContent className="grid flex-grow grid-cols-1 gap-2 justify-center items-center py-3">
            <div>
              {/* <FormLabel className="text-xs">Usuario asignado </FormLabel> */}
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
                  
                    Guardar cambios
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
};


export const cambiarEstapa = () => {
  const { dispatch } = usePage(); 
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const { authState: { user },logout,} = useAuth();
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const etapas = useAppSelector((state: RootState) => state.page.slots.ETAPAS as any[] );
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as any);
  //const userId = useAppSelector((state: RootState) => state.page.slots.userId);
  const { sendNotification } = useNotifications();
  const { idEmpresa } = useAuth();
  
  const validationSchema = z
    .object({
       etapaId: z.number()//.optional(),
    })
    
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      etapaId: dataModal.etapaId,
    },
  });

    const onSubmit: SubmitHandler<any> = async (valores) => {
    
  try {       
       
      const valoresForm = {
        id : ticketId,
        clienteId: clienteId,
        empresaId: idEmpresa,
        etapaId: valores.etapaId,
      };

      const response = await axios.post<ResponseInterface>(
        "/api/tickets/cambiarEtapa",
        valoresForm
      );
      console.log(response.data)

      if(response.data.isSuccess){

      var movimiento = response.data.result as ticketMovimientoInterface;

      var newMovimiento ={
        fechaTermina: new Date().toISOString(),
        fecha : movimiento.fechaCrea,
        estado: movimiento.ticketEstatus.nombre,
        id: movimiento.id,
        ticketEstatusId: movimiento.ticketEstatusId
      }

       dispatch(
        addItemSlot({ state: "MOVIMIENTOS", data: newMovimiento })
      );      
      
      dispatch(deleteSlot("COMENTARIOS_ASIGNADO"))
      dispatch(deleteSlot("COMENTARIOS_CLIENTE"))

      dispatch(deleteSlot("openModal"))
      

       dispatch(createSlot({ etapaActual: movimiento.ticketEstatusId }));
       dispatch(createSlot({ etapaSeleccionada: movimiento.ticketEstatusId }));
      
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

    
  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };


    const etapasFiltradas = useMemo(() => {
      return etapas && etapas.filter(etapa => etapa.id !== etapaActual && etapa.id > etapaActual && etapa.nombre !== "Asignado" );
    }, [etapas]);
  
    return (
    <Form {...generalForm}>
      <form onSubmit={generalForm.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-[200px] w-full overflow-y-auto flex flex-col">
          <CardContent className="grid flex-grow grid-cols-1 gap-2 justify-center items-center py-3">
            <div>
              {/* <FormLabel className="text-xs">Usuario asignado </FormLabel> */}
              <Select name="userId" onValueChange={(value) => generalForm.setValue("etapaId", parseInt(value))}>
                <SelectTrigger className="w-72">
                  <SelectValue
                    placeholder={
                      etapasFiltradas && etapasFiltradas.length > 0
                        ? etapasFiltradas.find((x) => x.id === generalForm.watch("etapaId"))?.nombre ||
                          "Seleccione una etapa"
                        : "Cargando..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {etapasFiltradas &&
                    etapasFiltradas.map((item: { id: string; nombre: string }) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.nombre}
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
                  
                    Guardar cambios
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
};


export const TicketEliminado = () => {
 
  
  const navigate = useNavigate();
  
  function volver(){
    let url =`/site/procesos/consultaTickets`;
    navigate(url);
  }
  
    return (
    <div className="flex flex-col justify-center items-center m-48">
      <div className="flex justify-center items-center w-20 h-20 rounded-lg aspect-square">
          <img
            className="object-contain w-full h-full"
            alt="logo-evolsoft"
            src="/logo/delete.gif"
          />
      </div>
      
      <div>Este ticket ha sido eliminado</div>
      <Button
      size="sm"
      variant="default"
      onClick={() =>  volver()}
    >
      <span className="hidden lg:inline-block">Ver tickets</span>
      
    </Button>
    </div>

    );
};

export const ReturnModal = () => {
  const formulario = useAppSelector((state: RootState) => state.page.slots.formulario as string);
  const { dispatch } = usePage(PAGE_SLOT);

  const eliminarSlots = () => {
    dispatch(deleteSlot("formulario"));
    dispatch(deleteSlot("openModal"));
  };

  const ContentComponent = formulario === "etapa" ? cambiarEstapa : formulario === "asignacion" ? asignarUsuario : TicketEliminado;

  return (
    <>
    {/* {(formulario === "etapa" || formulario === "asignacion") && ( */}
    <ModalGenerico
      titulo={formulario === "etapa" ? "Cambiar de etapa" : formulario === "asignacion" ? "Asignar usuario" : ""}
      Content={ContentComponent}
      handleClose={eliminarSlots}
    />
  
    </>
  );
};


export default MostrarComentarios;

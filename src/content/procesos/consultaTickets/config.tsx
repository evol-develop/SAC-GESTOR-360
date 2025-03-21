import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es, is } from "date-fns/locale";
import { useEffect ,useState} from "react";
import { useAppSelector } from "@/hooks/storeHooks";
import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { motion } from "framer-motion"; // 🔹 Asegúrate de importar motion
import { ticketComentariosInterface, ticketInterface, ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { FaTimes  } from 'react-icons/fa';
import { CardFooter } from "@/components/ui/card";
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.css'; //ESTE SIRVE PARA EL CARRUSEL DE ARCHIVOS, FOTOS Y AUDIOS
import  Reproductor  from "@/components/Reproductor";
import UserAvatar from "@/components/UserAvatar";
import { CropImage } from "@/components/crop-image";
import { data } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { LuUndo2 } from "react-icons/lu";
import FormInput from "@/components/form-base";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal,addItemSlot, updateItemSlot, setIsEditing, setModalSize} from "@/store/slices/page";
import {Form,FormLabel} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler } from "react-hook-form";
import React from "react";
import { uploadImage } from "@/api/storageApi";
import { useAuth } from "@/hooks/useAuth";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { toast } from "sonner";
import {Results } from "./Results";
import { Loading } from "@/components/Loading";
import { Modal } from "@/config/Modal";
import { PAGE_SLOT } from "./constants";
import InfiniteCards from '@/components/InfiniteCards';
import { GrLinkNext } from "react-icons/gr";
import { estatus } from "@/interfaces/procesos/estatus";
import { Autorizar } from "@/components/Autorizar";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { useMemo } from "react";
import { FaUserCheck } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { Notification } from "@/contexts/Notifications";
import { useNotifications } from "@/hooks/useNotifications";

export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as any;
    

    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/comentario/create",
        valoresForm
      );


      return response.data;
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al actualizar la informacion del usuario");
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as any;
  
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/coemntario/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar la alerta`;
    }
  };

  return {
    createItemCatalogo,
    updateItemCatalogo,
  };
};

export const TicketsMovimientos = () => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(); 
  const movimientos = useAppSelector((state: RootState) => state.page.slots.MOVIMIENTOS as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const [etapas, setEtapas] = useState<any[]>([{ title: "", description: "", id:0 }]);
  const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as number);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const userId = useAppSelector((state: RootState) => state.page.slots.userId);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as number);
  const { authState: { user },logout,} = useAuth();

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

        // console.log(ultimoMovimiento)
        // console.log(movimientos)

        // console.log(movimientos[ultimoMovimiento].id)
       
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
  
  function OpenModalComentario(item : any){
   
    dispatch(createSlot({ ModalType: "Comentarios" }));
    dispatch(setIsOpenModal(true));
    dispatch(setDataModal(item));
  }

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
    dispatch(deleteSlot("ticketId"))
    dispatch(deleteSlot("clienteId"))

    dispatch(deleteSlot("etapaActual"))
    dispatch(deleteSlot("userId"))
    
    
    dispatch(deleteSlot("MOVIMIENTOS"))
    dispatch(deleteSlot("COMENTARIOS"))
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
        
        //console.log(movimiento)
        
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
      throw new Error("Error al actualizar al registrar el ticket");
    }
  };
    
 // console.log(user?.userRoll)

  return (<>
    {ticketId ? (
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
                    disabled={(etapaActual - 1) === estatus.CERRADO}
                  >
                    <GrLinkNext />
                    Avanzar a la siguiente etapa
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
                      {usuarios && usuarios.find((user) => user.id === userId)?.fullName}
                    </div>
                </>
              )}
              <div className="flex flex-row p-1 text-xs font-bold text-black border rounded-md ">Folio :</div>
                <div className="flex flex-row p-1 text-xs text-black border rounded-md"> # {ticketId}</div>
                <div className="p-1 text-xs font-bold text-black border rounded-md ">
                  Estatus :
                </div>
                <div className="p-1 text-xs text-black border rounded-md">
                  {BuscarEtapa(etapaActual-1)}
                </div>
              </div>
        )}
      </CardHeader>
      <CardContent>
     
      <InfiniteCards etapas={etapas}  /> 
  
     </CardContent>  
    </Card> 
    </div>):
    ( <Results/>)}
    </>
  );
};

export const crearComentario = () => {
  
  const { dispatch } = usePage(); 
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const [audioList, setAudioList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string }[]>([]);
  const [imageList, setImageList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string}[]>([]);
  const [archivosList, setArchivosList] = React.useState<{ url: string; id: string; tipo:string; nombre:string; blob:Blob}[]>([]);
  const { authState: { user },logout,} = useAuth();
  const { idEmpresa } = useAuth();
  const fileList: { archivoURL: string; tipoArchivo: string; nombreArchivo: string }[] = [];
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  //const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as any);
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as any);
  const selectedIndex = useAppSelector((state: RootState) => state.page.slots.ETAPA);
  const { sendNotification } = useNotifications();
  const destinatario = useAppSelector((state: RootState) => state.page.slots.Destinatario);
  const userId = useAppSelector((state: RootState) => state.page.slots.userId);
  const dirigido_a  = useAppSelector((state: RootState) => state.page.slots.Dirigido);
   
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const id = new Date().toISOString(); 
    setAudioList((prevList) => [...prevList, { url, id, tipo: "audio/webm", blob, nombre: `audio-${id}.webm` }]);
  };

  const handleImageCropped = (croppedFile: string) => {
    const id = new Date().toISOString();
    //console.log(croppedFile);
  
    fetch(croppedFile)
    .then((res) => res.blob())
    .then((blob) => {
      setImageList((prevList) => [
        ...prevList,
        {
          url: croppedFile, // URL del Blob para previsualización
          id: id,
          tipo: blob.type, // Tipo MIME del Blob
          blob: blob, // Blob obtenido
          nombre: `imagen-${id}.png`, // Nombre del archivo
        },
      ]);
    })
    .catch((error) => {
      console.error("Error obteniendo el blob:", error);
    });
  };

  const handleFile = (croppedFile: File) => {
    //console.log(croppedFile);
    const id = new Date().toISOString();
    setArchivosList((prevList) => [...prevList, { id: id, url: URL.createObjectURL(croppedFile), tipo: croppedFile.type.toString(), nombre: croppedFile.name, blob: croppedFile }]);
  };
  
  const eliminarAudio = (id: string) => {
    setAudioList((prevList) => prevList.filter((audio) => audio.id !== id));
  };

  const eliminarImagen = (url: string) => {
    setImageList((prevList) => prevList.filter((audio) => audio.url !== url));
  };

  const eliminarArchivo = (id: string) => {
    //console.log(id);
    setArchivosList((prevList) => prevList.filter((audio) => audio.id !== id));
  };
    
  const validationSchema = z
    .object({
         descripcion: z.string().max(120).min(1, "La descripción es un dato requerido"),
        //  titulo: z.string().max(120).min(1, "El título es un dato requerido"),
        //  clienteId: z.number().int(),
        
    })
    
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      descripcion: dataModal.descripcion,
      // titulo: dataModal.titulo,
     // clienteId: clienteId, 
      
    
    },
  });


    const uploadFile = async (
      list: { url: string; id: string; tipo: string; blob: Blob ; nombre: string}[],
      folder: string,
    ) => {
      for (const element of list) {
        if (element.blob) {
          try {
            const file = new File([element.blob], element.nombre, {
              type: element.tipo,
            });
            const uploaded = await uploadImage(file, folder);
            
            fileList.push({ archivoURL: uploaded as string, tipoArchivo: element.tipo, nombreArchivo: element.nombre });
          } catch (error) {
            console.error(`Error uploading :`, error);
          }
        }
      }
    };
  
    const onSubmit: SubmitHandler<any> = async (valores) => {
      
    try {          
      await uploadFile(audioList, "AUDIOS_TICKETS");
      await uploadFile(imageList, "IMAGENES_TICKETS");
      await uploadFile(archivosList,"ARCHIVOS_TICKETS");

        const valoresForm = {
          id : ticketId,
          empresaId: idEmpresa,
          clienteId: clienteId,
          descripcion: valores.descripcion,
          titulo: valores.titulo,
          archivos: fileList,
          ticketMovimientoId: etapaActual,
          dirigido_a: dirigido_a
        };

        const response = await axios.post<ResponseInterface>(
          "/api/tickets/createComentario",
          valoresForm
        );
        
      
        generalForm.reset();
        setArchivosList([]);
        setAudioList([]);
        setImageList([]);

        dispatch(deleteSlot("NEWCOMENTARIO"))
        dispatch(deleteSlot("Destinatario"))

        console.log(response.data)  
        
        if (response.data.isSuccess ) {
          
            const notification: Notification = {
            title: "Tienes un mensaje en el Ticket #"+ticketId,
            message: 
            "<a href='/site/procesos/consultaTickets/mostrarTicket/"+clienteId+
            "/"+ticketId+"/"+etapaActual+"/"+response.data.result.id+"' "+
            "style={{ textDecoration: 'underline', color: 'blue' }}> Ver comentario</a>  <br/>"+
           
            "<div  className='text-xs'> <b>Comentario:</b> "+valores.descripcion+"  </div>",
            type:"importante",
            groupIds:[],
            userId: destinatario,
          };
              
          try {
            
            sendNotification(notification);
        
          } catch (error) {
            console.error("Error al enviar la notificación", error);
          }
          console.log(destinatario)
          if(etapaActual===selectedIndex+1){
            console.log("LA MISMA ETAPA")
          }
          
          if(etapaActual===selectedIndex+1){
            const result = response.data.result;
          
            const comentarios = {
              fecha: result.fechaCrea,
              id: result.id,
              usuarioCrea: result.usuarioCrea,
              comentario: result.comentario,
              asunto: result.asunto
            };
            
            dispatch(
              addItemSlot({ state: "COMENTARIOS", data: comentarios })
            );
          }

          toast.success(response.data.message);
          
        }else{
          toast.error(response.data.message);
        }

        dispatch(setIsEditing(false));
        dispatch(setDataModal({}));
        dispatch(setIsOpenModal(false));
        dispatch(setModalSize("lg"));

        return response.data;

    } catch (err) {
      
      console.error(err);
      throw new Error("Error al crea el comentario");
    }
      
    };

    
  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };
  
  return (
    <Form {...generalForm}>
       <form onSubmit={generalForm.handleSubmit(onSubmit)}>
        <section className="relative h-[calc(100dvh-252px)] sm:h-[calc(100dvh-200px)] flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full h-full gap-2 p-2 bg-background sm:w-1/2 max-h-1/2 sm:max-h-none">
            {/* <FormInput
              form={generalForm}
              name="titulo"
              label="Asunto "
              placeholder=""
              required /> */}

            <label className="block text-xs font-medium text-black ">
              Comentario
            </label>
            <textarea
              {...generalForm.register("descripcion")}
              placeholder="Escribe aquí..."
              required
              className="w-full h-full p-1 mb-5 text-sm border rounded-md shadow resize-none text-muted-foreground border-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col w-full h-full overflow-y-auto bg-background sm:w-1/2 max-h-1/2 sm:max-h-none">
            <div className="p-1 shadow min-h-80">
              {/* Carrusel de Audios */}
              {audioList.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{audioList.length} Audio(s) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                    {audioList.map((audio) => (
                      <SwiperSlide key={audio.id} className="flex items-center justify-between border rounded-md p-62 max-w-[150px] sm:max-w-[250px]">
                        <button onClick={() => eliminarAudio(audio.id)} className="absolute z-10 text-red-500 top-1 right-1">
                          <FaTimes size={16} />
                        </button>
                        <Reproductor audioUrl={audio.url} style={{ width: "100%" }} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {archivosList.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{archivosList.length} Archivo(s) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3} >
                    {archivosList.map((archivo) => (
                      <SwiperSlide key={archivo.id} className="relative p-2 border rounded-md max-w-[120px] sm:max-w-[250px]">
                        <button onClick={() => eliminarArchivo(archivo.id)} className="absolute text-red-500 top-1 right-1">
                          <FaTimes size={16} />
                        </button>
                        <div className="flex flex-col items-center">
                          <FaFileAlt size={30} />
                          <p className="text-xs truncate max-w-[100px]">{archivo.nombre}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              
              {imageList.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{imageList.length} Imágen(es) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                    {imageList.map((croppedImage) => (
                      <SwiperSlide key={croppedImage.url} className="relative p-2 border rounded-md">
                        <button onClick={() => eliminarImagen(croppedImage.url)} className="absolute text-red-500 top-1 right-1">
                          <FaTimes size={16} />
                        </button>
                        <img src={croppedImage.url} alt="Imagen Adjunta" className="object-contain w-24 h-24 rounded-md" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )} 
            </div>

            <div className="flex flex-col items-end gap-2 mt-2 right-4 ">
            <CropImage
                form={generalForm}
                name="pictureURL"
                setValue={generalForm.setValue}
                onImageCropped={handleImageCropped}
                showPreview={false}
                handleFile={handleFile}
                height="61px"
                width="80%"
              />
            
            <div style={{marginTop:'-8%'}}  >
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadOnSavePress={false}
                downloadFileExtension="webm"
              />
            </div>

            </div>

            <div className="flex flex-col items-end mt-10"  >
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  className="text-xs"
                  disabled={generalForm.formState.isSubmitting}
                >
                {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  Guardar comentario
                  
                </Button>
              </CardFooter>
            </div>
          </div>
        </section>
      </form>
    </Form>
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
      };

        const response = await axios.post<ResponseInterface>(
          "/api/tickets/asignarUsuario",
          valoresForm
        );
        
      
        generalForm.reset();
        dispatch(deleteSlot("ASIGNARUSUARIO"))
        dispatch(deleteSlot("openModal"));
        
        if(response.data.isSuccess){
          
           dispatch(createSlot({ userId: response.data.result.userId }));
           toast.success(response.data.message);

           const notification: Notification = {
            title: "Se te ha asignado un nuevo ticket con el folio #"+ticketId,
            message: 
            "<a href='/site/procesos/consultaTickets/mostrarTicket/"+clienteId+
            "/"+ticketId+"/"+null+"/"+null+"' "+
            "style={{ textDecoration: 'underline', color: 'blue' }}> Ver ticket</a>  <br/>"+
            "<div  className='text-xs'><b>Asunto:</b> "+valores.titulo+" <br/>"+ 
            "<b>Descripción:</b> "+valores.descripcion+" </div>",
            type:"importante",
            groupIds:[],
            userId: valores.userId,
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
      return usuarios.filter(user => user.userRoll !== "Cliente");
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
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="text-xs"
                    disabled={generalForm.formState.isSubmitting}
                  >
                  {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  
                    Asignar usuario
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
  };


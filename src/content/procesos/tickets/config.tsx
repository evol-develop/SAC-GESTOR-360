import * as z from "zod";
import { Card,CardContent, CardHeader} from "@/components/ui/card";
import {Form,FormLabel} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import FormInput from "@/components/form-base";
import FormFooter from "@/components/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { CropImage } from "@/components/crop-image";
import { useForm } from "react-hook-form";
import { uploadImage } from "@/api/storageApi";
import  Reproductor  from "@/components/Reproductor";
import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { FaTrash,FaTimes  } from 'react-icons/fa';
import { SubmitHandler } from "react-hook-form";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { toast } from "sonner";
import {addItemSlot,createSlot,setDataModal,setIsEditing,setIsOpenModal,setModalSize,updateItemSlot,} from "@/store/slices/page";
import { usePage } from "@/hooks/usePage";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.css'; //ESTE SIRVE PARA EL CARRUSEL DE ARCHIVOS, FOTOS Y AUDIOS
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { clienteInterface } from "@/interfaces/catalogos/clienteInterface";
import { serviciosInterface } from "@/interfaces/catalogos/serviciosInterfaces";
import { useGetData } from "@/hooks/useGetData";
import { useEffect, useState } from "react";
import { PAGE_SLOT } from "./constants";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { CardFooter } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/contexts/Notifications";
import { useMemo,useRef } from "react";
import { ComboboxForm } from "@/components/custom-combobox";
import { Dialog } from "@radix-ui/react-dialog";
import { ModalGenerico } from "@/components/ModalGenerico";

const validationSchema = z
  .object({
    descripcion: z.string().max(1000).min(1, "La descripción es un dato requerido"),
    titulo: z.string().max(120).min(1, "El título es un dato requerido"),
    clienteId: z.number().int(),
    servicioId: z.number().int(),
    userId: z.string().optional(),
  })

export const Formulario = () => {
  const { dispatch } = usePage();
  const { authState: { user },logout,} = useAuth();
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const { idEmpresa } = useAuth();
  const fileList: { archivoURL: string; tipoArchivo: string; nombreArchivo: string }[] = [];
  const [audioList, setAudioList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string }[]>([]);
  const [imageList, setImageList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string}[]>([]);
  const [archivosList, setArchivosList] = React.useState<{ url: string; id: string; tipo:string; nombre:string; blob:Blob}[]>([]);
  const Cliente =  useAppSelector((state: RootState) => state.page.slots.clienteId);
  const servicios =useAppSelector((state: RootState) => state.page.slots.SERVICIOS as any[] );
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const { sendNotification } = useNotifications();
  const [usuariosResponsable, setUsuariosResponsable] = useState<string>('');
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const id = new Date().toISOString(); 
    setAudioList((prevList) => [...prevList, { url, id, tipo: "audio/webm", blob, nombre: `audio-${id}.webm` }]);
  };

  const handleImageCropped = (croppedFile: string) => {
    const id = new Date().toISOString();

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
    //console.log(valores);
    
    try {          
      await uploadFile(audioList, "AUDIOS_TICKETS");

      await uploadFile(imageList, "IMAGENES_TICKETS");

      await uploadFile(archivosList,"ARCHIVOS_TICKETS");

      var clienteId = "";

      if(user?.userRoll != "Cliente"){
        clienteId = valores.clienteId;
      }else{
        clienteId = user?.clienteId?.toString() || "";
      }

      const valoresForm = {
        id : valores.id,
        empresaId: idEmpresa,
        clienteId: clienteId,
        descripcion: valores.descripcion,
        titulo: valores.titulo,
        activo: valores.activo,
        archivos: fileList,
        servicioId: valores.servicioId,
        userId: valores.userId,
      };
      console.log(valoresForm);
      
        const response = await axios.post<ResponseInterface>(
          "/api/tickets/create",
          valoresForm
        );

        console.log("response", response.data);

        if(response.data.isSuccess){
        
        generalForm.reset();
        setArchivosList([]);
        setAudioList([]);
        setImageList([]);

        console.log(response.data.result)

        const  groupIds =  usuarios && usuarios
        .filter((item) => item.userRoll ? item.userRoll === "Soporte" :null)
        .map((item) => item.id);

        console.log(groupIds);

        var groupIdsFiltrados: any[] = [];
        groupIdsFiltrados = groupIds.filter((item) => item !== user?.id); //EVITAR ENVIAR LA NOTIFICACION AL USUARIO ACTUAL
        groupIdsFiltrados.push(valores.userId); //AÑADIR ASIGANDO EN LA LISTA 

        console.log(groupIdsFiltrados);

        const notification: Notification = {
          title: "Se ha generado un nuevo ticket con el folio #"+response.data.result.ticketId,
          message: 
          "<a href='/site/procesos/consultaTickets/mostrarArchivos/"
          +response.data.result.ticketId+"/"+0+"' style={{ textDecoration: 'underline', color: 'blue' }}> Ver ticket</a>  <br/>"+
          "<div  className='text-xs'><b>Asunto:</b> "+valores.titulo+" <br/>"+ 
          "<b>Descripción:</b> "+valores.descripcion+" </div>",
          type:"importante",
          groupIds:groupIdsFiltrados,
          userId: "",
          ticketId:response.data.result.ticketId,
          comentarioId:0,
          motivo:"ticket"
        };
            
        try {
          
          sendNotification(notification);
      
        } catch (error) {
          console.error("Error al enviar la notificación", error);
        }

        toast.success("Ticket creado correctamente");
      }

        return response.data;

    } catch (err) {
      
      console.error(err);
      throw new Error("Error al actualizar al registrar el ticket");
    }
    
  };
      
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      descripcion: dataModal.descripcion,
      titulo: dataModal.titulo,
      clienteId: dataModal.clienteId,  // Asegura un valor inicial
      servicioId: dataModal.servicioId,
      userId: dataModal.userId,
    },
  });
  
  const seleccionarCliente = (value: string|number) => {
   console.log(value);
    dispatch(createSlot({ ["clienteId"]: parseInt(value.toString()) }));
    //generalForm.setValue("clienteId", parseInt(value.toString()));
    dispatch(createSlot({"SERVICIOS": []}));
    
  };

  const seleccionarServicio = (value: string) => {
   
    var servicio = servicios.find((x) => x.id === parseInt(value));
    generalForm.setValue("titulo", servicio?.descripcion);
    
    generalForm.setValue("userId", undefined);
    
    dispatch(createSlot({ ["servicioId"]: parseInt(value) }));
    generalForm.setValue("servicioId", parseInt(value));

    const servicioSeleccionado = servicios.find(
      (servicio: serviciosInterface) => servicio.id === parseInt(value)
    );

    setUsuariosResponsable(servicioSeleccionado.usuario_responsable.id);

    generalForm.setValue("userId", servicioSeleccionado.usuario_responsable.id);
  };

  const CargaServicios = async () => {
    try {
      const response = await axios.get(
        `/api/clientes/getServiciosByCliente/${Cliente}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
       
        const servicios = response.data.result.map((item:any) => ({
          id: item.servicio?.id,
          descripcion: item.servicio?.descripcion || "",
          usuario_responsable : {
            id: item.servicio?.user?.id,
            nombre: item.servicio?.user?.fullName || "",
          },
          usuarios: item.servicio?.departamento?.departamentosUsuarios
          ?.map((depUsuario: any) => 
            depUsuario.user
              ? {
                  id: depUsuario.user.id,
                  nombre: depUsuario.user.fullName || "",
                }
              : null
          )
          .filter(Boolean) || [],
        }));
  
        dispatch(createSlot({ SERVICIOS: servicios }));
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (Cliente) {
     
      generalForm.setValue("clienteId", parseInt(Cliente));
      CargaServicios();
    }
  }, [Cliente]);

  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };

  const usuariosFiltrados = useMemo(() => {
    if(usuarios){
    return usuarios.filter(user => user.userRoll !== "Cliente");
    }
  }, [usuarios]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null || e.clientY <= 0) {
        setIsDraggingFile(false);
      }
    };

    const handleDrop = () => {
      setIsDraggingFile(false);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleImageClick = (url: string) => {
    
    setImagenSeleccionada(url);
    dispatch(createSlot({ openModal: true }));
  };
  
    return (
      <>
      {isDraggingFile && (
        <div className="flex absolute inset-0 justify-center items-center bg-gray-500 bg-opacity-30 pointer-events-none">
        </div>
      )}

      <Card className="h-full" >
      <CardHeader>
      <div className="flex justify-center items-center">
        <h5 className="text-sm enter font-xbold sm:text-left">
          Generación de Tickets
        </h5>
      </div>
      </CardHeader> 
      <CardContent>
       <Form {...generalForm}>
     <form onSubmit={generalForm.handleSubmit(onSubmit)}>
     <div className="flex flex-col md:flex-row">

      <div className="px-4 w-full md:w-1/2">
          <div className="h-full min-h-[200px]">
            <div className="grid grid-cols-1 gap-4 p-1">

            {user?.userRoll != "Cliente" && 
              (
                  <ComboboxForm
                  label="Cliente"
                  tipo="CLIENTES"
                  name="clienteId"
                  form={generalForm}
                  onSelect={seleccionarCliente}
                  isDraggingFile={isDraggingFile}/>
                
              )}
                 
              <div className="flex gap-2 items-center">
               <FormLabel className="text-xs">Servicio: </FormLabel>
               <Select name="servicioId" onValueChange={seleccionarServicio}  key={generalForm.watch("servicioId")}>
                 <SelectTrigger>
                   <SelectValue
                     placeholder={servicios && servicios.length > 0
                       ? servicios.find((x) => x.id === generalForm.watch("servicioId"))
                         ?.descripcion || "Seleccione un servicio"
                       : "Cargando..."} />
                 </SelectTrigger>
                 <SelectContent>
                   {servicios && servicios.map((item: { id: number; descripcion: string; }) => (
                     <SelectItem key={item.id} value={item.id.toString()}>
                       {item.descripcion}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
              </div>
 
              {user?.userRoll != "Cliente" && 
                <>
                <div className="flex gap-2 items-center">  
                      <FormLabel className="text-xs whitespace-nowrap">Asignar a: </FormLabel>
                      <Select name="userId" onValueChange={(value) => generalForm.setValue("userId", value)}>
                        <SelectTrigger>
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
                    
                    {/* {usuariosResponsable && (
                    <><FormLabel className="text-xs">Usuario responsable</FormLabel><UserAvatar
                          withTooltip
                          userId={usuariosResponsable}
                          className="size-6"
                          rounded="rounded-full" /></>)} */}
                        
                  </div>
                </>
               }
 
                <FormInput
                 form={generalForm}
                 name="titulo"
                 label="Asunto :"
                 placeholder=""
                 required />
              

                {/* <ComboboxForm
                label="Asunto"
                tipo="ASUNTOS"
                name="titulo"
                form={generalForm}
                 /> */}

               <label className="block text-xs font-medium text-black dark:text-white">
                 Descripción del problema :
               </label>
               
               <textarea
                {...generalForm.register("descripcion")}
                placeholder="Describa su problema aquí..."
                required
                className="p-1 mb-5 w-full h-20 text-sm text-black bg-white rounded-md border shadow xl:h-32 resize-non border-muted focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-950 dark:text-white"
              />

 
 
             </div>
           </div>
       </div>
         
         <div className="px-4 w-full md:w-1/2"> 
           <div className="mb-0 min-h-[30px] mt-4 ">
             
               <div className="relative rounded-md border shadow min-h-80">
                 {/* Carrusel de Audios */}
                 {audioList.length > 0 && (
                   <div>
                     <h3 className="text-xs font-bold">{audioList.length} Audio(s) </h3>
                     <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                       {audioList.map((audio) => (
                         <SwiperSlide key={audio.id} className="flex justify-between items-center p-2 rounded-md border">
                           <button onClick={() => eliminarAudio(audio.id)} className="absolute top-1 right-1 z-10 text-red-500">
                             <FaTimes size={16} />
                           </button>
                           <Reproductor audioUrl={audio.url} style={{ width: "100%", height: "8vh" }} />
                         </SwiperSlide>
                       ))}
                     </Swiper>
                   </div>
                 )}
 
                 {/* Carrusel de Archivos */}
                 {archivosList.length > 0 && (
                   <div>
                     <h3 className="text-xs font-bold">{archivosList.length} Archivo(s) </h3>
                     <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                       {archivosList.map((archivo) => (
                         <SwiperSlide key={archivo.id} className="relative p-2 rounded-md border">
                           <button onClick={() => eliminarArchivo(archivo.id)} className="absolute top-1 right-1 text-red-500">
                             <FaTimes size={16} />
                           </button>
                           <div className="flex flex-col items-center">
                             <FaFileAlt size={30} />
                             <p className="text-xs truncate max-w-[100px] h-10">{archivo.nombre}</p>
                           </div>
                         </SwiperSlide>
                       ))}
                     </Swiper>
                   </div>
                 )}
 
                 {/* Carrusel de Imágenes */}
                 {imageList.length > 0 && (
                   <div>
                     <h3 className="text-xs font-bold">{imageList.length} Imágen(es) </h3>
                     <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                       {imageList.map((croppedImage) => (
                         <SwiperSlide key={croppedImage.url} className="relative p-2 rounded-md border">
                           <button onClick={() => eliminarImagen(croppedImage.url)} className="absolute top-1 right-1 text-red-500">
                             <FaTimes size={16} />
                           </button>
                           <img src={croppedImage.url} alt="Imagen Adjunta" className="object-contain w-full h-24 rounded-md cursor-pointer group-hover:opacity-90" onClick={() => handleImageClick(croppedImage.url)} />
                         </SwiperSlide>
                       ))}
                     </Swiper>
                   </div>
                 )}
 
               {imageList.length ===0 && archivosList.length ===0&& audioList.length ===0 &&(
               <div className="flex absolute inset-0 justify-center items-center text-gray-400 opacity-70">
               <span>Sin archivos adjuntos</span>
             </div>)}
                 
               </div>
 
               <div className={`flex z-10 flex-row gap-1 items-end mt-2 bg-white dark:bg-gray-950`}>
                
               <CropImage
                 form={generalForm}
                 name="pictureURL"
                 setValue={generalForm.setValue}
                 onImageCropped={handleImageCropped}
                 showPreview={false}
                 handleFile={handleFile}
                 height="100%"
                 width="100%"
                 isDraggingFile={isDraggingFile}
               /> 
              
               <div style={{marginTop:'-15% !important', marginLeft:'-15%'}}  >
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
 
               <div className="flex right-4 flex-col items-end mt-10"  >
                 <CardFooter className="flex gap-2 justify-end">
                   <Button
                     type="submit"
                     className="text-xs"
                     disabled={generalForm.formState.isSubmitting}
                   >
                   {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                     Generar ticket
                     
                   </Button>
                 </CardFooter>
               </div>
               
           </div>
         </div>
       </div>
      </form>
      </Form>
      </CardContent>  
      </Card>

       
      {imagenSeleccionada && (
        <ModalGenerico
        titulo={"Imagen seleccionada"}
        Content={() => (
        <div className="flex justify-center items-center">
        <img
        src={imagenSeleccionada}
        alt="Imagen seleccionada"
        className="object-contain rounded-md"
        />
        </div>
        )}
        handleClose={() => setImagenSeleccionada(null)}
        />
      )}
    </>);
};

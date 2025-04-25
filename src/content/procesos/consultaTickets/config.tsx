
import { useEffect ,useState} from "react";
import { useAppSelector } from "@/hooks/storeHooks";
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
import { CropImage } from "@/components/crop-image";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";;
import {Form,FormLabel} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler } from "react-hook-form";
import React from "react";
import { deleteFile, uploadImage } from "@/api/storageApi";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { toast } from "sonner";
import { Notification } from "@/contexts/Notifications";
import { useNotifications } from "@/hooks/useNotifications";

import { ColumnDef } from "@tanstack/react-table";
import {Acciones,DeleteDialog,ResultsCatalogo,} from "@/config/catalogoGenerico";
import { ENDPOINTDELETE, PAGE_SLOT,titulos } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { estatus } from "@/interfaces/procesos/estatus";
import UserAvatar from "@/components/UserAvatar";
import { getItemAtendidoLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";
import { usePage } from "@/hooks/usePage";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal, setModalSize, addItemSlot,deleteItemSlot, updateItemSlot} from "@/store/slices/page";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/utils/axios";
import { updateItem } from "@/api";


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

export const CargarArchivosByComentario = async (ticketInfo: any, dispatch: any, user: any, id_comentario :number) => {
  try {
    dispatch(setIsLoading(true));

    const response = await axios.get(`/api/tickets/getArchivosByComentario/${ticketInfo !==0 ? ticketInfo.ticketId:0}`, {
      params: { id_comentario: id_comentario }
    });

    if (response.data.isSuccess) {
      dispatch(setIsLoading(false));

      const ticket = response.data.result.ticket;
      const archivos = response.data.result.archivos;
      const comentario = response.data.result.comentario;
      
      const audioExtensions = ["audio"];
      const imageExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "tiff", "webp", "image/jpeg"];
      const fileExtensions = ["application", "txt"];

      const audioList: any[] = [];
      const imageList: any[] = [];
      const archivosList: any[] = [];

      archivos.forEach((item: any) => {
        const tipo = item.tipoArchivo.toLowerCase();
        if (audioExtensions.some(ext => tipo.includes(ext))) {
          audioList.push(item);
        } else if (imageExtensions.some(ext => tipo.includes(ext))) {
          imageList.push(item);
        } else {
          archivosList.push(item);
        }
      });

      dispatch(createSlot({ audios: audioList.map(formatArchivo) }));
      dispatch(createSlot({ imagenes: imageList.map(formatArchivo) }));
      dispatch(createSlot({ archivos: archivosList.map(formatArchivo) }));

          
      dispatch(setModalSize("2xl"));
      dispatch(setIsOpenModal(true));
      dispatch(createSlot({ ModalType: "EDITAR" }));
     
      if(ticketInfo !== 0){
        dispatch(createSlot({ ticketId: ticketInfo.ticketId }));
        dispatch(createSlot({ clienteId: ticketInfo.ticket.clienteId }));
        dispatch(createSlot({ movimientoId: ticketInfo.id }));
        dispatch(createSlot({ comentario: ticket.descripcion }));
      }else{
        dispatch(createSlot({ comentario: comentario }));
        dispatch(createSlot({ comentarioId: id_comentario }));
      }
      
    } else {
      dispatch(setIsLoading(false));
    }
  } catch (err) {
    dispatch(setIsLoading(false));
    console.error(err);
  }
};

const formatArchivo = (item: any) => ({
  id: item.id,
  url: item.archivoURL,
  tipo: item.tipoArchivo,
  nombre: item.nombreArchivo,
  blob: item.blob as any,
});
  

export const crearComentario = () => {
  
  const { dispatch } = usePage(); 
  const fileList: { archivoURL: string; tipoArchivo: string; nombreArchivo: string }[] = [];
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const audios = useAppSelector((state: RootState) => state.page.slots.audios as any[]);
  const imagenes = useAppSelector((state: RootState) => state.page.slots.imagenes as any[]);
  const archivos = useAppSelector((state: RootState) => state.page.slots.archivos as any[]);
  const { authState: { user },logout,} = useAuth();
  const { idEmpresa } = useAuth();
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as number);
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as any);
  const etapaSeleccionada = useAppSelector((state: RootState) => state.page.slots.etapaSeleccionada);
  const { sendNotification } = useNotifications();
  //const destinatario = useAppSelector((state: RootState) => state.page.slots.Destinatario);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const dirigido_a  = useAppSelector((state: RootState) => state.page.slots.Dirigido);
  const tipoOperacion = useAppSelector((state:RootState) => state.page.slots.tipoOperacion);
  const comentario = useAppSelector((state:RootState) => state.page.slots.comentario);
  const comentarioId = useAppSelector((state:RootState) => state.page.slots.comentarioId);

  const asignado = useAppSelector((state: RootState) => state.page.slots.asignado);
  const clienteAuth = useAppSelector((state: RootState) => state.page.slots.clienteAuth);

  
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const id = new Date().toISOString();
    
    const data = {
      url: url,
      id: id,
      tipo: "audio/webm",
      blob: blob,
      nombre: `audio-${id}.webm`
    };
  
    // Comprobar si "audios" existe y si ya contiene el archivo
    if (audios !== undefined && !audios.some(audio => audio.id === id)) {
      dispatch(
        addItemSlot({
          state: "audios",
          data: data
        })
      );
    } else if (audios === undefined) {
      dispatch(createSlot({ audios: [data] }));
    }
  };
  
  const handleImageCropped = (croppedFile: string) => {
    const id = new Date().toISOString();
    fetch(croppedFile)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob); // Crea la URL del Blob
  
        // Almacena solo la URL en el estado de Redux, no el Blob
        const data={ url: croppedFile, id, tipo: blob.type, nombre: `imagen-${id}.png`, blob: blob }

        if (imagenes !== undefined && !imagenes.some(audio => audio.id === id)) {
          dispatch(
            addItemSlot({
              state: "imagenes",
              data: data
            })
          );
        } else if (imagenes === undefined) {
          dispatch(createSlot({ imagenes: [data] }));
        }

      })
      .catch((error) => console.error("Error obteniendo el blob:", error));
  };
  
  const handleFile = (file: File) => {
    const id = new Date().toISOString();
    // Comprobar si "archivos" existe y si ya contiene el archivo
    if (archivos !== undefined && !archivos.some(archivo => archivo.id === id)) {
      dispatch(
        addItemSlot({
          state: "archivos",
          data: { id, url: URL.createObjectURL(file), tipo: file.type, nombre: file.name, blob: file }
        })
      );
    } else if (archivos === undefined) {
      dispatch(createSlot({ archivos: [{ id, url: URL.createObjectURL(file), tipo: file.type, nombre: file.name, blob: file }] }));
    }
  };
  
  const eliminarAudio = async(id: string, url :string) => {
    dispatch(deleteItemSlot({ state: "audios", data:id }));

    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop()?.split('?')[0];    
    await deleteFile(fileName ?fileName:"", "AUDIOS_TICKETS")
  };
  
  const eliminarImagen = async (id: string, url :string) => {
    dispatch(deleteItemSlot({ state: "imagenes", data: id }));

    
    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop()?.split('?')[0];    
    await deleteFile(fileName ?fileName:"", "IMAGENES_TICKETS")
     
  };
  
  const eliminarArchivo = async(id: string, url :string) => {
    dispatch(deleteItemSlot({ state: "archivos", data:id }));

    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop()?.split('?')[0];    
    await deleteFile(fileName ?fileName:"", "ARCHIVOS_TICKETS")
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

    const uploadFile = async (list: any[], folder: string) => {
      for (const element of list) {
        if (element.blob) {
          try {
            const file = new File([element.blob], element.nombre, { type: element.tipo });
            const uploaded = await uploadImage(file, folder);
            fileList.push({ archivoURL: uploaded as string, tipoArchivo: element.tipo, nombreArchivo: element.nombre });
          } catch (error) {
            console.error(`Error uploading :`, error);
          }
          
        }else{
          
          fileList.push({ archivoURL: element.url, tipoArchivo: element.tipo, nombreArchivo: element.nombre });
        }
      }
    };
    
  
    const onSubmit: SubmitHandler<any> = async (valores) => {
      
    try {          
      if(audios != undefined ) await uploadFile(audios, "AUDIOS_TICKETS");
      if(imagenes != undefined ) await uploadFile(imagenes, "IMAGENES_TICKETS");
      if(archivos != undefined )await uploadFile(archivos,"ARCHIVOS_TICKETS");

      if(tipoOperacion != undefined && tipoOperacion === "CrearComentario" ){

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
        
        dispatch(deleteSlot("tipoOperacion"))
        
        dispatch(deleteSlot("audios"))
        dispatch(deleteSlot("imagenes"))
        dispatch(deleteSlot("archivos"))
        
        generalForm.reset();

        if (response.data.isSuccess ) {
          
          if(etapaActual===etapaSeleccionada+1){
            
            const result = response.data.result;

          
            const comentarios = {
              fecha: result.fechaCrea,
              id: result.id,
              usuarioCrea: result.userId,
              comentario: result.comentario,
              asunto: ""
            };

            if(dirigido_a === "ASIGNADO"){
              dispatch(
                addItemSlot({ state: "COMENTARIOS_ASIGNADO", data: comentarios })
              );
            }else{
              dispatch(
                addItemSlot({ state: "COMENTARIOS_CLIENTE", data: comentarios })
              );
            }
          
          }

          
        // console.log(user?.userRoll);
        // //console.log(groupIds);
        // console.log(asignado);
        // console.log(clienteAuth);

          var groupIds: any[] = [];

          var destinatario ="";

          console.log(user?.userRoll)

          switch(user?.userRoll)
          {
            // case "Cliente":
            //   break;
            // case "Desarrollo":
            //   break;
            case "Soporte":
            case "Administrador":
              
              destinatario = dirigido_a === "ASIGNADO"? asignado:clienteAuth;
              
              break;
          }

        
          groupIds =  usuarios && usuarios
        .filter((item) => item.departamento ? item.departamento.nombre === "Soporte":null)
        .map((item) => item.id); // Asumí que `id` es el campo que quieres agregar a `groupIds`

          const notification: Notification = {
            title: "Hay un nuevo mensaje en el Ticket #" + ticketId,
            message: 
              "<a href='/site/procesos/consultaTickets/mostrarComentarios/" + ticketId + 
              "' style='text-decoration: underline; color: blue;'>Ver comentario</a><br/>" +
              "<div style='font-size: 12px;'><b>Comentario:</b> " + valores.descripcion + "</div>",
            type: "importante",
            groupIds: groupIds, //avisar todo el departamento 
            userId: destinatario? destinatario as string: undefined,
            ticketId: ticketId,
            comentarioId:1,
             motivo:"ticket"
          };
          
              
          try {

            sendNotification(notification);
  
          } catch (error) {
            console.error("Error al enviar la notificación", error);
          }
          
          
          toast.success(response.data.message);
          
        }else{
          toast.error(response.data.message);
        }

        dispatch(deleteSlot("Dirigido"))
        dispatch(deleteSlot("Destinatario"))
        
        dispatch(setIsOpenModal(false));
        dispatch(setDataModal({}));
        //dispatch(setModalSize("lg"));

        return response.data.result;

      }else if(tipoOperacion != undefined && tipoOperacion === "EditarTicket" ){
        
        const valoresForm = {
            id : ticketId,
            empresaId: idEmpresa,
            clienteId: clienteId,
            descripcion: valores.descripcion,
            titulo: valores.titulo,
            archivos: fileList,
            
            ticketMovimientoId:movimientoId
          };
          
            const response = await axios.post<ResponseInterface>(
              "/api/tickets/update",
              valoresForm
            );

          dispatch(deleteSlot("tipoOperacion"))
            
          dispatch(deleteSlot("audios"))
          dispatch(deleteSlot("imagenes"))
          dispatch(deleteSlot("archivos"))
                        
          dispatch(setIsOpenModal(false));
          dispatch(setDataModal({}));
          //dispatch(setModalSize("lg"));

          toast.success(response.data.message);

          return response.data.result;
        
      }else{
        
        const valoresForm = {
          id : ticketId,
          // empresaId: idEmpresa,
          // clienteId: clienteId,
          descripcion: valores.descripcion,
          // titulo: valores.titulo,
          archivos: fileList,
          ticketComentarioId: comentarioId,
          // ticketMovimientoId:movimientoId
        };
        
        const response = await axios.post<ResponseInterface>(
          "/api/tickets/updateComentario",
          valoresForm
        );
        

        
        dispatch(deleteSlot("tipoOperacion"))

        dispatch(deleteSlot("audios"))
        dispatch(deleteSlot("imagenes"))
        dispatch(deleteSlot("archivos"))
        
        dispatch(deleteSlot("comentarioId"))
        dispatch(deleteSlot("comentario"))
                        
        dispatch(setIsOpenModal(false));
        dispatch(setDataModal({}));

        if(response.data.isSuccess){

          toast.success(response.data.message);

          var comentario ={
            id: comentarioId,
            comentario : valores.descripcion,
            fecha: response.data.result.fechaCrea,
            usuarioCrea: response.data.result.userId,
          }

          if(dirigido_a === "ASIGNADO"){
            dispatch(
              updateItemSlot({ state: "COMENTARIOS_ASIGNADO", data: comentario })
            );
          }else{
            dispatch(
              updateItemSlot({ state: "COMENTARIOS_CLIENTE", data: comentario })
            );
          }
          
          
          
        }

        return response.data.result;
      
      }
      
    } catch (err) {
      
      toast.error("Error al guardar el comentario");
    }
      
    };

  function onSubmit1(valores: any) {
    //generalForm.handleSubmit()
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };
  
  useEffect(() => {
    if (comentario !== undefined) {
      generalForm.setValue("descripcion", comentario);
    }
  }, [comentario]); 
  return (
    <Form {...generalForm}>
       <form onSubmit={generalForm.handleSubmit(onSubmit)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>

        <section className="relative h-[calc(100dvh-252px)] sm:h-[calc(100dvh-200px)] flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2 p-2 w-full h-full bg-background sm:w-1/2 max-h-1/2 sm:max-h-none">
            {/* <FormInput
              form={generalForm}
              name="titulo"
              label="Asunto "
              placeholder=""
              required /> */}

            <label className="block text-xs font-medium text-black">
              Comentario
            </label>
            <textarea
              {...generalForm.register("descripcion")}
              placeholder="Escribe aquí..."
              required
              className="p-1 mb-5 w-full h-full text-sm rounded-md border shadow resize-none text-muted-foreground border-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex overflow-y-auto flex-col w-full h-full sm:w-1/2 max-h-1/2 sm:max-h-none">
            <div className="rounded-md border shadow min-h-80">

              {audios && audios.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{audios.length} Audio(s) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                    {audios.map((audio:any) => (
                      <SwiperSlide key={audio.id} className="flex items-center justify-between border rounded-md p-62 max-w-[150px] sm:max-w-[250px]">
                        <button onClick={() => eliminarAudio(audio.id, audio.url)} className="absolute top-1 right-1 z-10 text-red-500">
                          <FaTimes size={16} />
                        </button>
                        <Reproductor audioUrl={audio.url} style={{ width: "100%" }} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {archivos && archivos.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{archivos.length} Archivo(s) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3} >
                    {archivos.map((archivo:any) => (
                      <SwiperSlide key={archivo.id} className="relative p-2 border rounded-md max-w-[120px] sm:max-w-[250px]">
                        <button onClick={() => eliminarArchivo(archivo.id, archivo.url)} className="absolute top-1 right-1 text-red-500">
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

              
              {imagenes && imagenes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold">{imagenes.length} Imágen(es) </h3>
                  <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={3}>
                    {imagenes.map((croppedImage:any) => (
                      <SwiperSlide key={croppedImage.url} className="relative p-2 rounded-md border">
                        <button type="button" onClick={() => eliminarImagen( croppedImage.id, croppedImage.url)} className="absolute top-1 right-1 text-red-500">
                          <FaTimes size={16} />
                        </button>
                        <img src={croppedImage.url} alt="Imagen Adjunta" className="object-contain w-24 h-24 rounded-md" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )} 

              {imagenes === undefined && archivos === undefined && audios=== undefined &&(
              <div className="flex justify-center items-center min-h-full text-gray-400 opacity-70">
                Sin archivos adjuntos</div>)}
            </div>

            <div className="flex right-4 flex-col gap-2 items-end mt-2">
            <CropImage
                form={generalForm}
                name="pictureURL"
                setValue={generalForm.setValue}
                onImageCropped={handleImageCropped}
                showPreview={false}
                handleFile={handleFile}
                height="65px"
                width="90%"
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
              <CardFooter className="flex gap-2 justify-end">
                <Button
                  type="submit"
                  className="text-xs"
                  disabled={generalForm.formState.isSubmitting}
                >
                {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  Enviar 
                  
                </Button>
              </CardFooter>
            </div>
          </div>
        </section>
      </form>
    </Form>
  );
};
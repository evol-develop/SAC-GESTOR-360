import * as z from "zod";
import { Card,CardContent} from "@/components/ui/card";
import {Form} from "@/components/ui/form";
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
import {
  addItemSlot,
  createSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
  updateItemSlot,
} from "@/store/slices/page";
import { usePage } from "@/hooks/usePage";

const validationSchema = z
  .object({
    descripcion: z.string().max(120).min(1, "La descripción es un dato requerido"),
    titulo: z.string().max(120).min(1, "El título es un dato requerido"),
  })


export const Formulario = () => {

  const { dispatch } = usePage("TICKETS");
  
  const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
    if (isSuccess) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    dispatch(setIsOpenModal(false));
    dispatch(setDataModal({}));
    dispatch(setModalSize("lg"));
  };
  
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const { idEmpresa } = useAuth();
  const fileList: { archivoURL: string; tipoArchivo: string }[] = [];
  const [audioList, setAudioList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string }[]>([]);
  const [imageList, setImageList] = React.useState<{ url: string; id: string; tipo:string; blob:Blob ; nombre:string}[]>([]);
  const [archivosList, setArchivosList] = React.useState<{ url: string; id: string; tipo:string; nombre:string; blob:Blob}[]>([]);

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const id = new Date().toISOString(); 
    setAudioList((prevList) => [...prevList, { url, id, tipo: "audio/webm", blob, nombre: `audio-${id}.webm` }]);
  };

  const handleImageCropped = (croppedFile: string) => {
    const id = new Date().toISOString();
    console.log(croppedFile);
  
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
    console.log(croppedFile);
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
    console.log(id);
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
          
          fileList.push({ archivoURL: uploaded as string, tipoArchivo: element.tipo });
        } catch (error) {
          console.error(`Error uploading :`, error);
        }
      }
    }
  };


    const onSubmit1: SubmitHandler<any> = async (valores) => {
      console.log(valores);
      
      try {          
        await uploadFile(audioList, "AUDIOS_TICKETS");
  
        await uploadFile(imageList, "IMAGENES_TICKETS");
  
        await uploadFile(archivosList,"ARCHIVOS_TICKETS");
  
        const valoresForm = {
          id : valores.id,
          id_empresa: idEmpresa,
          id_cliente: idEmpresa,
          descripcion: valores.descripcion,
          titulo: valores.titulo,
          activo: valores.activo,
          archivos: fileList,
        };
  
        console.log(valoresForm);
  
          const response = await axios.post<ResponseInterface>(
            "/api/tickets/create",
            valoresForm
          );
         
          // handleCreateItemSuccess(response.data.isSuccess, response.data.message);

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
    },
  });
  
  return (
    <><div className="flex items-center justify-center mb-2">
      <h1 className="text-xl font-bold text-center sm:text-left">
        Generación de Tickets
      </h1>
    </div>
    <div className="flex flex-col items-stretch justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex-grow order-2 w-full max-w-lg px-4 mt-4 mb-0 sm:order-2 sm:mt-0">
          <Card className="mb-0 shadow h-full min-h-[40px]" >
            <CardContent >
              <div className="space-y-2">
                
               
              <div className="min-h-48">
              {audioList.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-2 p-2 text-xs font-bold ">
                    {audioList.length} audio{audioList.length > 1 && "s"} adjunto{audioList.length > 1 && "s"}
                  </div>
                  <div className="overflow-y-auto max-h-36">
                    <div className="grid grid-cols-2 gap-4"> {/* Aquí hemos cambiado space-y-4 por grid-cols-2 */}
                      {audioList.map((audio) => (
                        <div key={audio.id} className="flex items-center justify-between">
                          {/* Reproductor de audio */}
                          <Reproductor audioUrl={audio.url} />
                          {/* Botón de eliminación */}
                          <button
                            onClick={() => eliminarAudio(audio.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              </div>
              
              <div className="min-h-32">
              {archivosList.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-4 p-2 text-xs font-bold">
                    {archivosList.length} archivo{archivosList.length > 1 && "s"} adjunto{archivosList.length > 1 && "s"}
                  </div>
                  <div className="overflow-y-auto max-h-40">
                    <div className="flex w-full mt-2 space-x-4 overflow-x-auto md:mt-0">
                      {archivosList.map((archivo) => {
                        let icon;
                        if (archivo.tipo === "application/pdf") {
                          icon = <FaFilePdf size={30} />;
                        } else if (archivo.tipo === "application/msword" || archivo.tipo === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                          icon = <FaFileWord size={30} />;
                        } else if (archivo.tipo === "application/vnd.ms-excel" || archivo.tipo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                          icon = <FaFileExcel size={30} />;
                        } else {
                          icon = <FaFileAlt size={30} />;
                        }

                        return (
                          <div
                            key={archivo.id}
                            className="relative flex items-center justify-center w-20 h-20 border rounded-md border-muted">
                            <div className="flex flex-col items-center justify-center space-y-1 text-center text-muted-foreground">
                                <button
                                  onClick={() => eliminarArchivo(archivo.id)}
                                  className="absolute top-[-5px] right-[-10px] z-10 p-1 text-red-500 transition-opacity duration-200 opacity-100 hover:text-red-700">
                                  <FaTimes size={16} />
                                </button>
                              <div className="relative group">
                                {icon}
                                {/* Tooltip */}
                                <div className="absolute top-0 z-0 hidden px-2 py-1 text-xs text-white transform bg-black rounded -translate-x-1/4 left-1/4 group-hover:block">
                                  {archivo.nombre}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              </div>

              {imageList.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 p-2 text-xs font-bold">
                  {imageList.length} imágen{imageList.length > 1 && "es"} adjunta{imageList.length > 1 && "s"}
                </div>
                <div className="overflow-y-auto max-h-38">
                  <div className="flex w-full mt-2 space-x-4 overflow-x-auto md:mt-0">
                    {imageList.map((croppedImage) => (
                      <div key={croppedImage.url} className="relative flex items-center justify-center w-20 h-20 border rounded-md border-muted">
                        <button
                          onClick={() => eliminarImagen(croppedImage.url)}
                          className="absolute top-[-5px] right-[-10px] z-10 p-1 text-red-500 transition-opacity duration-200 opacity-100 hover:text-red-700"
                        >
                          <FaTimes size={16} />
                        </button>
                        <img
                          src={croppedImage.url}
                          alt="Cropped"
                          className="object-contain w-full h-full rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}


              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-grow order-1 w-full max-w-lg px-4 sm:order-1">
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onSubmit1)}>
              <Card className="mb-0 shadow h-full min-h-[300px]">
                <CardContent className="grid grid-cols-1 gap-4 p-6">
                  <FormInput
                    form={generalForm}
                    name="titulo"
                    label="Título"
                    placeholder=""
                    required />

                  <label className="block text-xs font-medium text-black ">
                    Descripción
                  </label>
                  <textarea
                    {...generalForm.register("descripcion")}
                    placeholder="Escribe aquí..."
                    required
                    className="w-full h-32 p-1 text-sm border rounded-md resize-none text-muted-foreground border-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex p-4 mb-2 space-x-4">
                    <div className="flex items-center justify-center h-20 w-50">
                      <CropImage
                        form={generalForm}
                        name="pictureURL"
                        setValue={generalForm.setValue}
                        onImageCropped={handleImageCropped}
                        showPreview={false}
                        handleFile={handleFile}
                      />
                    </div>

                    <div className="flex items-center justify-center h-20">
                      <React.StrictMode>
                        <AudioRecorder
                          onRecordingComplete={addAudioElement}
                          audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                          }}
                          downloadOnSavePress={false}
                          downloadFileExtension="webm"
                        />
                      </React.StrictMode>
                    </div>
                  </div>

                  <FormFooter
                    showButton={false}
                    handleCreateItemClose={null}
                    form={generalForm}
                    dataModal={dataModal} />
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </>
  );

};

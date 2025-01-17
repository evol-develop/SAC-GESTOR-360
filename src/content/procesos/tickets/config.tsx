import * as z from "zod";
import { Card,CardContent} from "@/components/ui/card";
import {Form} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import FormInput from "@/components/form-base";
import FormFooter from "@/components/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsFormulario } from "@/interfaces/formInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { CropImage } from "@/components/crop-image";
//import { IMAGE_SCHEMA } from "@/lib/utils/docType";
import { ticketInterface } from "@/interfaces/procesos/ticketInterface";
import { useForm } from "react-hook-form";
import { uploadImage } from "@/api/storageApi";
import  Reproductor  from "@/components/Reproductor";

import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';


const IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(file => file.size > 0, "La imagen es un dato requerido");


const validationSchema = z
  .object({
    descripcion: z.string().max(120).min(1, "La descripción es un dato requerido"),
    titulo: z.string().max(120).min(1, "El título es un dato requerido"),
    pictureURL: IMAGE_SCHEMA,
    audioFile: z
      .any()
      .refine((file) => file !== null && file !== undefined, "El audio es un dato requerido"),  // Audio obligatorio
  })

export const OperacionesFormulario = () => {
  
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as ticketInterface;
    

    const valoresForm = {
      id : valores.id,
      id_empresa: idEmpresa,
      id_cliente: idEmpresa,
      descripcion: valores.descripcion,
      titulo: valores.titulo,
      activo: valores.activo,
      pictureURL: valores.pictureURL,
      audioFile: valores.audioFile,
    };

    if (valores.pictureURL !== "" && valores.pictureURL instanceof File) {
      try {
        const uploaded = await uploadImage(valores.pictureURL, "TICKETS");
        valoresForm.pictureURL = uploaded;
      } catch (error) {
        console.error(error);
      }
    } else {
      delete valoresForm.pictureURL;
    }

    if (valores.audioFile instanceof Blob) {
      try {
        const audioFile = new File([valores.audioFile], `audio-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        const uploadedAudio = await uploadImage(audioFile, "AUDIOS");
        valoresForm.audioFile = uploadedAudio; // Actualizar la URL del audio
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    } else {
      delete valoresForm.audioFile;
    }

    console.log(valoresForm);

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/tickets/create",
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
    // const valores = values.values as ticketInterface;
  
    // const valoresForm = {
    //   id : values.dataModal.id,
    //   id_empresa: idEmpresa,
    //   id_cliente: idEmpresa,
    //   descripcion: valores.descripcion,
    //   titulo: valores.descripcion,
    //   activo: valores.activo,
    //   pictureURL: valores.pictureURL,
    // };

    // try {
    //   const response = await axios.post<ResponseInterface>("/api/tickets/update", {
    //     ...valoresForm,
    //   });

    //   return response.data;
    // } catch (error) {
    //   console.error(error);
    //   throw `Error al actualizar la alerta`;
    // }
  };

  return {
    createItemCatalogo,
    updateItemCatalogo,
  };
};

export const Formulario = ({
  dataModal,
  onSubmit,
  handleCreateItemClose,
}: PropsFormulario) => {

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
    descripcion: dataModal.descripcion,
    titulo: dataModal.titulo,
    pictureURL: dataModal.pictureURL,
    audioFile: dataModal.audioFile,
    },
  });

  const [audioData, setAudioData] = React.useState<{ url: string; id: string } | null>(null);

  const addAudioElement = (blob: Blob) => {
    if (audioData) {
      URL.revokeObjectURL(audioData.url);
    }

    const url = URL.createObjectURL(blob);
    const id = new Date().toISOString(); 

    setAudioData({ url, id });

    generalForm.setValue("audioFile", blob);
  };

  const onSubmit2 = (data: any) => {
    generalForm.handleSubmit(onSubmit);
    generalForm.reset(); 
    setAudioData(null); 
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen " style={{ marginTop: "-10%" }}>
      <div className="w-full max-w-lg px-4 mt-0">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-center sm:text-left">
            Generación de Tickets
          </h1>
        </div>
        <Form {...generalForm}>
          <form onSubmit={onSubmit2}>
            <Card className="mb-0 shadow-" style={{marginBottom: "-25%"}}>
              <CardContent className="grid grid-cols-1 gap-4 p-6">
                <FormInput
                  form={generalForm}
                  name="titulo"
                  label="Título"
                  placeholder=""
                  required
                />

                <FormInput
                  form={generalForm}
                  name="descripcion"
                  label="Descripción"
                  placeholder=""
                  required
                />

                <CropImage
                  form={generalForm}
                  name="pictureURL"
                  setValue={generalForm.setValue}
                />

                <div className="flex items-center justify-between space-x-4">
                  <div>
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

                  {audioData && (
                    <Reproductor key={audioData.id} audioUrl={audioData.url} />
                  )}
                </div>
                
                <FormFooter
                  showButton={false}
                  handleCreateItemClose={handleCreateItemClose}
                  form={generalForm}
                  dataModal={dataModal}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );

};

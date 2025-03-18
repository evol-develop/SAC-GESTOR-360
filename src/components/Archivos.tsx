
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.css'; //ESTE SIRVE PARA EL CARRUSEL DE ARCHIVOS, FOTOS Y AUDIOS
import  Reproductor  from "@/components/Reproductor";
import { Loading } from "@/components/Loading";
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/storeHooks';
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal} from "@/store/slices/page";
import axios from "@/lib/utils/axios";
import { useState } from 'react';
import { ticketInterface } from '@/interfaces/procesos/ticketInterface';
import { toast } from 'sonner';

interface Props{
    movimientoId : number| null,
    ticketId: number,
    clienteId:number,
    comentarioId:number| null,
    showComentario?: boolean
}

const Archivos = ({ movimientoId, ticketId,clienteId,comentarioId, showComentario = true  }: Props) =>{

    const [audioList, setAudioList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string }[]>([]);
    const [imageList, setImageList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string}[]>([]);
    const [archivosList, setArchivosList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; nombreArchivo:string; blob:Blob}[]>([]);
    const [comentario,setComentario]  = useState<string>('');
    const { dispatch } = usePage();
    const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
    const comentarioSlot = useAppSelector((state: RootState) => state.page.slots.COMENTARIO );
    
    const CargarArchivosByComentario = async () => {
        try {
          
          dispatch(setIsLoading(true));
          
          console.log("HOLA")
          const response = await axios.get(
            `/api/tickets/getArchivosByComentario/${ticketId}/${clienteId}`, // Solo los parámetros de ruta van aquí
            {
              params: { // Los parámetros opcionales van en `params`
                id_movimiento: movimientoId || null,
                id_comentario: comentarioId || null
              }
            }
          );
          

          console.log(response.data.result)
    
          if (response.data.isSuccess ) {
    
            dispatch(setIsLoading(false));
            
            const ticket = response.data.result.ticket;
            const archivos = response.data.result.archivos;

            
            const audioExtensions = ["audio"];
            const imageExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "tiff", "webp"];
            const fileExtensions = ["application", "txt"];

            const audioList: any[] = [];
            const imageList: any[] = [];
            const archivosList: any[] = [];

            archivos.forEach((item: any) => {
              const tipo = item.tipoArchivo.toLowerCase();

              switch (true) {
                case audioExtensions.some(ext => tipo.includes(ext)):
                  audioList.push(item);
                  break;
                case imageExtensions.some(ext => tipo.includes(ext)):
                  imageList.push(item);
                  break;
                case fileExtensions.some(ext => tipo.includes(ext)):
                  archivosList.push(item);
                  break;
                default:
                  archivosList.push(item); // Cualquier otro archivo va aquí
              }
            });

            setAudioList(audioList);
            setImageList(imageList);
            setArchivosList(archivosList);

            if(comentarioId === null && movimientoId === null){
              setComentario(ticket.descripcion as string)
            }else{
              setComentario(comentarioSlot)
            }

          }else{
            toast.error("Ocurrió un error el cargar los archivos");
          }
          
        } catch (err) {
          console.error(err);
        }
      };

      
    useEffect(()=>{
        CargarArchivosByComentario()
    },[movimientoId, ticketId,clienteId,comentarioId]);

    return (

    <div className="flex flex-col w-full h-full overflow-y-auto bg-background max-h-1/2 sm:max-h-none">
    <section className="relative h-[calc(100dvh-350px)] sm:h-[calc(100dvh-300px)] flex flex-col sm:flex-row gap-4">
        
       
        <div className="flex flex-col w-full h-full border rounded-sm bg-background sm:w-1/3 max-h-1/2 sm:max-h-none">
            <h1 className="text-xs font-bold text-center">  {showComentario ? (<>COMENTARIO</>):(<>DESCRIPCIÓN DEL PROBLEMA</>)}</h1>
            {comentario}
        </div>
        
        <div className="flex flex-col w-full h-full overflow-y-auto border rounded-sm bg-background max-h-1/2 sm:max-h-none">
        <h1 className="text-xs font-bold text-center">ARCHIVOS ADJUNTOS</h1>
        {!isLoading ? (<>
                
        {audioList.length > 0 && (
        <div>
        <h3 className="text-xs font-bold">{audioList.length} Audio(s)</h3>
        <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
            {audioList.map((audio) => (
            <SwiperSlide key={audio.archivoURL} className="flex items-center justify-between p-2 border rounded-md">
                <Reproductor autoPlay={false} audioUrl={audio.archivoURL} style={{ width: "100%" }} />
                {/* <a
                    href={audio.archivoURL}
                    target="_blank"
                    download={audio.nombreArchivo}
                    className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 rounded-md opacity-0 bg-black/60 group-hover:opacity-100"
                  >
                    Descargar
                  </a> */}
            </SwiperSlide>
            ))}
        </Swiper>
        </div>
        )}

        {archivosList.length > 0 && (
          <div>
            <h3 className="text-xs font-bold">{archivosList.length} Archivo(s)</h3>
            <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
              {archivosList.map((archivo) => (
                <SwiperSlide key={archivo.archivoURL} className="relative p-2 border rounded-md group">
                  <div className="flex flex-col items-center">
                    <FaFileAlt size={30} />
                    <p className="text-xs truncate max-w-[100px]">{archivo.nombreArchivo}</p>
                  </div>
                  {/* Botón de descarga */}
                  <a
                    href={archivo.archivoURL}
                    target="_blank"
                    download={archivo.nombreArchivo}
                    className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 rounded-md opacity-0 bg-black/60 group-hover:opacity-100"
                  >
                    Descargar
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {imageList.length > 0 && (
          <div>
            <h3 className="text-xs font-bold">{imageList.length} Imágen(es)</h3>
            <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
              {imageList.map((croppedImage) => (
                <SwiperSlide key={croppedImage.archivoURL} className="relative p-2 border rounded-md group">
                  <img src={croppedImage.archivoURL} alt="Imagen Adjunta" className="object-contain w-24 rounded-md" />
                  {/* Botón de descarga */}
                  <a
                    href={croppedImage.archivoURL}
                    target="_blank"
                    download
                    className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 rounded-md opacity-0 bg-black/60 group-hover:opacity-100"
                  >
                    Descargar
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* {archivosList.length > 0 && (
            <div>
            <h3 className="text-xs font-bold">{archivosList.length} Archivo(s)</h3>
            <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
                {archivosList.map((archivo) => (
                <SwiperSlide key={archivo.archivoURL} className="relative p-2 border rounded-md">
                    <div className="flex flex-col items-center">
                    <FaFileAlt size={30} />
                    <p className="text-xs truncate max-w-[100px]">{archivo.nombreArchivo}</p>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            </div>
        )}

        {imageList.length > 0 && (
            <div>
            <h3 className="text-xs font-bold">{imageList.length} Imágen(es)</h3>
            <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
                {imageList.map((croppedImage) => (
                <SwiperSlide key={croppedImage.archivoURL} className="relative p-2 border rounded-md">
                    <img src={croppedImage.archivoURL} alt="Imagen Adjunta" className="object-contain w-24 rounded-md" />
                </SwiperSlide>
                ))}
            </Swiper>
            </div>
        )} */}
        
        </>):(<div><Loading/></div>)}

        </div>
    </section> 
  </div>
    )
}

export default Archivos;
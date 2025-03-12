
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

interface Props{
    movimientoId : number,
    ticketId: number,
    clienteId:number,
    comentarioId:number| null,
    showComentario?: boolean
}

const Archivos = ({ movimientoId, ticketId,clienteId,comentarioId, showComentario = true  }: Props) =>{

    const [audioList, setAudioList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string }[]>([]);
    const [imageList, setImageList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string}[]>([]);
    const [archivosList, setArchivosList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; nombreArchivo:string; blob:Blob}[]>([]);
    // const [comentario,setComentario]  = useState<string>('');
    const { dispatch } = usePage();
    const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
    const comentario = useAppSelector((state: RootState) => state.page.slots.COMENTARIO );
    
    const CargarArchivosByComentario = async () => {
        try {
          
          dispatch(setIsLoading(true));
          
          const response = await axios.get(
            `/api/tickets/getArchivosByComentario/${movimientoId}/${ticketId}/${clienteId}?id_comentario=${comentarioId|| ''}`,
            {
              headers: { "Content-Type": "application/text" },
            }
          );
    
          if (response.data.isSuccess && Array.isArray(response.data.result)) {
    
            dispatch(setIsLoading(false));
            
            const archivos = response.data.result;
            // Filtrar los archivos por tipo y llenarlos en sus respectivos hooks
            setAudioList(archivos.filter((item: any) => item.tipoArchivo.toLowerCase().includes("audio")));
            setImageList(archivos.filter((item: any) => ["png", "jpeg","jpg","gif","bmp", "tiff","webp"].some(ext => item.tipoArchivo.toLowerCase().includes(ext))));
            setArchivosList(archivos.filter((item: any) => item.tipoArchivo.toLowerCase().includes("application") 
            ||item.tipoArchivo.toLowerCase().includes("txt")));
          }
          
        } catch (err) {
          console.error(err);
        }
      };

      
    useEffect(()=>{
        CargarArchivosByComentario()
    },[]);

    return (

    <div className="flex flex-col w-full h-full overflow-y-auto bg-background max-h-1/2 sm:max-h-none">
    <section className="relative h-[calc(100dvh-350px)] sm:h-[calc(100dvh-300px)] flex flex-col sm:flex-row gap-4">
        
       
        <div className="flex flex-col w-full h-full border rounded-sm bg-background sm:w-1/3 max-h-1/2 sm:max-h-none">
            <h1 className="font-bold text-center">  {showComentario ? (<>COMENTARIO</>):(<>DESCRIPCIÓN DEL PROBLEMA</>)}</h1>
            {comentario}
        </div>
        
        <div className="flex flex-col w-full h-full overflow-y-auto border rounded-sm bg-background max-h-1/2 sm:max-h-none">
        <h1 className="font-bold text-center">ARCHIVOS ADJUNTOS</h1>
        {!isLoading ? (<>
                
        {audioList.length > 0 && (
        <div>
        <h3 className="text-xs font-bold">{audioList.length} Audio(s)</h3>
        <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
            {audioList.map((audio) => (
            <SwiperSlide key={audio.archivoURL} className="flex items-center justify-between p-2 border rounded-md">
                <Reproductor autoPlay={false} audioUrl={audio.archivoURL} style={{ width: "100%" }} />
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
        )}
        
        </>):(<Loading/>)}

        </div>
    </section> 
  </div>
    )
}

export default Archivos;
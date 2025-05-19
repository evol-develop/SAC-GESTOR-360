
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
import { ModalGenerico } from "@/components/ModalGenerico";
import { appConfig } from "@/appConfig";
import { AuthService } from '@/services/auth.service';
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";

interface Props{
    ticketId: number,
    comentarioId:number,
    showComentario?: boolean
}

const Archivos = ({ ticketId,comentarioId, showComentario = true  }: Props) =>{

    const [audioList, setAudioList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string }[]>([]);
    const [imageList, setImageList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; blob:Blob ; nombreArchivo:string}[]>([]);
    const [archivosList, setArchivosList] = useState<{ archivoURL: string; id: string; tipoArchivo:string; nombreArchivo:string; blob:Blob}[]>([]);
    const [comentario,setComentario]  = useState<string>('');
    const { dispatch } = usePage();
    const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
    const [ticketEliminado, setTicketEliminado] = useState(false);
    
    const CargarArchivosByComentario = async () => {
        try {
          
          dispatch(setIsLoading(true));
          
          const response = await axios.get(
            `/api/tickets/getArchivosByComentario/${ticketId}`,
            {
              params: { 
                id_comentario: comentarioId === 0 ? null: comentarioId
              }
            }
          );
          console.log(response.data)
          if (response.data.isSuccess ) {

            if(response.data.result.ticket.eliminado){
              setTicketEliminado(true);
              dispatch(createSlot({ ticketEliminado: true }));
            }
    
            dispatch(setIsLoading(false));
            
            const ticket = response.data.result.ticket;
            const archivos = response.data.result.archivos;
            const comentario = response.data.result.comentario;

            
            const audioExtensions = ["audio"];
            const imageExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "tiff", "webp","image/jpeg"];
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

            if(comentarioId === 0){
              setComentario(ticket.descripcion as string)
            }else{
              setComentario(comentario)
            }

          }else{
            dispatch(setIsLoading(false));
            toast.error("Ocurrió un error el cargar los archivos");
          }
          
        } catch (err) {
          dispatch(setIsLoading(false));
          console.error(err);
        }
    };
    
    useEffect(() => {
      CargarArchivosByComentario();
    }, []);

    
    const handleImageClick = (url: string) => {
      
      setImagenSeleccionada(url);
      dispatch(createSlot({ openModal: true }));
    };

    const handleDescargarImagen = async (url: string, nombre: string) => {

       const token = AuthService.getAuthToken();
     
      const finalUrl = `${appConfig.URL_API}api/tickets/descargar-imagen?firebaseUrl=${encodeURIComponent(url)}&nombre=${encodeURIComponent(nombre)}`;
    
      try {
        const response = await fetch(finalUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) throw new Error("Fallo al descargar la imagen");
    
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = nombre;
        a.click();
    
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error al descargar imagen:", error);
      }
    };
    
    
  return (<>

    {!ticketEliminado ? (<>
          <div className="flex overflow-y-auto flex-col w-full h-full bg-background max-h-1/2 sm:max-h-none">
          <section className="relative h-[calc(100dvh-350px)] sm:h-[calc(100dvh-300px)] flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full h-full rounded-sm border bg-background sm:w-1/3 max-h-1/2 sm:max-h-none">
                <h1 className="text-xs font-bold text-center">  {showComentario ? (<>Comentario</>):(
                  <>Descripción del problema</>)}</h1>
                <div className='text-xs'>{comentario}</div>
            </div>
            
            <div className="flex overflow-y-auto flex-col p-1 w-full h-full rounded-sm border bg-background max-h-1/2 sm:max-h-none">
            <h1 className="text-xs font-bold text-center">Archivos adjuntos</h1>
            {!isLoading ? (<>
                    
            {audioList.length > 0 && (
            <div>
            <h3 className="text-xs font-bold">{audioList.length} Audio(s)</h3>
            <Swiper navigation modules={[Navigation]} spaceBetween={10} slidesPerView={5}>
                {audioList.map((audio) => (
                <SwiperSlide key={audio.archivoURL} className="flex justify-between items-center p-2 rounded-md border">
                    <Reproductor autoPlay={false} audioUrl={audio.archivoURL} style={{ width: "100%" }} />
                    {/* <a
                        href={audio.archivoURL}
                        target="_blank"
                        download={audio.nombreArchivo}
                        className="flex absolute inset-0 justify-center items-center text-white rounded-md opacity-0 transition-opacity duration-200 bg-black/60 group-hover:opacity-100"
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
                    <SwiperSlide key={archivo.archivoURL} className="relative p-2 rounded-md border group">
                      <div className="flex flex-col items-center">
                        <FaFileAlt size={30} />
                        <p className="text-xs truncate max-w-[100px]">{archivo.nombreArchivo}</p>
                      </div>
                      {/* Botón de descarga */}
                      <a
                        href={archivo.archivoURL}
                        target="_blank"
                        download={archivo.nombreArchivo}
                        className="flex absolute inset-0 justify-center items-center text-white rounded-md opacity-0 transition-opacity duration-200 bg-black/60 group-hover:opacity-100"
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
                  {imageList.map((croppedImage, index) => (
                    <SwiperSlide key={croppedImage.archivoURL} className="relative p-2 rounded-md border group">
                      {/* Imagen clickeable para abrir modal */}
                      <img
                        src={croppedImage.archivoURL}
                        alt={`Imagen ${index + 1}`}
                        className="object-contain w-full h-24 rounded-md cursor-pointer group-hover:opacity-90"
                        onClick={() => handleImageClick(croppedImage.archivoURL)}
                      />
    
                      {/* Botón de descarga visible */}
                      <div className="absolute right-1 bottom-1">
                      <button
                        onClick={() => handleDescargarImagen(croppedImage.archivoURL, `imagen-${index + 1}.jpg`)}
                        className="px-2 py-1 text-sm text-blue-600 bg-white rounded shadow transition hover:bg-blue-600 hover:text-white"
                      >
                        Descargar
                      </button>
    
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
    
    
            </>):(
                  <div className="flex justify-center items-center w-full h-full">
                  <Loading ml="ml-16 lg:ml-60" />
                </div>
            )}
    
            </div>
          </section> 
        </div>
    
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
    </>):(<>
    <TicketEliminado/>
    </>)}


    
    </>)
}

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

export default Archivos;
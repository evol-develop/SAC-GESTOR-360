import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ticketComentariosInterface, ticketInterface, ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal} from "@/store/slices/page";
import { useAppSelector } from "@/hooks/storeHooks";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { usePage } from "@/hooks/usePage";
import { format } from "date-fns";
import { es, is, se } from "date-fns/locale";
import axios from "@/lib/utils/axios";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import '/node_modules/swiper/swiper-bundle.css';
import UserAvatar from "@/components/UserAvatar";
import { Loading } from "@/components/Loading";
import { useEffect } from "react";
import Archivos from "./Archivos";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import SinComentarios from "./sinComentarios";
import { useAuth } from "@/hooks/useAuth";

interface CardData {
  title: string;
  description: string;
  id: number;
  fecha: Date ;
  fechaTermina: Date ;
}

interface InfiniteCardsProps {
  etapas: CardData[];
}

const InfiniteCards = ({ etapas}: InfiniteCardsProps) => {
  //const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const comentariosCliente = useAppSelector((state: RootState) => state.page.slots.COMENTARIOS_CLIENTE as any);
  const comentariosAsignado = useAppSelector((state: RootState) => state.page.slots.COMENTARIOS_ASIGNADO as any);
  const asignado = useAppSelector((state: RootState) => state.page.slots.asignado);
  const { dispatch } = usePage();
  const [comentarioId,setComentarioId]  = useState<number>(0);
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  const selectedIndex = useAppSelector((state: RootState) => state.page.slots.ETAPA);
  const clienteAuth = useAppSelector((state: RootState) => state.page.slots.clienteAuth as any);
  const { authState: { user },logout,} = useAuth();
  
    
  const handleCardClick = (id:number, index: number ) => {

    dispatch(deleteSlot("COMENTARIOS_ASIGNADO"))
    dispatch(deleteSlot("COMENTARIOS_CLIENTE"))
    dispatch(deleteSlot("COMENTARIOS"))
    dispatch(createSlot({ movimientoId: id }));
    dispatch(createSlot({ ETAPA: index }));
    
    
  };
  
  const openComentario = (comentario:ticketComentariosInterface) => {
   
    dispatch(createSlot({ SHOWARCHIVOS: true }));
    setComentarioId(comentario.id);
    dispatch(createSlot({ COMENTARIO: comentario.comentario }));
  };

  const CargarComentariosByMovimiento = async () => {

    dispatch(setIsLoading(true));
    try {
      const response = await axios.get(
        `/api/tickets/getComentariosByMovimiento/${movimientoId}/${ticketId}/${clienteId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      //console.log(response.data);
      
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
      
        dispatch(setIsLoading(false));
        
        const comentarios = response.data.result.map((item:any) => ({
          fecha: item.fechaCrea,
          id: item.id,
          usuarioCrea: item.userId,
          comentario: item.comentario,
          asunto: item.asunto,
          dirigido_a: item.dirigido_a,
        }));
        //console.log(comentarios[0])
        console.log("CAMBIO DE ETAPA");  // Para verificar cuándo cambia

        dispatch(createSlot({ COMENTARIOS_ASIGNADO: comentarios.filter((item: any) => item.dirigido_a === "ASIGNADO") })); 
        dispatch(createSlot({ COMENTARIOS_CLIENTE: comentarios.filter((item: any) => item.dirigido_a === "CLIENTE") })); 
      }
      
    } catch (err) {
      dispatch(setIsLoading(false));
      console.error(err);
    }
  };
  


  useEffect(() => {
   
    if (movimientoId) {
      CargarComentariosByMovimiento();
    }
  }, [movimientoId]);
  

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640); // Ajusta el valor de 640 según el tamaño de tu pantalla
    };

    // Llamar a handleResize inicialmente
    handleResize();

    // Añadir el evento de cambio de tamaño
    window.addEventListener("resize", handleResize);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
    
  function OpenModalComentario(userId : string, dirigido : string){
   
    dispatch(createSlot({"Dirigido": dirigido} ));
    dispatch(createSlot({"Destinatario": userId} ));
    
    dispatch(setIsOpenModal(true));
    dispatch(createSlot({ ModalType: "COMENTARIOS" }));
   
  }

  return (
    <TooltipProvider>
      <div
        className="relative w-full h-[380px]  overflow-x-auto flex flex-wrap sm:flex-nowrap " // Ajusta según la altura de tu header
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {etapas && etapas.map((item, index) => {
          const positionValue = index * 50;
          const topValue = index * 30;
          const widthValue = 120 - index * 5;
  
          return (
            <div
              key={index}
              className="absolute z-10 transition-all duration-500 ease-in-out shadow-md transform-translate-x-8 hover:shadow-lg"
              style={{
                right: "0px",
                left: isSmallScreen ? "0px" : `${positionValue}px`,
                top: isSmallScreen ? `${topValue}px` : "auto",
                width: index === 0 ? "100%" : `${widthValue}%`,
              }}
            >
              {!showArchivos && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`p-3 rounded-t-lg cursor-pointer border rounded-sm ${
                        selectedIndex === index ? "bg-primary" : "bg-white text-black"
                      }`}
                      onClick={() => handleCardClick(item.id, index)}
                    >
                      <div className={`text-xs font-semibold  ${
                        selectedIndex === index ? "text-white" : " text-black"
                      }`}>
                        {item.title}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" forceMount className="translate-x-[-10px] text-center">
                    {item.description}
                    <br />
                    {new Date(item.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })} -
                    {item.fechaTermina.toString() === "0001-01-01T00:00:00+00:00" 
                      ? "Vigente" 
                      : new Date(item.fechaTermina).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );
        })}
  
        {/* Contenedor de comentarios */}
        <div className={`w-full  `}>
          <div className="text-gray-700">
            {!showArchivos ? (
              <section className={`relative flex flex-col h-full gap-4 sm:flex-wrap ${isSmallScreen ? "mt-36" : "mt-11"}`}>
                <div >
                 
                 {/* {comentariosAsignado.lenght === undefined && comentariosCliente.lenght === undefined &&
                 (
                  <SinComentarios/>
                 )} */}

                 <section className="relative h-[calc(100dvh-252px)] sm:h-[calc(75dvh-200px)] flex flex-col sm:flex-row gap-4 ">
                 <div
                  className={`relative flex flex-col h-full border rounded-sm bg-background max-h-1/2 sm:max-h-none ${
                    user?.userRoll !== "Cliente" ? "sm:w-1/2" : "w-full"
                  }`}
                >
                      <div className="text-xs text-center"> {user?.userRoll !== "Cliente" ? (<>Cliente</>):(<>Comentarios</>)}</div>

                      {!isLoading ? (
                        <>{comentariosCliente && comentariosCliente.lenght && (<h1 className="text-xs font-bold text-center">COMENTARIOS</h1>)}
                        <div className="h-[calc(120dvh-350px)] sm:h-[calc(85dvh-300px)] ">

                        {comentariosCliente && comentariosCliente.map((step: ticketComentariosInterface, index: number) => {
                          const fechaValida = new Date(step.fecha);
                          const fechaFormateada = !isNaN(fechaValida.getTime())
                            ? format(fechaValida, "dd/MM/yyyy hh:mm:ss a", { locale: es })
                            : "Fecha inválida";

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 }}
                              onClick={() => openComentario(step)}
                            >
                              <Card className="max-w-full p-2 break-words border-l-4 shadow-md cursor-pointer rounded-xl border-primary">
                                <CardContent className="flex gap-2 items-left">
                                  <Circle className="w-6 h-3 text-gray-500" />
                                  <div className="max-w-full overflow-hidden text-xs break-words">
                                    <h3 className="text-lg font-semibold text-primary">
                                      <UserAvatar
                                        withTooltip
                                        userId={step.usuarioCrea}
                                        className="size-6"
                                        rounded="rounded-full" />
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{fechaFormateada}</p>
                                    <h5 className="break-words">{step.comentario}</h5>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}

                        {comentariosCliente && comentariosCliente.length === 0 && (<SinComentarios/>)}
                        
                      </div></>
                    ) : (
                      <Loading />
                    )}
                    
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                      <Button size="sm" className="text-xs " onClick={(e) => OpenModalComentario( clienteAuth, "CLIENTE")}>
                      {comentariosCliente && comentariosCliente.length === 0 ? (<>Inicar conversación</>):(<>Responder</>)}
                      </Button>
                    </div>
                  
                    </div>
                    
                    {user?.userRoll !== "Cliente" && (
                    <div className="relative flex flex-col w-full h-full overflow-y-auto border rounded-sm bg-background sm:w-1/2 max-h-1/2 sm:max-h-none">
                    <div className="text-xs text-center">Asignado</div>

                    {!isLoading ? (
                      <>{comentariosAsignado && comentariosAsignado.lenght && (<h1 className="text-xs font-bold text-center">COMENTARIOS</h1>)}
                      <div className="h-[calc(120dvh-350px)] sm:h-[calc(85dvh-300px)] overflow-auto">

                      {comentariosAsignado && comentariosAsignado.map((step: ticketComentariosInterface, index: number) => {
                        const fechaValida = new Date(step.fecha);
                        const fechaFormateada = !isNaN(fechaValida.getTime())
                          ? format(fechaValida, "dd/MM/yyyy hh:mm:ss a", { locale: es })
                          : "Fecha inválida";

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            onClick={() => openComentario(step)}
                          >
                            <Card className="max-w-full p-2 break-words border-l-4 shadow-md cursor-pointer rounded-xl border-primary">
                              <CardContent className="flex gap-2 items-left">
                                <Circle className="w-6 h-4 text-gray-500" />
                                <div className="max-w-full overflow-hidden text-xs break-words">
                                  <h3 className="text-lg font-semibold text-primary">
                                    <UserAvatar
                                      withTooltip
                                      userId={step.usuarioCrea}
                                      className="size-6"
                                      rounded="rounded-full" />
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{fechaFormateada}</p>
                                  <h5 className="break-words">{step.comentario}</h5>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}

                      {comentariosAsignado && comentariosAsignado.length === 0 && ( <SinComentarios/>)}
                      
                    </div></>
                  ) : (
                    <Loading />
                  )}
          
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                      <Button size="sm" className="text-xs " onClick={(e) => OpenModalComentario(asignado, "ASIGNADO")}>
                      {comentariosAsignado && comentariosAsignado.length === 0 ? (<>Inicar conversación</>):(<>Responder</>)}
                      </Button>
                    </div>
                    </div>
                    )}
                </section>
                 
                </div>
              </section>



            ) : (
              <>
               
                  <Archivos movimientoId={movimientoId} ticketId={ticketId} clienteId={clienteId} comentarioId={comentarioId} />
              
              </>
            )}
          </div>
        </div>
        
      </div>
    </TooltipProvider>
  );
  
  
};

export default InfiniteCards;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ticketComentariosInterface, ticketInterface, ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal, setModalSize, deleteItemSlot} from "@/store/slices/page";
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
import { CargarArchivosByComentario } from "@/content/procesos/consultaTickets/config";
import { toast } from "sonner";
import ComentarioPanel from "./comentariosPanel";

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
  const { dispatch } = usePage();
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const comentariosCliente = useAppSelector((state: RootState) => state.page.slots.COMENTARIOS_CLIENTE as any);
  const comentariosAsignado = useAppSelector((state: RootState) => state.page.slots.COMENTARIOS_ASIGNADO as any);
  const [comentarioId,setComentarioId]  = useState<number>(0);
  const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  const etapaSeleccionada = useAppSelector((state: RootState) => state.page.slots.etapaSeleccionada);
  const { authState: { user }} = useAuth();
  
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const etapaActual = useAppSelector((state: RootState) => state.page.slots.etapaActual as number);
  const asignado = useAppSelector((state: RootState) => state.page.slots.usuarioAsignado);
  const clienteAuth = useAppSelector((state: RootState) => state.page.slots.clienteAuth as any);
  
  
  const handleEtapaClick = (id:number, index: number ) => {
    dispatch(deleteSlot("COMENTARIOS_ASIGNADO"))
    dispatch(deleteSlot("COMENTARIOS_CLIENTE"))
    dispatch(deleteSlot("COMENTARIOS"))
    dispatch(createSlot({ movimientoId: id }));
    dispatch(createSlot({ etapaSeleccionada: index }));
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
        `/api/tickets/getComentariosByMovimiento/${movimientoId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      
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
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
    
  function OpenModalComentario(clienteAuth : string,asignado : string, dirigido : string){
   
    dispatch(createSlot({"Dirigido": dirigido} ));
    dispatch(createSlot({"clienteAuth": clienteAuth} ));
    dispatch(createSlot({"asignado": asignado} ));
    
    dispatch(setModalSize("2xl"));
    dispatch(setIsOpenModal(true));
    dispatch(createSlot({ ModalType: "COMENTARIOS" }));
    dispatch(createSlot({ tipoOperacion: "CrearComentario" }));
   
  }

  function OpenModalEditarComentario(comentarioId : number,dirigido : string){
   
    CargarArchivosByComentario(0, dispatch,user, comentarioId);
    
    dispatch(setModalSize("2xl"));
    dispatch(setIsOpenModal(true));
    dispatch(createSlot({ ModalType: "COMENTARIOS" }));
    dispatch(createSlot({ tipoOperacion: "EditarComentario" }));
    dispatch(createSlot({"Dirigido": dirigido} ));
  }

  const OpenEliminarComentario = async (comentarioId : number, dirigido_a : string) => {

   try {
    const response = await axios.get(
      `/api/tickets/deleteComentario/${comentarioId}`,
      {
        headers: { "Content-Type": "application/text" },
      }
    );

    if(response.data.isSuccess){

      const comentarios = {
        id: comentarioId,
       
      };

      if(dirigido_a === "ASIGNADO"){
        dispatch(
          deleteItemSlot({ state: "COMENTARIOS_ASIGNADO", data: comentarioId })
        );
      }else{
        dispatch(
          deleteItemSlot({ state: "COMENTARIOS_CLIENTE", data: comentarioId })
        );
      }
    }
    
    toast.success(response.data.result);

  } catch (err) {
    console.error(err);
  }
   

  }

  
  return (
    <>
      <div
      className="flex overflow-x-auto overflow-y-auto relative flex-wrap w-full sm:flex-nowrap sm:overflow-y-hidden"
        style={{
          overflowY: "hidden",
          scrollbarWidth: "none",
          // msOverflowStyle: "none",
          // maxHeight: 'calc(78vh - 200px)',
          // minHeight: 'calc(70vh - 100px)',
        }}
      >
        {etapas && etapas.map((item, index) => {
          const positionValue = index * 50;
          const topValue = index * 30;
          const widthValue = 120 - index * 5;
  
          return (
            <div
              key={index}
              className="absolute z-10 shadow-md transition-all duration-500 ease-in-out transform-translate-x-8 hover:shadow-lg"
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
                        etapaSeleccionada === index ? "bg-primary" : "bg-white text-black"
                      }`}
                      onClick={() => handleEtapaClick(item.id, index)}
                    >
                      <div className={`text-xs font-semibold  ${
                        etapaSeleccionada === index ? "text-white" : " text-black"
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
       
         
          {!showArchivos ? (
     <section
     className="flex flex-col gap-4 w-full sm:flex-row"
     style={{
       marginTop: isSmallScreen ? `${etapas.length * 30 + 10}px` : "2.5rem",
     }}
   >
     


     <div className="w-full sm:w-1/2">
          {user?.id !== asignado && (
            <ComentarioPanel
              titulo={user?.userRoll !== "Cliente" ? "Cliente" : "Soporte"}
              comentarios={comentariosCliente}
              tipo="CLIENTE"
              usuarioActualId={user?.id as string}
              asignadoId={asignado}
              isLoading={isLoading}
              etapaActual={etapaActual}
              etapaSeleccionada={etapaSeleccionada}
              onResponder={() => OpenModalComentario(clienteAuth, asignado, "CLIENTE")}
              onEditar={(id) => OpenModalEditarComentario(parseInt(id), "CLIENTE")}
              onEliminar={(id) => OpenEliminarComentario(parseInt(id), "CLIENTE")}
              openComentario={openComentario}
            />
          )}
          </div>
          
          <div className="w-full sm:w-1/2">
          {user?.userRoll !== "Cliente" && (
            <ComentarioPanel
              titulo={user?.id === asignado ? "Soporte" : "Asignado"}
              comentarios={comentariosAsignado}
              tipo="ASIGNADO"
              usuarioActualId={user?.id as string}
              asignadoId={asignado}
              isLoading={isLoading}
              etapaActual={etapaActual}
              etapaSeleccionada={etapaSeleccionada}
              onResponder={() => OpenModalComentario(clienteAuth, asignado, "ASIGNADO")}
              onEditar={(id) => OpenModalEditarComentario(parseInt(id), "ASIGNADO")}
              onEliminar={(id) => OpenEliminarComentario(parseInt(id), "ASIGNADO")}
              openComentario={openComentario}
            />
          )}
          </div> 
        </section>
        

        ) : (
          <>
              <Archivos ticketId={ticketId} comentarioId={comentarioId} />
          </>
        )}  
        
        
      </div>

   
         
        </>
    
  );
  
  
};

export default InfiniteCards;

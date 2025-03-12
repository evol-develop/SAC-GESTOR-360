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


interface CardData {
  title: string;
  description: string;
}

interface InfiniteCardsProps {
  items: CardData[];
  PAGE_SLOT: string;
}

const InfiniteCards: React.FC<InfiniteCardsProps> = ({ items,PAGE_SLOT }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const comentarios = useAppSelector((state: RootState) => state.page.slots.COMENTARIOS as any);
  const handleCardClick = (index: number) => {
    dispatch(deleteSlot("COMENTARIOS"))
    setSelectedIndex(index === selectedIndex ? null : index); 
    console.log(index)
    dispatch(createSlot({ movimientoId: index }));
    
  };
  const { dispatch } = usePage();
  const [comentarioId,setComentarioId]  = useState<number>(0);
  const ticketId = useAppSelector((state: RootState) => state.page.slots.ticketId as any);
  const clienteId = useAppSelector((state: RootState) => state.page.slots.clienteId as any);
  const movimientoId = useAppSelector((state: RootState) => state.page.slots.movimientoId as any);
  const showArchivos = useAppSelector((state: RootState) => state.page.slots.SHOWARCHIVOS as boolean);
  
  const openComentario = (comentario:ticketComentariosInterface) => {
    setComentarioId(comentario.id);
    dispatch(createSlot({ COMENTARIO: comentario.comentario }));
    dispatch(createSlot({ SHOWARCHIVOS: true }));
  };

  useEffect(()=>{
    var etapas =  items.length;
    if(items && etapas ===1){
      setSelectedIndex(0);
    }else{
      setSelectedIndex(etapas)
    }
  },[]);
  

  const CargarComentariosByMovimiento = async () => {
    try {
      const response = await axios.get(
        `/api/tickets/getComentariosByMovimiento/${movimientoId}/${ticketId}/${clienteId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
     // console.log(response.data);
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
      
        const comentarios = response.data.result.map((item:any) => ({
          fecha: item.fechaCrea,
          id: item.id,
          usuarioCrea: item.usuarioCrea,
          comentario: item.comentario,
          asunto: item.asunto
        }));

        dispatch(createSlot({ COMENTARIOS: comentarios }));
      }
      
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(movimientoId && ticketId){
      CargarComentariosByMovimiento();
    }
  }, [movimientoId,ticketId]);

  console.log(movimientoId)
        
  return (
    <TooltipProvider >
      <div
        className={` ${"relative w-[calc(150dvh-450px)] sm:w-[calc(270dvh-500px)]  h-[400px] overflow-x-auto flex "}`}
        style={{
          scrollbarWidth: "none", 
          msOverflowStyle: "none", 
        }}
      >
        {items.map((item, index) => (

          
          <><Card
            key={index}
            className={`${"absolute  transition-all duration-500 ease-in-out transform-translate-x-8 z-10 shadow-md hover:shadow-lg"}`}
            style={{
              left: `${index * 20}px`,
              width: "100%",
            }}
          >
            {!showArchivos && (

              <><Tooltip>
                <TooltipTrigger asChild>
                  <CardHeader
                    className={selectedIndex === index ? "p-3 bg-cyan-600 rounded-t-lg cursor-pointer" : "p-3 bg-gray-500 rounded-t-lg cursor-pointer"}
                    onClick={() => handleCardClick(index)}
                  >
                    <CardTitle className={selectedIndex === index ? "text-xs font-semibold text-white" : "text-xs font-semibold text-slate-950"}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" forceMount className="translate-x-[-10px]">
                  {item.description}
                </TooltipContent>
              </Tooltip>
                {/* <CardContent></CardContent> */}
              </>

            )}

          </Card>
            </> 
        ))}

        <Card className="w-[calc(150dvh-450px)] sm:w-[calc(270dvh-500px)]">
             
             <CardContent className="p-3 text-gray-700" style={{
               // left: `${index * 20}px`,
             }}>

               {!showArchivos ? (
                 <section className="relative flex flex-col h-full gap-4 sm:flex-row">

                   <div className="flex flex-col w-full h-full max-h-full bg-background sm:max-h-none">
                     <h1 className="font-bold text-center ">COMENTARIOS</h1>
                     {!isLoading ? (<>
                       <div className=" h-[calc(90dvh-350px)] sm:h-[calc(90dvh-300px)] overflow-auto">
                         {comentarios &&
                           comentarios.map((step: ticketComentariosInterface, index: number) => (
                             <motion.div
                               key={index}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: index * 0.2 }}
                               onClick={() => openComentario(step)}

                             >
                               <Card className="p-2 border-l-4 shadow-md cursor-pointer rounded-xl border-primary">
                                 <CardContent className="flex gap-2 items-left">
                                   <Circle className="w-6 h-4 text-gray-500" />
                                   <div className="text-xs">
                                     <h3 className="text-lg font-semibold text-primary">
                                       <UserAvatar
                                         withTooltip
                                         userId={step.usuarioCrea}
                                         className="size-6"
                                         rounded="rounded-full" />
                                     </h3>
                                     <p className="text-sm text-muted-foreground">
                                       {format(new Date(step.fecha), "dd/MMMM/yyyy hh:mm:ss a", {
                                         locale: es,
                                       })}
                                     </p>
                                     <h5>{step.comentario}</h5>
                                   </div>
                                 </CardContent>
                               </Card>
                             </motion.div>
                           ))}
                       </div>


                     </>) : (<Loading />)}
                   </div>

                 </section>) : (<>

                   {movimientoId && ticketId && clienteId && comentarioId && (
                     <Archivos movimientoId={movimientoId} ticketId={ticketId} clienteId={clienteId} comentarioId={comentarioId} />
                   )}

                 </>)}

             </CardContent>
           
         </Card>
      </div>

 
            
    </TooltipProvider>
  )
};

export default InfiniteCards;

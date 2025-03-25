import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import {getActivityTimeline} from "@/api/notificationsApi";
import { appConfig } from "@/appConfig";
import { Large } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { NotificationAndTaskList } from "@/contexts/Notifications";
import { TimelineLayout } from "@/components/timeLine/timeline-layout";
import { timeLineInterface } from "@/interfaces/timeLineInterface";
import { set } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from 'react-router';
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router";
import { LuUndo2 } from "react-icons/lu";
import axios from "@/lib/utils/axios";

const mostrarEtapas = () => {
  const navigate = useNavigate();
  const [ timelineData, setTimelineData ] = useState<timeLineInterface[]>([]);
  const { user } = useAuth();
  const { ticketId } = useParams();

  useEffect(() => {

    const CargarMovimientos = async () => {
      try {
        const response = await axios.get(
          `/api/tickets/getMovimientosByTicket/${ticketId}/${false}`,{headers: { "Content-Type": "application/text" },}
        );

        console.log("response", response.data);
  
        if (response.data.isSuccess && Array.isArray(response.data.result)) {
          
          const movimientos = response.data.result.map((item: any) => {
            const fechaInicio = new Date(item.fechaCrea);
            const fechaFin = item.fechaTermina === "0001-01-01T00:00:00+00:00"
              ? new Date()
              : new Date(item.fechaTermina);
          
            let duracionTexto = "Vigente";
            
            if (fechaFin) {
              const diffMs = fechaFin.getTime() - fechaInicio.getTime(); // Diferencia en milisegundos
          
              const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);
          
              const partesDuracion = [];
              if (dias > 0) partesDuracion.push(`${dias} día${dias > 1 ? "s" : ""}`);
              if (horas > 0) partesDuracion.push(`${horas} hora${horas > 1 ? "s" : ""}`);
              if (minutos > 0) partesDuracion.push(`${minutos} minuto${minutos > 1 ? "s" : ""}`);
          
              duracionTexto = partesDuracion.join(", ");
              
            }
          
            return {
              id: item.id,
              title: item.ticketEstatus ? item.ticketEstatus.nombre : "Asignación de usuario",
              description: item.tipoMovimiento !== "Cambiar etapa"
                ? `<b>Se cambió al usuario:</b> ${item.usuarioAnterior.fullName} <br/> 
                   <b>por el usuario:</b> ${item.usuarioActual.fullName} <br/> 
                   <b>Duración:</b> ${duracionTexto}`
                : `${item.etapaAnterior ? '<b>Etapa anterior:</b> ' + item.etapaAnterior + '<br/>' : ""} 
                   <b>Duración:</b> ${duracionTexto}`,
              time: item.fechaCrea,
            };
          });

          console.log("movimientos", movimientos);
          
          setTimelineData(movimientos);
          
          
          setTimelineData(movimientos);
          
          setTimelineData(movimientos);
        }
  
      } catch (err) {
        console.error(err);
      }
    };

    CargarMovimientos();
    
  }, [ticketId]);
  
  function volver(){
    let url =`/site/procesos/consultaTickets`;
    navigate(url);
  }

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Movimientos del ticket</title>
      </Helmet>
      <section className="relative h-[calc(100dvh-252px)] sm:h-[calc(100dvh-200px)] flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full h-full border rounded-sm bg-background sm:w-1/4 max-h-1/2 sm:max-h-none">

        <div className="flex flex-col items-center justify-between p-4 text-xs sm:flex-row">
          <Button
            size="sm"
            variant="default"
            onClick={() => volver()}
            className="w-full sm:w-1/3"
          >
            <span className="hidden lg:inline-block">Volver</span>
            <LuUndo2 />
          </Button>

          <Large className="p-4 pb-0 sm:ml-4">{`Ticket # ${ticketId}`}</Large>
        </div>

        </div>
        <div className="flex flex-col w-full h-full overflow-y-auto border rounded-sm bg-background max-h-1/2 sm:max-h-none">

        
            {timelineData && timelineData.length >0 && (<TimelineLayout timelineData={timelineData} />)}
         
        </div>
      </section>
    </>
  );
};

export default mostrarEtapas;

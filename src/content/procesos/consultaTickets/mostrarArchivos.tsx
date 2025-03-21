import { useParams } from 'react-router';
import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { useNavigate } from 'react-router';
import { Card,CardContent, CardHeader} from "@/components/ui/card";
import Archivos from '@/components/Archivos';
const MostrarTicket = () => {
  const { clienteId, ticketId,movimientoId, comentarioId } = useParams();
  //console.log(clienteId,ticketId,movimientoId)
  const navigate = useNavigate();

  // const abrirTicket = () => {
  //   let url =`/site/procesos/consultaTickets`;
  //   navigate(url);
  // };
 
  
  return (
  <>
  <Helmet><title>{appConfig.NOMBRE} - Detalles</title></Helmet>


  <Card>
  <CardHeader className="flex flex-row items-center justify-between text-xs">
    <a href='/site/procesos/consultaTickets' 
       className="text-start" 
       style={{ textDecoration: 'underline', color: 'blue' }}>
       Consulta de tickets {'>'}
    </a>

    <h5 className="flex-grow font-bold tracking-tight text-center">
      Ticket {" "} #{ticketId}
    </h5>

    <a href='/site/procesos/consultaTickets' 
       className="text-start" 
       style={{ textDecoration: 'underline', color: 'blue' }}>
       Ver comentarios {'>'}
    </a>

  </CardHeader> 
    <CardContent>

    {movimientoId && ticketId && clienteId && comentarioId  && (
      <Archivos showComentario={false} movimientoId={parseInt(movimientoId)} ticketId={parseInt(ticketId)} clienteId={parseInt(clienteId)} comentarioId={parseInt(comentarioId)} />)}

    </CardContent>  
  </Card>
        
  </>

  );
};

export default MostrarTicket;
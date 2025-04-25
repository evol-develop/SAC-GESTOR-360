import { useParams } from 'react-router';
import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { useNavigate } from 'react-router';
import { Card,CardContent, CardHeader} from "@/components/ui/card";
import Archivos from '@/components/Archivos';
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";

const MostrarArchivos = () => {
  const navigate = useNavigate();
  const {ticketId, comentarioId } = useParams();

  function volver(){
    let url =`/site/procesos/consultaTickets`;
    navigate(url);
  }

  function comentarios(){
    let url =`/site/procesos/consultaTickets/mostrarComentarios/${ticketId}`;
    navigate(url);
  }
  
  return (
  <>
  <Helmet><title>{appConfig.NOMBRE} - Detalles</title></Helmet>


  <Card>
  <CardHeader className="flex flex-row items-center justify-between text-xs">

    <Button
      size="sm"
      variant="default"
      onClick={() =>  volver()}
    >
      <span className="hidden lg:inline-block">Ver tickets</span>
      <LuUndo2 />
    </Button>

    <h5 className="flex-grow font-bold tracking-tight text-center">
      Ticket {" "} #{ticketId}
    </h5>

    <Button
      size="sm"
      variant="default"
      onClick={() =>  comentarios()}
    >
      <span className="hidden lg:inline-block">Ver comentarios</span>
      <LuUndo2 />
    </Button>
    

  </CardHeader> 
    <CardContent>
    { ticketId && comentarioId  && (
      <Archivos showComentario={false}  ticketId={parseInt(ticketId)}  comentarioId={parseInt(comentarioId)} />)}
    </CardContent>  
  </Card>
  </>

  );
};

export default MostrarArchivos;
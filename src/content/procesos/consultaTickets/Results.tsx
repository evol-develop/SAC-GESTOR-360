import { ColumnDef } from "@tanstack/react-table";
import {Acciones,DeleteDialog,ResultsCatalogo,} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT,titulos } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { estatus } from "@/interfaces/procesos/estatus";
import { ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import UserAvatar from "@/components/UserAvatar";
import { getItemEstatusLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";
import { usePage } from "@/hooks/usePage";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal, setModalSize, addItemSlot} from "@/store/slices/page";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/utils/axios";
import {CargarArchivosByComentario} from "./config"
import { Autorizar } from "@/components/Autorizar";
import { toast } from "sonner";
import {deleteItemSlot} from "@/store/slices/page";
import { TiposAutorizacion } from "@/interfaces/autorizar";

export const getEtapaLabel = (etapa: number): string => {return estatus[etapa] || "Desconocido"; };

export const Results = () => {
  const navigate = useNavigate();
  const data =useAppSelector((state: RootState) => state.page.slots.TICKETS) || [];
  const { authState: { user },logout,} = useAuth();
 const { dispatch } = usePage();
  
  const editarTicket = (e: any) => {
    //console.log(e);
    dispatch(createSlot({ tipoOperacion: "EditarTicket" }));
    CargarArchivosByComentario(e, dispatch,user, 0);
  };

  const abrirTicket = (e: any) => {
    let url =`/site/procesos/consultaTickets/mostrarArchivos/${e.ticketId}/${0}`;
    navigate(url);
  };

  const mostrarMovimientos = (e: any) => {
    let url =`/site/procesos/consultaTickets/mostrarEtapas/${e.ticketId}`;
    navigate(url);
  };

  const mostrarComentarios =(e:any)=>{
    let url =`/site/procesos/consultaTickets/mostrarComentarios/${e.ticketId}`;
    navigate(url);
  }

  const handleConfirmDelete = (e: any) => {

    Autorizar(
      () => EliminarTicket(e),
      TiposAutorizacion.EliminarTicket
    );
  };

  const EliminarTicket = async (e: any) => {
    
      try {
      const response = await axios.get(
        `/api/tickets/deleteTicket/${e.ticketId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
  
      if(response.data.isSuccess){
        dispatch(
          deleteItemSlot({ state: "TICKETS", data: e.id })
        );
      }
      
      toast.success(response.data.result);
  
      return response.data.result;
  
    } catch (err) {
      console.error(err);
    }
  }

  const columns: ColumnDef<ticketMovimientoInterface>[] = [
    {
      id: "ticket.id",
      accessorKey: "ticket.id",
      header: "Folio #",
      size: 40,
    },
    {
      id: "cliente.nombre",
      accessorKey: "cliente.nombre",
      header: "Cliente",
      size: 50,
      cell: ({ row }) => {
       
        const { ticket} = row.original;

        return  (
          <UserAvatar
            withTooltip
            userId={ticket.clienteId.toString()}
            className="size-8"
            rounded="rounded-full"
            catalogo="clientes"
            />
        );
      },
    },
    {
      id: "ticket.fechaCrea",
      accessorKey: "ticket.fechaCrea",
      header: "Fecha solicitud",
      size:80,
      cell: ({ row }) =>
        row.original.ticket.fechaCrea
          ? new Date(row.original.ticket.fechaCrea).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      id: "ticket.titulo",
      accessorKey: "ticket.titulo",
      header: "Título",
      size: 100,
    },
    {
      id: "ticketEstatus.nombre",
      accessorKey: "ticketEstatus.nombre",
      header: "Estatus",
      size: 80,
      cell: ({ row }) => {
        const { ticketEstatus } = row.original;
        return ticketEstatus? getItemEstatusLabel(ticketEstatus.nombre) : "";
      },
    },    
    {
      id: "ticket.servicio.descripcion",
      accessorKey: "ticket.servicio.descripcion",
      header: "Servicio",
      size: 400,
    },
    {
      id: "ticket.servicio.departamento.nombre",
      accessorKey: "ticket.servicio.departamento.nombre",
      header: "Departamento",
      size: 100,
      cell: ({ row }) => {
        const { ticket } = row.original;
        return ticket.servicio.departamento? ticket.servicio.departamento.nombre : "";
      },
    },
    // {
    //   id: "ticket.atendido",
    //   accessorKey: "ticket.atendido",
    //   header: "Atendido",
    //   // header: ({ column }) => (
    //   //   <DataTableColumnHeader column={column} title="Atendido" />
    //   // ),
    //   cell: ({ row }) => getItemAtendidoLabel(row.original.ticket.atendido),
    //   size: 80,
    // },
    {
      id: "ticket.user.fullName",
      accessorKey: "ticket.user.fullName",
      header: "Asignado a ",
      cell: ({ row }) => {
       
        const { ticket} = row.original;

        //console.log(ticket);

        if (ticket?.user != null) {
          return (
            <UserAvatar
              withTooltip
              userId={ticket.user.id}
              className="size-8"
              rounded="rounded-full"
            />
          );
        } else {
          return (<>N/A</>);
        }
      },
    },
    { 
      id:"ticket",
      accessorKey: "ticket",
      header: "Registrado por ",
      size: 80,
      cell: ({ row }) => {
        const ticket = row.original;
    
      
        return  (
        <UserAvatar
          withTooltip
          userId={ticket.ticket.usuarioCrea}
          className="size-8"
          rounded="rounded-full" />);

      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
      
        return (
          <Acciones
            item={row.original}
            editButton={user?.userRoll !== "Cliente"}
            handleEditItem={(e) => editarTicket(e)}
            openButton={true}
            handleConfirmOpen={(e) => abrirTicket(e)}
            viewButton={true}
            handleConfirmView={(e) => mostrarComentarios(e)}
            viewEtapas={true}
            handleConfirmEtapas={(e) => mostrarMovimientos(e)}
            deleteButton={user?.userRoll !== "Cliente" && user?.userRoll !== "Desarrollo"}
            handleConfirmDelete={(e) => handleConfirmDelete(e)}
          />
        );
      },
    }
    
  ];
  
  const filteredColumns =
  user?.userRoll !== "Cliente"
    ? columns
    : columns.filter(
        (col) =>
          col.id !== "cliente.nombre" &&
          col.id !== "ticket.servicio.departamento.nombre" &&
          col.id !== "ticket.user.fullName"
      );

      //console.log(data[0]?.ticket?.usuarioCrea);

  return (
    <ResultsCatalogo
      PAGE_SLOT={PAGE_SLOT}
      data={data}
      columns={filteredColumns} // Se usa la lista filtrada
      filtro={user?.userRoll !== "Cliente" ?"cliente.nombre": "ticket.titulo"}
    />
  );
};

import { ColumnDef } from "@tanstack/react-table";
import {Acciones,DeleteDialog,ResultsCatalogo,} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT,titulos } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { estatus } from "@/interfaces/procesos/estatus";
import { ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import UserAvatar from "@/components/UserAvatar";
import { getItemAtendidoLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";
import { usePage } from "@/hooks/usePage";
import {createSlot,deleteSlot, setIsLoading,setIsOpenModal,setDataModal} from "@/store/slices/page";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export const getEtapaLabel = (etapa: number): string => {return estatus[etapa] || "Desconocido"; };

export const Results = () => {
  const navigate = useNavigate();
  const { dispatch } = usePage();
  const data =useAppSelector((state: RootState) => state.page.slots.TICKETS) || [];
  const { authState: { user },logout,} = useAuth();

  const createSlots =(e:any)=>{
    dispatch(createSlot({ ticketId: e.ticketId }));
    dispatch(createSlot({ clienteId: e.clienteId }));
    dispatch(createSlot({ idUserCliente: e.userId }));
    dispatch(createSlot({ userId: e.ticket.userId }));
    dispatch(createSlot({ etapaActual: e.ticketEstatusId }));
  }

  const abrirTicket = (e: any) => {
    let url =`/site/procesos/consultaTickets/mostrarTicket/${e.clienteId}/${e.ticketId}/${0}/${0}`;
    navigate(url);
  };

  const columns: ColumnDef<ticketMovimientoInterface>[] = [
    {
      id: "ticket.id",
      accessorKey: "ticket.id",
      header: "Folio #",
    },
    {
      id: "cliente.nombre",
      accessorKey: "cliente.nombre",
      header: "Cliente",
      cell: ({ row }) => {
       
        const { ticket} = row.original;

        return  (
          <UserAvatar
            withTooltip
            userId={ticket.clienteId.toString()}
            className="size-6"
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
    },
    {
      id: "ticketEstatus.nombre",
      accessorKey: "ticketEstatus.nombre",
      header: "Estatus",
    },    
    {
      id: "ticket.servicio.descripcion",
      accessorKey: "ticket.servicio.descripcion",
      header: "Servicio",
    },
    {
      id: "ticket.servicio.departamento.nombre",
      accessorKey: "ticket.servicio.departamento.nombre",
      header: "Departamento",
    },
    {
      id: "ticket.atendido",
      accessorKey: "ticket.atendido",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Atendido" />
      ),
      cell: ({ row }) => getItemAtendidoLabel(row.original.ticket.atendido),
    },
    {
      id: "ticket.user.fullName",
      accessorKey: "ticket.user.fullName",
      header: "Asignado a ",
      cell: ({ row }) => {
       
        const { ticket} = row.original;

        return  (
          <UserAvatar
            withTooltip
            userId={ticket.user.id}
            className="size-6"
            rounded="rounded-full" />
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
      
        return (
          <Acciones
            item={row.original}
            openButton={true}
            handleConfirmOpen={(e) => abrirTicket(e)}
            viewButton={true}
            handleConfirmView={(e) => createSlots(e)}
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


  return (
    <ResultsCatalogo
      PAGE_SLOT={PAGE_SLOT}
      data={data}
      columns={filteredColumns} // Se usa la lista filtrada
      filtro="cliente.nombre"
    />
  );
};

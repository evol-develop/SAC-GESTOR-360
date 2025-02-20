import { ColumnDef } from "@tanstack/react-table";
import {Acciones,DeleteDialog,ResultsCatalogo,} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { estatus } from "@/interfaces/procesos/estatus";
import { ticketMovimientoInterface } from "@/interfaces/procesos/ticketInterface";
import { usePage } from "@/hooks/usePage";
import {
  addItemSlot,
  createSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
  updateItemSlot,
} from "@/store/slices/page";

export const getEtapaLabel = (etapa: number): string => {
  return estatus[etapa] || "Desconocido"; // Si el número no está en el enum, devuelve "Desconocido"
};
export const Results = () => {
  const data =useAppSelector((state: RootState) => state.page.slots.TICKETS) || [];
  const { dispatch } = usePage(PAGE_SLOT);

  const handleCreateItemOpen = () => {
    dispatch(createSlot({ ModalType: PAGE_SLOT }));
    dispatch(setIsOpenModal(true));
  };
    
  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<ticketMovimientoInterface>[] = [
    {
      id: "cliente.nombre",
      accessorKey: "cliente.nombre",
      header: "Cliente",
      
    },
    {
      id: "ticket.titulo",
      accessorKey: "ticket.titulo",
      header: "Título",
    },
    {
      id: "row.original.etapa",
      accessorKey: "row.original.etapa",
      header: "Estado",
      cell: ({ row }) => getEtapaLabel(row.original.etapa),
    },
    {
      id: "ticket.servicio.descripcion",
      accessorKey: "ticket.servicio.descripcion",
      header: "Departamento",
    },
    {
      id: "atendio",
      accessorKey: "atendio",
      header: "Atendido por ",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <Acciones
          item={row.original}
          editButton={false}
          handleEditItem={handleEditItem}
          viewButton={true}
          handleConfirmView={handleEditItem}
        />
      ),
    },
  ];
  return (
    <>
      <ResultsCatalogo
        PAGE_SLOT={PAGE_SLOT}
        data={data}
        columns={columns}
        filtro="cliente"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

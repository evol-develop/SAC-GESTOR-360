import { ColumnDef } from "@tanstack/react-table";
import {Acciones,DeleteDialog,ResultsCatalogo,} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
//import { eventosInterface } from "@/interfaces/catalogos/clientesEventosInterface";
export const Results = () => {
  const data =useAppSelector((state: RootState) => state.page.slots.EVENTOS) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<any>[] = [
    // {
    //   id: "id",
    //   header: "ID",
    //   accessorKey: "id",
      
    // },
    {
      id: "nombre",
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      id: "Estado",
      header: "Estado",
      cell: ({ row }) => getItemActiveLabel(row.original.activo),
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <Acciones
          item={row.original}
          handleEditItem={handleEditItem}
          handleConfirmDelete={handleConfirmDelete}
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
        filtro="evento"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

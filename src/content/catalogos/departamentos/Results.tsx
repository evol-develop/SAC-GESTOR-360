import { ColumnDef } from "@tanstack/react-table";

import {
  Acciones,
  DeleteDialog,
  ResultsCatalogo,
} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
import { clienteInterface } from "@/interfaces/catalogos/clienteInterface";

export const Results = () => {
  const data =useAppSelector((state: RootState) => state.page.slots.DEPARTAMENTOS) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<clienteInterface>[] = [
    {
      id: "nombre",
      header: "Nombre",
      accessorKey: "nombre",
      
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

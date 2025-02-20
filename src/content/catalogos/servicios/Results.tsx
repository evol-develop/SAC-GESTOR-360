import { ColumnDef } from "@tanstack/react-table";

import {
  Acciones,
  DeleteDialog,
  ResultsCatalogo,
} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import UserAvatar from "@/components/UserAvatar";
import { useAppSelector } from "@/hooks/storeHooks";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { UsersInterface } from "@/interfaces/userInterface";
import { useItemManagement } from "@/hooks/useItemManagement";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
import { serviciosInterface } from "@/interfaces/catalogos/serviciosInterfaces";

export const Results = () => {
  const data =useAppSelector((state: RootState) => state.page.slots.SERVICIOS as serviciosInterface ) || [];
  const unidades =useAppSelector((state: RootState) => state.page.slots.UNIDADES) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<UsersInterface>[] = [
    
    {
      id: "descripcion",
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      id: "precio",
      accessorKey: "precio",
      header: "Precio",
    },
    {
      id: "frecuencia",
      accessorKey: "frecuencia",
      header: "Frecuencia",
      cell: ({ row }) => row.original.frecuencia === "A"? "Anual": row.original.frecuencia==="M"?"Mensual":"Única",
    },
    {
      id: "linea.descripcion",
      accessorKey: "linea.descripcion",
      header: "Línea",
    },
    {
      id: "sublinea.descripcion",
      accessorKey: "sublinea.descripcion",
      header: "Sublínea",
    },
    {
      id: "id_unidad",
      accessorKey: "id_unidad",
      header: "Unidad",
      cell: ({ row }) => unidades.find((u) => u.id === row.original.id_unidad)?.descripcion,
    },
    // {
    //   id: "Estado",
    //   header: "Estado",
    //   cell: ({ row }) => getItemActiveLabel(row.original.activo),
    // },
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
        filtro="servicio"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

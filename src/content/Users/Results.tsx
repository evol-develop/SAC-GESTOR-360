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
import { userResult } from "@/interfaces/responseInterface";
import { useItemManagement } from "@/hooks/useItemManagement";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";
import { Button } from "@/components/ui/button";

export const Results = () => {
  const data =
    useAppSelector((state: RootState) => state.page.slots.USUARIOS) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<userResult>[] = [
    {
      id: "Usuario",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usuario" />
      ),
      accessorKey: "fullName",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar
            dataUsuario={row.original}
            withTooltip
            rounded="rounded-full"
          />
          <span className="text-xs">
            {row.original.nombre} {row.original.apellido}
          </span>
        </div>
      ),
    },
    {
      id: "Correo Electrónico",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Correo Electrónico" />
      ),
      cell: ({ row }) => <span className="text-xs">{row.original.email}</span>,
    },
    {
      id: "Estado",
      accessorKey: "activo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => getItemActiveLabel(row.original.activo),
    },
    {
      id: "Acciones",
      header: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 -ml-3">
            <span>Acciones</span>
          </Button>
        </div>
      ),
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
        filtro="Usuario"
        showSendUsuarioMessage
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

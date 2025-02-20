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

  const columns: ColumnDef<UsersInterface>[] = [
    {
      id: "usuario",
      header: "Usuario",
      accessorKey: "fullName",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar
            dataUsuario={row.original}
            withTooltip
            rounded="rounded-full"
          />
          <span>
            {row.original.nombre} {row.original.apellido}
          </span>
        </div>
      ),
    },
    {
      id: "Correo Electrónico",
      accessorKey: "email",
      header: "Correo Electrónico",
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
        filtro="factura"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

import { ColumnDef } from "@tanstack/react-table";

import {
  Acciones,
  DeleteDialog,
  ResultsCatalogo,
} from "@/config/catalogoGenerico";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import EmpresaAvatar from "@/components/EmpresaAvatar";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";
import { Button } from "@/components/ui/button";

export const Results = () => {
  const data =
    useAppSelector((state: RootState) => state.page.slots.EMPRESAS) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<EmpresaInterface>[] = [
    {
      id: "Empresa",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empresa" />
      ),
      accessorKey: "nombre",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <EmpresaAvatar
            dataEmpresa={row.original}
            withTooltip
            rounded="rounded-full"
          />
          <span className="text-xs">{row.original.nombre}</span>
        </div>
      ),
    },
    {
      id: "Dirección",
      accessorKey: "direccion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dirección" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">{row.original.direccion}</span>
      ),
    },
    {
      id: "Teléfono",
      accessorKey: "telefono",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teléfono" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">{row.original.telefono}</span>
      ),
    },
    {
      id: "Representante",
      accessorKey: "representante",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Representante" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">{row.original.representante}</span>
      ),
    },
    {
      id: "Estado",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => getItemActiveLabel(row.original.isActive),
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
          deleteButton
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
        filtro="Empresa"
        showSendEmpresaMessage
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

export default Results;

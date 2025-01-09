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
      id: "empresa",
      header: "Empresa",
      accessorKey: "nombre",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <EmpresaAvatar
            dataEmpresa={row.original}
            withTooltip
            rounded="rounded-full"
          />
          <span>{row.original.nombre}</span>
        </div>
      ),
    },
    {
      id: "Dirección",
      accessorKey: "direccion",
      header: "Dirección",
    },
    {
      id: "Teléfono",
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      id: "Representante",
      accessorKey: "representante",
      header: "Representante",
    },
    {
      id: "Estado",
      header: "Estado",
      cell: ({ row }) => getItemActiveLabel(row.original.isActive),
    },
    {
      header: "Acciones",
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
        filtro="empresa"
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

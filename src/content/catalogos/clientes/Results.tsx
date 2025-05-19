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
import { createSlot,setModalSize } from "@/store/slices/page";
import { useAppDispatch } from "@/hooks/storeHooks";

export const Results = () => {
  const dispatch = useAppDispatch();
  const data =
    useAppSelector((state: RootState) => state.page.slots.CLIENTES) || [];

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const handleEdit = (item: any) => {
    dispatch(setModalSize("xl"));
    handleEditItem(item);
  };

  const columns: ColumnDef<clienteInterface>[] = [
    {
      id: "nombre",
      header: "Nombre",
      accessorKey: "nombre",
      
    },
    {
      id: "rfc",
      accessorKey: "rfc",
      header: "RFC",
    },
    // {
    //   id: "domicilio",
    //   accessorKey: "domicilio",
    //   header: "Domicilio",
    // },
    // {
    //   id: "colonia",
    //   accessorKey: "colonia",
    //   header: "Colonia",
    // },
    // {
    //   id: "ciudad",
    //   accessorKey: "ciudad",
    //   header: "Ciudad",
    // },
    // {
    //   id: "estado",
    //   accessorKey: "estado",
    //   header: "Estado",
    // },
    {
      id: "telefono",
      accessorKey: "telefono",
      header: "Teléfono",
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
          handleEditItem={handleEdit}
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
        filtro="nombre"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

import { ColumnDef } from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppSelector } from "@/hooks/storeHooks";
import { updateItemSlot } from "@/store/slices/page";
import { ENDPOINTDELETE, PAGE_SLOT } from "./constants";
import { useItemManagement } from "@/hooks/useItemManagement";
import { DeleteDialog, ResultsCatalogo } from "@/config/catalogoGenerico";
import { AutorizacionInterface } from "@/interfaces/entidades/autorizacionesInterface";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";

export const Results = () => {
  const { dispatch } = usePage(PAGE_SLOT);
  const data =
    useAppSelector((state: RootState) => state.page.slots.AUTORIZACIONES) || [];

  const handleChangeEstatus = async (item: AutorizacionInterface) => {
    const response = await axios.post(
      `/api/autorizaciones/actualizaestatus/${item.id}`
    );

    if (response.data.isSuccess) {
      dispatch(
        updateItemSlot({
          state: PAGE_SLOT,
          data: response.data.result as AutorizacionInterface[],
        })
      );
    }
  };

  const { openConfirmDelete, handleDeleteCompleted, closeConfirmDelete } =
    useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<any>[] = [
    {
      id: "Descripción",
      accessorKey: "descripcion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descripción" />
      ),
      cell: ({ row }) => row.getValue("descripcion"),
    },
    {
      id: "Estado",
      accessorKey: "activo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  id="permiso"
                  checked={row.original.activo || false}
                  onCheckedChange={() => handleChangeEstatus(row.original)}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {row.original.activo ? "Denegar" : "Permitir"}
            </TooltipContent>
          </Tooltip>
          <Label htmlFor="permiso">{row.original.activo ? "" : ""}</Label>
        </div>
      ),
    },
  ];

  return (
    <>
      <ResultsCatalogo
        PAGE_SLOT={PAGE_SLOT}
        data={data}
        columns={columns}
        filtro="Descripción"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

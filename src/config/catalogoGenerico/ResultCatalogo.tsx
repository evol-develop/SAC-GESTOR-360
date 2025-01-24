import { ColumnDef } from "@tanstack/react-table";

import { P } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { GridCatalogo } from "./GridCatalogo";
import { Loading } from "@/components/Loading";
import { DeleteDialog } from "./ConfigCatalogo";
import { useCatalogo } from "@/hooks/useCatalogo";

interface Props {
  PAGE_SLOT: string;
  data: any[];
  columns: ColumnDef<any>[];
  /**
   * filtro
   * @type {string}
   * @description el campo que se va a filtrar
   * @example 'nombre'
   */
  filtro: string;
  showSendUsuarioMessage?: boolean;
  showSendEmpresaMessage?: boolean;
}
export const ResultsCatalogo = ({
  PAGE_SLOT,
  data,
  columns,
  filtro,
  showSendUsuarioMessage,
  showSendEmpresaMessage,
}: Props) => {
  const { openConfirmDelete, closeConfirmDelete, handleDeleteCompleted } =
    useCatalogo(PAGE_SLOT, data);

  return (
    <div className="container mx-auto">
      <GridCatalogo
        data={data}
        columns={columns}
        filtro={filtro}
        showSendUsuarioMessage={showSendUsuarioMessage}
        showSendEmpresaMessage={showSendEmpresaMessage}
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </div>
  );
};

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
}
export const ResultsCatalogo = ({
  PAGE_SLOT,
  data,
  columns,
  filtro,
}: Props) => {
  const { openConfirmDelete, closeConfirmDelete, handleDeleteCompleted } =
    useCatalogo(PAGE_SLOT, data);

  return (
    <Card className="container w-full px-4 py-2 mx-auto">
      <Loading />
      {data.length === 0 ? (
        <P>No existen resultados para mostrar</P>
      ) : (
        <GridCatalogo data={data} columns={columns} filtro={filtro} />
      )}
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </Card>
  );
};

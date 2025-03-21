import { LuX } from "react-icons/lu";
import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageUsuario from "./send-notification-usuario";
import MessageEmpresa from "./send-notification-empresa";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  filtro: string;
  table: Table<TData>;
  showSendUsuarioMessage?: boolean;
  showSendEmpresaMessage?: boolean;
}

export function DataTableToolbar<TData>({
  filtro,
  table,
  showSendUsuarioMessage,
  showSendEmpresaMessage,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
      <Input
        placeholder={`Filtrar ${filtro}...`}
        value={(table.getColumn(filtro)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filtro)?.setFilterValue(event.target.value)
        }
        className="h-8 w-full lg:w-[400px] text-sm"
      />
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="w-full h-8 px-2 lg:px-3 sm:w-auto"
        >
          Limpiar filtros
          <LuX />
        </Button>
      )}
      <div className="flex flex-col w-full gap-2 sm:ml-auto sm:flex-row sm:w-auto">
        {showSendUsuarioMessage && <MessageUsuario />}
        {showSendEmpresaMessage && <MessageEmpresa />}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

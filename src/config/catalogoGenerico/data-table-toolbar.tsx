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
  showViewOptions?: boolean;
}

export function DataTableToolbar<TData>({
  filtro,
  table,
  showSendUsuarioMessage,
  showSendEmpresaMessage,
  showViewOptions = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="sm:flex-row flex flex-col flex-1 gap-2 items-center">
      <Input
        placeholder={`Filtrar ${filtro}...`}
        value={(table.getColumn(filtro)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filtro)?.setFilterValue(event.target.value)
        }
        className="h-8 w-full lg:w-[400px] text-sm"
        autoComplete="off"
      />
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="lg:px-3 sm:w-auto px-2 w-full h-8"
        >
          Limpiar filtros
          <LuX />
        </Button>
      )}
      <div className="sm:ml-auto sm:flex-row sm:w-auto flex flex-col gap-2 w-full">
        {showSendUsuarioMessage && <MessageUsuario />}
        {showSendEmpresaMessage && <MessageEmpresa />}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}

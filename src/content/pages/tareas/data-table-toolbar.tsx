import { LuX } from "react-icons/lu";
import { Table } from "@tanstack/react-table";

import CreateTask from "./create-task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { priorities, statuses } from "@/contexts/Notifications/constants";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="sm:flex-row flex flex-col items-center flex-1 gap-2">
      <Input
        placeholder="Filtrar tareas..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="h-8 w-full lg:w-[250px] text-sm"
      />
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Estado"
          options={statuses}
        />
      )}
      {table.getColumn("priority") && (
        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title="Prioridad"
          options={priorities}
        />
      )}
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="lg:px-3 sm:w-auto w-full h-8 px-2"
        >
          Limpiar filtros
          <LuX />
        </Button>
      )}
      <CreateTask />
    </div>
  );
}

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropsResults } from "./ConfigCatalogo";

export const GridCatalogo = ({ data, columns, filtro }: PropsResults) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 flex flex-col py-4 space-y-4">
        <Input
          placeholder={`Filtrar ${filtro}...`}
          value={(table.getColumn(filtro)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filtro)?.setFilterValue(event.target.value)
          }
          className="sm:max-w-sm w-full"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-auto sm:mt-0 w-full mt-2">
              Columnas <LuChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <div className="sm:block hidden">
          <div className="bg-muted px-4 py-3 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div key={header.id} className="text-sm font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              ))
            )}
          </div>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4 px-4 py-3 border-t"
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="flex items-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-4 text-center">Sin resultados.</div>
          )}
        </div>
        <div className="sm:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} className="last:border-b-0 border-b">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="flex justify-between gap-4 p-4">
                    <div className="flex items-center text-sm font-medium">
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext() as any
                      )}
                    </div>
                    <div className="flex items-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-4 text-center">Sin resultados.</div>
          )}
        </div>
      </div>
      <div className="sm:flex-row sm:space-y-0 flex flex-col items-center justify-between py-4 space-y-4">
        <div className="text-muted-foreground sm:text-left sm:w-auto w-full text-sm text-center">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} resultado(s) seleccionado(s)
        </div>
        <div className="sm:justify-end sm:w-auto flex justify-center w-full space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

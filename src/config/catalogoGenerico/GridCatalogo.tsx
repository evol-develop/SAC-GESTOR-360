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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropsResults } from "./ConfigCatalogo";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { Separator } from "@/components/ui/separator";

export const GridCatalogo = ({
  data,
  columns,
  filtro,
  showSendUsuarioMessage,
  showSendEmpresaMessage,
  showViewOptions = true,
}: PropsResults) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    <div className="w-full space-y-2">
      <DataTableToolbar
        filtro={filtro}
        table={table}
        showSendUsuarioMessage={showSendUsuarioMessage}
        showSendEmpresaMessage={showSendEmpresaMessage}
        showViewOptions={showViewOptions}
      />
      <div className="overflow-hidden border rounded-md">
        <div className="hidden sm:block">
          <div className="p-2 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div key={header.id} className="text-sm font-medium">
                  {header.isPlaceholder ? (
                    <span></span>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </div>
              ))
            )}
          </div>
          <Separator />
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 p-2 border-t m-0 odd:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center text-left [&[align=center]]:text-center [&[align=right]]:text-right text-sm"
                  >
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
              <div key={row.id} className="even:bg-muted">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="grid grid-cols-2 p-4">
                    <div className="flex items-center justify-start w-full text-sm font-medium">
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext() as any
                      )}
                    </div>
                    <div className="flex items-center justify-end w-full">
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
      <DataTablePagination table={table} />
    </div>
  );
};

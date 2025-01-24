import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "@/config/catalogoGenerico/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
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
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} />
      <div className="overflow-hidden border rounded-md">
        <div className="sm:block hidden px-4">
          <div className="py-2 grid grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr),minmax(0,1fr),auto] gap-4">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="text-sm text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
                >
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
            <Separator className="col-span-5" />
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) =>
                row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center text-left [&[align=center]]:text-center [&[align=right]]:text-right text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))
              )
            ) : (
              <div className="p-4 text-center">Sin resultados.</div>
            )}
          </div>
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
}

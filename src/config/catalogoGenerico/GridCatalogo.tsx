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
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/storeHooks";
import { Loading } from "@/components/Loading";

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
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
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
//console.log(isLoading)
  return (
    <div className="space-y-2 w-full">
      <DataTableToolbar
        filtro={filtro}
        table={table}
        showSendUsuarioMessage={showSendUsuarioMessage}
        showSendEmpresaMessage={showSendEmpresaMessage}
        showViewOptions={showViewOptions}
      />
      <div className="overflow-hidden rounded-md border">
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
          <div style={{ maxHeight: 'calc(78vh - 200px)' }} className="overflow-y-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 p-2 border-t m-0 odd:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                  key={cell.id}
                  className="flex overflow-hidden items-center text-sm text-left break-words break-all text-ellipsis"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
                
                
                ))}
              </div>
            ))
            ) : (
              //isLoading ? (<Loading />):(<>Sin resultados.</>)
              <Loading />
            )}
          </div>
        </div>
        <div className="sm:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} className="even:bg-muted">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="grid grid-cols-2 p-4">
                    <div className="flex justify-start items-center w-full text-sm font-medium">
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext() as any
                      )}
                    </div>
                    <div className="flex justify-end items-center w-full">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (<>
          <div className="p-4 text-center">
          {isLoading ? (<Loading />):(<>Sin resultados.</>)}
          </div>
          </>)}

         
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

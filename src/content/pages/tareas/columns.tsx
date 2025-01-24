import { ColumnDef } from "@tanstack/react-table";

import { words } from "@/lib/utils/words";
import UserAvatar from "@/components/UserAvatar";
import { type Task } from "@/contexts/Notifications";
import { DataTableRowActions } from "./data-table-row-actions";
import { Labels, Priority, Status } from "@/contexts/Notifications/components";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => (
      <div className="sm:flex-row flex flex-row-reverse items-center gap-2">
        <UserAvatar
          userId={row.original.userId}
          rounded="rounded-full"
          withTooltip
        />
        <div className="flex items-end sm:items-start flex-col gap-2 text-xs max-w-[500px] line-clamp-1">
          <span className="text-nowrap font-medium">
            {row.getValue("title")}
          </span>
          <Labels taskLabels={row.original.label} className="flex-wrap" />
        </div>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <Status taskStatus={row.original.status} className="flex-row-reverse" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridad" />
    ),
    cell: ({ row }) => <Priority taskPriority={row.original.priority} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Límite" />
    ),
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.dueDate &&
          words.dateToUpperCase(
            new Date(row.original.dueDate).toLocaleDateString("es-MX", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          )}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sm:hidden text-xs">Acciones</span>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

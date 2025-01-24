import { toast } from "sonner";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { LuEllipsis } from "react-icons/lu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteItem, updateItem } from "@/api";
import { Button } from "@/components/ui/button";
import { Task, TaskLabel } from "@/contexts/Notifications";
import { labels } from "@/contexts/Notifications/constants";
import EditTask from "./edit-task";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const task = row.original as Task;

  const updateTag = async (id: string, tag: TaskLabel) => {
    const updatedTask = {
      ...task,
      label: task.label.includes(tag)
        ? task.label.filter((t) => t !== tag)
        : [...task.label, tag],
    };

    await updateItem("tasks", id, updatedTask);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem("tasks", id);
      toast.success("Tarea eliminada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la tarea", {
        description:
          error instanceof Error ? error.message : "Vuelve a intentarlo",
      });
    } finally {
      setOpenAlert(false);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <EditTask task={task} />
      <DropdownMenu
        open={openDialog}
        onOpenChange={(value) => !openAlert && setOpenDialog(value)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-2"
          >
            <LuEllipsis />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Etiquetas</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {labels.map((label) => (
                <DropdownMenuCheckboxItem
                  key={label.value}
                  checked={task.label.includes(label.value)}
                  onCheckedChange={() =>
                    updateTag(task.id as string, label.value)
                  }
                >
                  {label.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <AlertDialog
            open={openAlert}
            onOpenChange={(value) => setOpenAlert(value)}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. ¿Estás seguro de que deseas
                  eliminar esta tarea?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task.id as string)}
                  >
                    Eliminar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

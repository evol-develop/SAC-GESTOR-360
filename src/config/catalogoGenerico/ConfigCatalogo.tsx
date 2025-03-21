import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { GrView } from "react-icons/gr";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IoTicketOutline } from "react-icons/io5";

export interface PropsResults {
  data: any[];
  columns: ColumnDef<any>[];
  filtro: string;
  showSendUsuarioMessage?: boolean;
  showSendEmpresaMessage?: boolean;
  showViewOptions?: boolean;
}

type AccionesProps = {
  /**
   * item
   * @type {any}
   * @description Item
   */
  item: any;
  editButton?: boolean;
  /**
   * handleEditItem
   * @type {(item: any) => void}
   * @description Función para editar un item
   * @required
   */
  handleEditItem?: (item: any) => void;

  /**
   * deleteButton
   * @type {boolean}
   * @description Botón de eliminar
   * @default false
   * @optional
   */
  deleteButton?: boolean;

  /**
   * handleConfirmDelete
   * @type {(item: any) => void}
   * @description Función para eliminar un item
   * @optional
   * @default undefined
   * @requires deleteButton
   */
  handleConfirmDelete?: (item: any) => void;
  viewButton?: boolean;
  handleConfirmView?: (item: any) => void;
  openButton?: boolean;
  handleConfirmOpen?: (item: any) => void;
  className?: string;
};

export const Acciones = ({
  item,
  editButton = true,
  handleEditItem,
  deleteButton = false,
  handleConfirmDelete,
  viewButton = false,
  handleConfirmView,
  openButton = false,
  handleConfirmOpen,
}: AccionesProps) => {
  return (
    <div className="flex justify-start items-center space-x-2">
      {editButton && handleEditItem && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => handleEditItem(item)} size="icon">
              <LuPencil />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Editar</TooltipContent>
        </Tooltip>
      )}
      {deleteButton && handleConfirmDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleConfirmDelete(item)}
              variant="destructive"
              size="icon"
            >
              <LuTrash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Eliminar</TooltipContent>
        </Tooltip>
      )}
      {openButton && handleConfirmOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleConfirmOpen(item)}
              variant={"default"}
              size="icon"
            >
              <IoTicketOutline />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Abrir ticket</TooltipContent>
        </Tooltip>
      )}
      {viewButton && handleConfirmView && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleConfirmView(item)}
              variant={"warning"}
              size="icon"
            >
              <GrView />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" colorClass="bg-yellow-500 text-black">
            ver movimientos
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

type DeleteDialogProps = {
  /**
   * openConfirmDelete
   * @type {boolean}
   * @description Estado de apertura del dialogo de confirmación de eliminación
   */
  openConfirmDelete: boolean;

  /**
   * closeConfirmDelete
   * @type {() => void}
   * @description Función para cerrar el dialogo de confirmación de eliminación
   */
  closeConfirmDelete: () => void;

  /**
   * handleDeleteCompleted
   * @type {() => void}
   * @description Función para eliminar un item
   */
  handleDeleteCompleted: () => void;
};

export const DeleteDialog = ({
  openConfirmDelete,
  closeConfirmDelete,
  handleDeleteCompleted,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={openConfirmDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Quieres eliminar el registro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeConfirmDelete}>
            No, cancelar
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDeleteCompleted} variant="destructive">
              Sí, eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { LuPencil, LuTrash2 } from "react-icons/lu";

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

export interface PropsResults {
  data: any[];
  columns: ColumnDef<any>[];
  filtro: string;
  selectedItems?: any[];
  filteredItems?: any[];
  selectedAllItems?: boolean;
  selectedSomeItems?: boolean;
  selectedBulkActions?: boolean;
  page?: number;
  limit?: number;
  query?: string;
  busquedaPor?: string;
  entidad?: string;
  handleSelectAllItem?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectOneItem?: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => void;
  handleConfirmDelete?: (item: any) => void;
  handlePageChange?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  handleLimitChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditCompleted?: (item: any) => void;
  handleEditItem?: (Item: any) => void;
  handleQueryChange?: (event: any) => void;
  EncabezadoGrid?: () => JSX.Element;
  GridResult?: (
    key: any,
    item: any,
    isItemSelected: boolean,
    handleEditItem: () => void,
    handleConfirmDelete: () => void
  ) => JSX.Element;
  CardResult?: (key: any, item: any, isItemSelected: boolean) => JSX.Element;
}

type AccionesProps = {
  /**
   * item
   * @type {any}
   * @description Item
   */
  item: any;

  /**
   * handleEditItem
   * @type {(item: any) => void}
   * @description Función para editar un item
   * @required
   */
  handleEditItem: (item: any) => void;

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
};

export const Acciones = ({
  item,
  handleEditItem,
  deleteButton = false,
  handleConfirmDelete,
}: AccionesProps) => {
  return (
    <div className="flex items-center justify-start space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => handleEditItem(item)} size="icon">
            <LuPencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Editar</TooltipContent>
      </Tooltip>
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

import { useState } from "react";
import { toast } from "sonner";

import axios from "@/lib/utils/axios";
import { usePage } from "./usePage";
import {
  createSlot,
  deleteItemSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
} from "@/store/slices/page";

interface UseItemManagementProps {
  /**
   * Endpoint para eliminar un registro
   * @type {string}
   * @description Seguir el formato del ejemplo
   * @example 'api/ruta/endpoint/'
   */
  deleteEndpoint: string;

  /**
   * Slot de la página
   * @type {string}
   */
  PAGE_SLOT: string;
}

export const useItemManagement = ({
  deleteEndpoint,
  PAGE_SLOT,
}: UseItemManagementProps) => {
  const { dispatch } = usePage(PAGE_SLOT);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>({});

  const handleDeleteCompleted = async () => {
    try {
      const response = await axios.delete(
        `${deleteEndpoint}${itemToDelete.id}`
      );
      const isSuccess = response.data.isSuccess;

      if (isSuccess) {
        dispatch(deleteItemSlot({ state: PAGE_SLOT, data: itemToDelete.id }));
        toast("El registro ha sido eliminado con éxito");
      } else {
        toast(`No se pudo eliminar el registro de ${itemToDelete.id}`);
      }
    } catch (err) {
      console.error(err);
      toast("Ocurrió un error al eliminar el registro");
    }
    setOpenConfirmDelete(false);
  };

  const handleConfirmDelete = (item: any) => {
    setItemToDelete(item);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setItemToDelete({});
    setOpenConfirmDelete(false);
  };

  const handleEditItem = (item: any) => {
    dispatch(setIsEditing(true));
    dispatch(setDataModal(item));
    dispatch(setIsOpenModal(true)); // Open modal
  };

  const handleCloseModal = () => {
    dispatch(createSlot({ isOpenModal: false }));
    dispatch(createSlot({ RolSeleccionado: null }));
    dispatch(createSlot({ ModalType: "Rol" }));
  };

  return {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
    handleCloseModal,
  };
};

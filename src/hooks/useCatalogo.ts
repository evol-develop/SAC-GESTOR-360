import { toast } from "sonner";
import { useState } from "react";

import { usePage } from "./usePage";
import axios from "@/lib/utils/axios";
import { RootState } from "@/store/store";
import { useAppSelector } from "./storeHooks";
import { ResponseInterface } from "@/interfaces/responseInterface";
import {
  deleteItemSlot,
  setDataModal,
  setIsOpenModal,
} from "@/store/slices/page";

export const useCatalogo = (
  pageSlot: string,
  data: any[]
) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ activo: "" });
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeItems =
    selectedItems.length > 0 && selectedItems.length < data.length;
  const selectedAllItems = selectedItems.length === data.length;

  const [toggleView, setToggleView] = useState("table_view");
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>({});

  const { dispatch } = usePage(pageSlot);

  const handleTabsChange = (
    _event: React.SyntheticEvent<Element, Event>,
    tabsValue: string
  ) => {
    let value = "";

    if (tabsValue !== "todos") {
      value = tabsValue;
    }

    setFilters((prevFilters: any) => ({
      ...prevFilters,
      activo: value,
    }));

    setSelectedItems([]);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setQuery(event.target.value!);
  };

  const handleSelectAllItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems(
      event.target.checked ? data.map((item) => item.id) : []
    );
  };

  const handleSelectOneItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (!selectedItems.includes(id)) {
      setSelectedItems((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== id)
      );
    }
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleLimitChange = (event:any) => {
    setLimit(parseInt(event.target.value));
  };

  const handleViewOrientation = (_event:any, newValue:any) => {
    setToggleView(newValue);
  };

  const handleConfirmDelete = (item: any) => {
    setItemToDelete(item);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setItemToDelete({});
    setOpenConfirmDelete(false);
  };

  const endPoint =
    useAppSelector((state: RootState) => state.page.slots.ENDPOINTDELETE) || [];

  const handleDeleteCompleted = async () => {
    console.log("itemToDelete", itemToDelete["id"]);
    try {
      const response = await axios.post<ResponseInterface>(
        `api/${endPoint}/${itemToDelete["id"]}`
      );

      //const response = deleteItem(pageSlot, itemToDelete['id'])

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;

      if (isSuccess) {
        dispatch(deleteItemSlot({ state: pageSlot, data: itemToDelete["id"] }));
        toast("El Registro ha sido eliminado con exito");
      } else {
        toast(message);
      }
    } catch (err) {
      console.error(err);
    }
    setOpenConfirmDelete(false);
  };

  const handleEditItem = (item: any) => {
    dispatch(setIsOpenModal(true)); // open modal
    dispatch(setDataModal(item));
  };

  const handleEditCompleted = async () => {};

  return {
    selectedItems,
    setSelectedItems,
    toast,
    page,
    setPage,
    limit,
    setLimit,
    query,
    setQuery,
    filters,
    setFilters,
    selectedBulkActions,
    selectedSomeItems,
    selectedAllItems,
    toggleView,
    setToggleView,
    openConfirmDelete,
    setOpenConfirmDelete,
    itemToDelete,
    setItemToDelete,
    handleTabsChange,
    handleQueryChange,
    handleSelectAllItem,
    handleSelectOneItem,
    handlePageChange,
    handleLimitChange,
    handleViewOrientation,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted,
    handleEditItem,
    handleEditCompleted,
  };
};

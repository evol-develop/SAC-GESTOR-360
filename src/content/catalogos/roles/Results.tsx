import { ColumnDef } from "@tanstack/react-table";
import { LuKeyRound, LuShield } from "react-icons/lu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Acciones,
  DeleteDialog,
  ResultsCatalogo,
} from "@/config/catalogoGenerico";
import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Autorizar } from "@/components/Autorizar";
import { useAppSelector } from "@/hooks/storeHooks";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import { useItemManagement } from "@/hooks/useItemManagement";
import { createSlot, setIsOpenModal } from "@/store/slices/page";
import { ENDPOINTDELETE, PAGE_SLOT, titulos } from "./constants";
import { AutorizacionesEnum } from "@/components/Autorizar/enums";
import { RolInterface } from "@/interfaces/entidades/rolInterface";
import { getItemActiveLabel } from "@/config/catalogoGenerico/utils";
import { DataTableColumnHeader } from "@/config/catalogoGenerico/data-table-column-header";

export const Results = () => {
  const { dispatch } = usePage();

  const data =
    useAppSelector((state: RootState) => state.page.slots.ROLES) || [];

  const CargaAutorizaciones = async (idRol: number) => {
    try {
      const response = await axios.get(
        `/api/autorizaciones/getautorizacionesbyrol/${idRol}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      dispatch(
        createSlot({
          AutorizacionesByRol: response.data.result,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickautorizaciones = (item: any) => {
    dispatch(createSlot({ ModalType: "Autorizaciones" }));
    titulos.tituloModal = `Administrar autorizaciones del rol "${item.nombre}"`;
    titulos.descripcionModal = `Asignar autorizaciones al rol "${item.nombre}"`;
    dispatch(createSlot({ RolSeleccionado: item }));
    CargaAutorizaciones(item.id);
    dispatch(setIsOpenModal(true));
  };

  const CargaMenus = async (idRol: number) => {
    try {
      const response = await axios.get(
        `/api/roles/getmenubyrol/${idRol}/MENU`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      dispatch(createSlot({ MENUS: response.data.result }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickPermisos = (item: any) => {
    dispatch(createSlot({ ModalType: "PERMISOS" }));
    titulos.tituloModal = `Administrar permisos del rol "${item.nombre}"`;
    titulos.descripcionModal = `Asignar permisos al rol "${item.nombre}"`;
    dispatch(createSlot({ RolSeleccionado: item }));
    CargaMenus(item.id);
    dispatch(setIsOpenModal(true));
  };

  const handleClickEditar = (item: any) => {
    dispatch(createSlot({ ModalType: PAGE_SLOT }));
    titulos.tituloModal = "";
    titulos.descripcionModal = "";
    dispatch(createSlot({ RolSeleccionado: item }));
    handleEditItem(item);
  };

  const {
    openConfirmDelete,
    handleDeleteCompleted,
    handleConfirmDelete,
    closeConfirmDelete,
    handleEditItem,
  } = useItemManagement({ deleteEndpoint: ENDPOINTDELETE, PAGE_SLOT });

  const columns: ColumnDef<RolInterface>[] = [
    {
      id: "Nombre",
      accessorKey: "nombre",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => <span className="text-xs">{row.original.nombre}</span>,
    },
    {
      id: "Estado",
      accessorKey: "activo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => getItemActiveLabel(row.original.activo),
    },
    {
      id: "Permisos",
      header: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 -ml-3">
            <span>Permisos</span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => {
                Autorizar(
                  () => handleClickPermisos(row.original),
                  TiposAutorizacion.ModificarPermisos
                );
              }}
            >
              <LuKeyRound />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Permisos</TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "Autorizaciones",
      header: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 -ml-3">
            <span>Autorizaciones</span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => {
                Autorizar(
                  () => handleClickautorizaciones(row.original),
                  TiposAutorizacion.ModificarAutorizaciones
                );
              }}
            >
              <LuShield />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Autorizaciones</TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "Acciones",
      header: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 -ml-3">
            <span>Acciones</span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Acciones
          item={row.original}
          handleEditItem={() => {
            Autorizar(
              () => handleClickEditar(row.original),
              AutorizacionesEnum.EditarRol
            );
          }}
          deleteButton
          handleConfirmDelete={handleConfirmDelete}
        />
      ),
    },
  ];

  return (
    <>
      <ResultsCatalogo
        PAGE_SLOT={PAGE_SLOT}
        data={data}
        columns={columns}
        filtro="rol"
      />
      <DeleteDialog
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

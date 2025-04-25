import { toast } from "sonner";
import { LuPlus } from "react-icons/lu";
import { SubmitHandler } from "react-hook-form";

import {
  addItemSlot,
  createSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
  updateItemSlot,
} from "@/store/slices/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/storeHooks";
import { ResponseInterface } from "@/interfaces/responseInterface";

interface Props {
  PAGE_SLOT: string;
  createItemCatalogo: (
    values: any,
    idEmpresa: number
  ) => Promise<ResponseInterface>;
  UpdateItemCatalogo: (
    values: any,
    idEmpresa: number
  ) => Promise<ResponseInterface>;
  titulos: {
    titulo: string;
    descripcion: string;
    nombreItem: string;
    tituloModal?: string;
    descripcionModal?: string;
  };
  Formulario: ({
    dataModal,
    onSubmit,
    handleCreateItemClose,
    ...props
  }: {
    dataModal: any;
    onSubmit: SubmitHandler<any>;
    handleCreateItemClose: () => void;
  }) => JSX.Element;
  showCreateButton?: boolean;
  handleClose?:()=>void;
  showEncabezado?:boolean;
  handleOpen?:()=>void;
}

export const CatalogoHeader = ({
  PAGE_SLOT,
  createItemCatalogo,
  UpdateItemCatalogo,
  titulos,
  Formulario,
  showCreateButton = true,
  handleClose,
  showEncabezado=true,
  handleOpen,
}: Props) => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(PAGE_SLOT);
  const open = useAppSelector((state: RootState) => state.page.isOpenModal);
  const globalState = useAppSelector((state: RootState) => state.page.slots);
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const modalSize = useAppSelector((state: RootState) =>(state.page.modalSize as keyof typeof modalSizeClasses) || "lg"
  );

  const modalSizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-full",
  };

  const modalSizeClass = modalSizeClasses[modalSize] || "max-w-4xl";

  const handleCreateItemOpen = () => {
    dispatch(createSlot({ ModalType: PAGE_SLOT }));
    dispatch(setIsOpenModal(true));
    handleOpen?.();
  };

  const handleCreateItemClose = () => {
    dispatch(setIsEditing(false));
    dispatch(setDataModal({}));
    dispatch(setIsOpenModal(false));
   // dispatch(setModalSize("lg"));
   handleClose?.();
  };

  const onSubmit: SubmitHandler<any> = async (values) => {
    let itemResponse: ResponseInterface | undefined = undefined;
    try {
      if (dataModal.id === undefined) {
        itemResponse = (await createItemCatalogo(
          { values, globalState },
          idEmpresa as number
        )) as ResponseInterface;
        if (itemResponse.isSuccess) {
          dispatch(
            addItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      } else {
        itemResponse = (await UpdateItemCatalogo(
          { values, dataModal, globalState },
          idEmpresa as number
        )) as ResponseInterface;
        if (itemResponse.isSuccess) {
          dispatch(
            updateItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      }

      handleCreateItemSuccess(itemResponse.isSuccess, itemResponse.message);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) handleCreateItemSuccess(false, err.message);
    }
  };

  const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
    if (isSuccess) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    dispatch(setIsOpenModal(false));
    dispatch(setDataModal({}));
    //dispatch(setModalSize("lg"));
  };

  return (
    <div className="container flex flex-col items-center justify-between mx-auto mb-4 sm:flex-row">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{titulos.titulo}</h2>
        <p className="text-muted-foreground">{titulos.descripcion}</p>
      </div>
      <div>
        <Dialog
          open={open}
          onOpenChange={(open) => !open && handleCreateItemClose()}
        >
          <DialogTrigger asChild>
            {showCreateButton && (
              <Button
                onClick={handleCreateItemOpen}
                size="sm"
                type="button"
                className="mt-4 sm:mt-0"
              >
                <LuPlus />
                {"Crear " + titulos.nombreItem}
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className={` ${modalSizeClass}`}>
            <DialogHeader>
              {showEncabezado && (
              <><DialogTitle>
                  {titulos.tituloModal === undefined ||
                    titulos.tituloModal === ""
                    ? dataModal.id === undefined
                      ? "Agregar " + titulos.nombreItem
                      : "Editar " + titulos.nombreItem
                    : titulos.tituloModal}
                </DialogTitle><DialogDescription>
                    {titulos.descripcionModal === undefined ||
                      titulos.descripcionModal === ""
                      ? dataModal.id === undefined
                        ? `Llena los campos para crear ${titulos.nombreItem}.`
                        : `Llena los campos para editar ${titulos.nombreItem}.`
                      : titulos.descripcionModal}
                  </DialogDescription></>)}
            </DialogHeader>

            <Formulario
              dataModal={dataModal}
              onSubmit={onSubmit}
              handleCreateItemClose={handleCreateItemClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

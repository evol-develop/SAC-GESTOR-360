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
import { H3, P } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/storeHooks";
import { ResponseInterface } from "@/interfaces/responseInterface";

interface Props {
  PAGE_SLOT: string;
  createItemCatalogo: (
    values: any,
    idEmpresa: string | number
  ) => Promise<ResponseInterface>;
  UpdateItemCatalogo: (
    values: any,
    idEmpresa: string | number
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
    onSubmit: any;
    handleCreateItemClose: any;
  }) => JSX.Element;
  showCreateButton?: boolean;
}

export const CatalogoHeader = ({
  PAGE_SLOT,
  createItemCatalogo,
  UpdateItemCatalogo,
  titulos,
  Formulario,
  showCreateButton = true,
}: Props) => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(PAGE_SLOT);
  const open = useAppSelector((state: RootState) => state.page.isOpenModal);
  const globalState = useAppSelector((state: RootState) => state.page.slots);
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);

  const handleCreateItemOpen = () => {
    dispatch(createSlot({ ModalType: PAGE_SLOT }));
    dispatch(setIsOpenModal(true));
  };

  const handleCreateItemClose = () => {
    dispatch(setIsEditing(false));
    dispatch(setDataModal({}));
    dispatch(setIsOpenModal(false));
    dispatch(setModalSize("lg"));
  };

  const onSubmit: SubmitHandler<any> = async (values) => {
    let itemResponse: ResponseInterface | undefined = undefined;
    try {
      if (dataModal.id === undefined) {
        itemResponse = (await createItemCatalogo(
          { values, globalState },
          idEmpresa
        )) as ResponseInterface;

        if (itemResponse.isSuccess) {
          dispatch(
            addItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      } else {
        itemResponse = (await UpdateItemCatalogo(
          { values, dataModal, globalState },
          idEmpresa
        )) as ResponseInterface;
        if (itemResponse.isSuccess) {
          dispatch(
            updateItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      }

      const message = itemResponse.message;
      const isSuccess = itemResponse.isSuccess;
      handleCreateItemSuccess(isSuccess, message);
    } catch (err: any) {
      console.error(err);
      handleCreateItemSuccess(false, err.message);
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
    dispatch(setModalSize("lg"));
  };

  return (
    <div className="sm:flex-row container flex flex-col items-center justify-between mx-auto mb-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{titulos.titulo}</h2>
        <p className="text-muted-foreground">{titulos.descripcion}</p>
      </div>
      <div>
        {showCreateButton && (
          <Dialog
            open={open}
            onOpenChange={(open) => !open && handleCreateItemClose()}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleCreateItemOpen}
                size="sm"
                type="button"
                className="sm:mt-0 mt-4"
              >
                <LuPlus />
                {"Crear " + titulos.nombreItem}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[70vw] min-h-[50vh]">
              <DialogHeader>
                <DialogTitle>
                  {titulos.tituloModal === undefined ||
                  titulos.tituloModal === ""
                    ? dataModal.id === undefined
                      ? "Agregar nueva/o " + titulos.nombreItem
                      : "Editar " + titulos.nombreItem
                    : titulos.tituloModal}
                </DialogTitle>
                <DialogDescription>
                  {titulos.descripcionModal === undefined ||
                  titulos.descripcionModal === ""
                    ? dataModal.id === undefined
                      ? `Llena los campos para crear una nueva/o ${titulos.nombreItem}.`
                      : `Llena los campos para editar la/el ${titulos.nombreItem}.`
                    : titulos.descripcionModal}
                </DialogDescription>
              </DialogHeader>

              <Formulario
                dataModal={dataModal}
                onSubmit={onSubmit}
                handleCreateItemClose={handleCreateItemClose}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

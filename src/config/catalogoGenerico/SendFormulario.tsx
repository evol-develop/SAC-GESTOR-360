import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { updateItemSlot,addItemSlot} from "@/store/slices/page";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
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

export const SendFormulario = ({
  PAGE_SLOT,
  createItemCatalogo,
  UpdateItemCatalogo,
  Formulario,
  handleClose,
  handleOpen,
}: Props) => {
  const { idEmpresa } = useAuth();
  const { dispatch } = usePage(PAGE_SLOT);
  const globalState = useAppSelector((state: RootState) => state.page.slots);
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  


  const handleCreateItemClose = () => {

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
    
  };

  return (

      <Formulario
        dataModal={dataModal}
        onSubmit={onSubmit}
        handleCreateItemClose={handleCreateItemClose}
      />
          
  );
};

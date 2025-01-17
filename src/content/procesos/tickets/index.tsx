import { Helmet } from "react-helmet-async";
import { appConfig } from "@/appConfig";
import { Formulario ,OperacionesFormulario} from "./config";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { SubmitHandler } from "react-hook-form";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { PAGE_SLOT } from "./constants";
import { toast } from "sonner";
import { usePage } from "@/hooks/usePage";
import {
  createSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
} from "@/store/slices/page";
import { useAuth } from "@/hooks/useAuth";

const ManagementClientes = () => {

   const { dispatch } = usePage(PAGE_SLOT);
const { idEmpresa } = useAuth();

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

    const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
    const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
    const globalState = useAppSelector((state: RootState) => state.page.slots);

    const onSubmit: SubmitHandler<any> = async (values) => {
      let itemResponse: ResponseInterface | undefined = undefined;
      try {
          itemResponse = (await createItemCatalogo(
            { values, globalState },
            idEmpresa
          )) as ResponseInterface;
  
  
        const message = itemResponse.message;
        const isSuccess = itemResponse.isSuccess;
        handleCreateItemSuccess(isSuccess, message);
      } catch (err: any) {
        console.error(err);
        handleCreateItemSuccess(false, err.message);
      }
    };


  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Tickets</title>
      </Helmet>
      
        <Formulario
          dataModal={dataModal}
          onSubmit={onSubmit}
          handleCreateItemClose={null}
        />
          
    </>
  );
};

export default ManagementClientes;

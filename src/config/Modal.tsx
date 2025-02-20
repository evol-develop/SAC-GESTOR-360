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
import { titulos } from "@/content/Users/constants";

interface Props {
  PAGE_SLOT: string;
  titulo: string;
  Content:() => JSX.Element;
}

export const Modal = ({
  PAGE_SLOT,
  titulo,
  Content, 
}: Props) => {

  const { dispatch } = usePage(PAGE_SLOT);
  const open = useAppSelector((state: RootState) => state.page.isOpenModal);


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

  

//   const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
//     if (isSuccess) {
//       toast.success(message);
//     } else {
//       toast.error(message);
//     }
//     dispatch(setIsOpenModal(false));
//     dispatch(setDataModal({}));
//     dispatch(setModalSize("lg"));
//   };

  return (
    
          <Dialog
            open={open}
            onOpenChange={(open) => !open && handleCreateItemClose()}
          >
            <DialogTrigger asChild>
              
            </DialogTrigger>
            <DialogContent className="w-full max-w-[70vw] min-h-[50vh] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  {titulo}
                </DialogTitle>
                <DialogDescription>
                  
                </DialogDescription>

                <Content/>
              </DialogHeader>

              
            </DialogContent>
          </Dialog>
        
  );
};

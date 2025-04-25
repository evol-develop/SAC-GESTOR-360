import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { usePage } from "@/hooks/usePage";
import {deleteSlot} from "@/store/slices/page";

interface Props {
  titulo: string;
  Content: () => JSX.Element | null;
  handleClose?:()=>void;
}

export const ModalGenerico = ({  titulo, Content, handleClose }: Props) => {
    const { dispatch } = usePage();
    const open = useAppSelector((state: RootState) => state.page.slots.openModal as boolean);

    const handleCreateItemClose = () => {
      dispatch(deleteSlot("openModal"));
      if (handleClose) handleClose();
    };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleCreateItemClose();
      }}
    >
      <DialogContent className=" min-h-[50vh] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

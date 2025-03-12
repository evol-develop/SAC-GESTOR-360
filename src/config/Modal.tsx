import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { usePage } from "@/hooks/usePage";
import {
  addItemSlot,
  createSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
  updateItemSlot,
} from "@/store/slices/page";

interface Props {
  titulo: string;
  Content: () => JSX.Element | null;
}

export const Modal = ({  titulo, Content }: Props) => {
    const { dispatch } = usePage();
    const open = useAppSelector((state: RootState) => state.page.isOpenModal);
    const globalState = useAppSelector((state: RootState) => state.page.slots);
    const dataModal = useAppSelector((state: RootState) => state.page.dataModal);


    const handleCreateItemClose = () => {
      dispatch(setIsEditing(false));
      dispatch(setDataModal({}));
      dispatch(setIsOpenModal(false));
      dispatch(setModalSize("lg"));
    };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleCreateItemClose();
      }}
    >
      <DialogContent className="w-full max-w-[70vw] min-h-[50vh] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};



// import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
// import { usePage } from "@/hooks/usePage";
// import { RootState } from "@/store/store";
// import { useAppSelector } from "@/hooks/storeHooks";
// import {createSlot, deleteSlot} from "@/store/slices/page";
// interface Props {PAGE_SLOT: string;titulo: string;Content:() => JSX.Element, open:boolean, close:()=>void()}
// export const Modal = ({PAGE_SLOT,titulo,Content, open= false,close=()=>void()}: Props) => {

//    const { dispatch } = usePage(PAGE_SLOT);
//   // const newComentario = useAppSelector((state: RootState) => state.page.slots.NEWCOMENTARIO);
//   // const showTicket = useAppSelector((state: RootState) => state.page.slots.SHOWTICKET);

//   // const handleCreateItemClose = () => {
//   //   dispatch(deleteSlot("NEWCOMENTARIO"))
//   //   dispatch(deleteSlot("SHOWTICKET"))
//   // };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(open) => {
//         if (!open) close(); // Solo se ejecuta cuando se cierra
//       }}>
//       <DialogTrigger asChild>
//       </DialogTrigger>
//       <DialogContent className="w-full max-w-[70vw] min-h-[50vh] max-h-[90vh] overflow-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {titulo}
//           </DialogTitle>
//           <DialogDescription>
//           </DialogDescription>
//           <Content/>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };
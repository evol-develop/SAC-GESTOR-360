import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalConfirmacionProps {
  open: boolean;
  titulo: string;
  mensaje: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  disableOutsideClick?: boolean;
  disableEscapeKey?: boolean;
}

export const ModalConfirmacion = ({
  open,
  titulo,
  mensaje,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  disableOutsideClick = true,
  disableEscapeKey = false,
}: ModalConfirmacionProps) => {
  const handleChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Solo cerrar si se permite
      if (!disableOutsideClick && !disableEscapeKey) {
        onCancel();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (disableEscapeKey) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (disableOutsideClick) e.preventDefault();
        }}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <p>{mensaje}</p>
        <DialogFooter className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} type="button">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Loader2 } from "lucide-react";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { RootState } from "@/store/store";
import { Dialog } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/storeHooks";

interface LoadingProps {
  ml?: string;
}

export const Loading = ({ ml }: LoadingProps) => {
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);

  return (
    isLoading && (
      <Dialog open={isLoading}>
        <DialogContent aria-describedby="loading-description">
          <DialogTitle className="sr-only">Cargando</DialogTitle>
          {/* Agregar un ID correcto para aria-describedby */}
          <p id="loading-description" className="text-sm text-gray-500">
            {/* Espere un momento mientras se carga la información. */}
          </p>
          <div
            className={`absolute top-[40%] left-1/2 -translate-y-1/2 -translate-x-1/2 w-[230px] p-4 z-50 border-none shadow-none outline-none ${ml}`}
          >
            <div className="pl-4 outline-none">
              <Loader2 className="text-gray-600 animate-spin" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};


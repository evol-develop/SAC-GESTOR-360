import { Loader2 } from "lucide-react";
import { DialogContent } from "@radix-ui/react-dialog";

import { RootState } from "@/store/store";
import { Dialog } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/storeHooks";

export const Loading = () => {
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);

  return (
    isLoading && (
      <Dialog open={isLoading}>
        <DialogContent>
          <div className="absolute top-[40%] left-1/2 -translate-y-1/2 -translate-x-1/2 w-[230px] p-4 z-50 border-none shadow-none outline-none">
            <div className="pl-4 outline-none">
              <Loader2 className="animate-spin" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

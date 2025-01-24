import { LuBell, LuMenu, LuX } from "react-icons/lu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CountNotificationsAndTasks,
  NotificationAndTaskList,
} from "@/contexts/Notifications";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { H6, Small } from "@/components/typography";
import { useAppSelector } from "@/hooks/storeHooks";
import { useSidebar } from "@/components/ui/sidebar";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import HeaderUserbox from "./Userbox";

export function CustomTrigger({
  className,
  open,
}: {
  className: string;
  open: boolean;
}) {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          className={className}
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
        >
          {open ? <LuX /> : <LuMenu />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {open ? "Cerrar" : "Abrir"} Menú
      </TooltipContent>
    </Tooltip>
  );
}

export function NotificationsButton({ className }: { className: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className={className}
          variant="outline"
          size="icon"
        >
          <LuBell />
          <CountNotificationsAndTasks x="left" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-transparent"
        alignOffset={4}
        side="bottom"
        align="center"
      >
        <NotificationAndTaskList className="w-full h-[50dvh]" />
      </PopoverContent>
    </Popover>
  );
}

const Header = ({ open }: { open: boolean }) => {
  const dataEmpresa = useAppSelector(
    (state: RootState) => state.empresa
  ) as unknown as EmpresaInterface;

  return (
    <div className="bg-primary-foreground relative z-10 flex items-center justify-end w-full h-24 px-4 py-4 shadow-md">
      <CustomTrigger
        className="absolute left-0 z-10 rounded-l-none shadow-md"
        open={open}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center w-full px-2 text-center">
        <H6>{dataEmpresa.nombre}</H6>
        <Small>{dataEmpresa.direccion}</Small>
        <Small>{dataEmpresa.telefono}</Small>
      </div>
      <div className="right-4 absolute z-10 flex items-center gap-2">
        <NotificationsButton className="relative shadow-md" />
        <HeaderUserbox />
      </div>
    </div>
  );
};

export default Header;

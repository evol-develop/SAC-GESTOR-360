import { LuMenu, LuX } from "react-icons/lu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { H6, Small } from "@/components/typography";
import { useAppSelector } from "@/hooks/storeHooks";
import { useSidebar } from "@/components/ui/sidebar";
import { EmpresaInterface } from "@/interfaces/empresaInterface";

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
        <Button className={className} onClick={toggleSidebar} variant="outline">
          {open ? <LuX /> : <LuMenu />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {open ? "Cerrar" : "Abrir"} Menú
      </TooltipContent>
    </Tooltip>
  );
}

const Header = ({ open }: { open: boolean }) => {
  const dataEmpresa = useAppSelector(
    (state: RootState) => state.empresa
  ) as unknown as EmpresaInterface;

  return (
    <div className="bg-primary-foreground relative z-10 flex items-center justify-end w-full h-24 px-4 py-4 shadow-md">
      <CustomTrigger
        className="absolute left-0 z-10 rounded-l-none"
        open={open}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center w-full px-2 text-center">
        <H6>{dataEmpresa.nombre}</H6>
        <Small>{dataEmpresa.direccion}</Small>
        <Small>{dataEmpresa.telefono}</Small>
      </div>
    </div>
  );
};

export default Header;

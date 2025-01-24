import { LuChevronsUpDown, LuLogOut, LuMoon, LuSun } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { useTheme } from "@/components/theme-provider";

const HeaderUserbox = () => {
  const { setTheme } = useTheme();
  const {
    authState: { user },
    logout,
  } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="secondary"
          className="relative z-10 px-1 shadow-md"
        >
          <UserAvatar rounded="rounded-sm" />
          <div className="md:grid flex-1 hidden text-sm leading-tight text-left">
            <span className="font-semibold truncate">{user?.fullName}</span>
            <span className="text-xs truncate">{user?.email}</span>
          </div>
          <LuChevronsUpDown className="size-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side="bottom"
        align="center"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar />
            <div className="grid flex-1 text-sm leading-tight text-left">
              <span className="font-semibold truncate">{user?.fullName}</span>
              <span className="text-xs truncate">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="dark:scale-0 flex items-center gap-2 transition-all scale-100">
                <LuSun className="dark:-rotate-90 rotate-0" />
                Tema claro
              </span>
              <span className="dark:scale-100 absolute flex items-center gap-2 transition-all scale-0">
                <LuMoon className="dark:rotate-0 rotate-90" />
                Tema oscuro
              </span>
              <span className="sr-only">Cambiar tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={8}>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Oscuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="destructive"
            onClick={logout}
            className="w-full"
            type="button"
          >
            <LuLogOut />
            Cerrar Sesión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserbox;

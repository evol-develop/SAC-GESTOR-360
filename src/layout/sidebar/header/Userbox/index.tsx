import { ChevronDown, LogOut } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Muted, P } from "@/components/typography";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeaderUserbox = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="z-10 h-auto px-4 py-2">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.nombre} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.nombre.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="md:block hidden">
            <div className="pl-2 text-left">
              <P>{user?.nombre}</P>
              <Muted>{user?.role}</Muted>
            </div>
          </div>
          <ChevronDown className="sm:block hidden" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="min-w-52 flex items-center gap-2 px-2 pb-2">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.nombre} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.nombre.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="pl-2 text-left">
            <P>{user?.nombre}</P>
            <Muted>{user?.email} </Muted>
            <Muted>{user?.role} </Muted>
          </div>
        </div>
        {/* <hr /> */}
        <nav className="flex flex-col py-2">
          {/* <Button
            asChild
            variant="outline"
            className="border-x-0 w-full rounded-none"
          >
            <NavLink to="/site/configuracion/usuarios/perfil">
              <User />
              <span>Perfil</span>
            </NavLink>
          </Button> */}
          <ModeToggle className="border-x-0 w-full rounded-none" />
        </nav>
        {/* <hr /> */}
        <div className="mt-2">
          <Button variant="destructive" onClick={logout} className="w-full">
            <LogOut />
            Cerrar Sesión
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderUserbox;

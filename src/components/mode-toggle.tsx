import { Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <span className="dark:scale-0 flex items-center gap-1 transition-all scale-100">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 dark:-rotate-90" />
            Tema claro
          </span>
          <span className="dark:scale-100 absolute flex items-center gap-1 transition-all scale-0">
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 dark:rotate-0" />
            Tema oscuro
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

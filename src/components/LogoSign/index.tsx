import { Link } from "react-router";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { appConfig } from "@/appConfig";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/"
          className={cn(
            "text-primary-foreground size-24 flex mx-auto mb-2 font-bold",
            className
          )}
        >
          <img
            className="object-contain w-full"
            alt="logo-evolsoft"
            src="/logo/evolsoft.png"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-primary-foreground font-bold text-center">
          {appConfig.NOMBRE}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default Logo;

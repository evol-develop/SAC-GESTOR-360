import { Link } from "react-router";

import {
  Sidebar,
  // SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { appConfig } from "@/appConfig";
import SidebarMenuContent from "@/layout/sidebar/SidebarMenu";
// import { NavUser } from "@/layout/sidebar/SidebarMenu/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Link to="/" className="flex items-center gap-2">
                <div className="aspect-square size-8 flex items-center justify-center rounded-lg">
                  <img
                    className="size-full object-contain"
                    alt="logo-evolsoft"
                    src="/logo/evolsoft.png"
                  />
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">
                    {appConfig.DESCRIPCION}
                  </span>
                  <span className="text-xs truncate">v{appConfig.VERSION}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarMenuContent />
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

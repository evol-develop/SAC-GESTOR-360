import { LuChevronRight } from "react-icons/lu";
import { useLocation, Link } from "react-router";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MenuItem } from "./menuItems";

const RecursiveMenuItem = ({
  item,
  subMenu = false,
}: {
  item: MenuItem;
  subMenu?: boolean;
}) => {
  const location = useLocation();

  if (!item.link && item.items !== undefined && item.items.length === 0) {
    return null;
  }

  if (item.link && !subMenu) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={location.pathname === item.link}
          tooltip={item.name}
        >
          <Link to={item.link}>
            {item.Icon && <item.Icon />}
            <span>{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  } else if (item.link && subMenu) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          asChild
          isActive={location.pathname === item.link}
        >
          <Link to={item.link}>
            {item.Icon && <item.Icon />}
            <span>{item.name}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  if (item.items) {
    return (
      <SidebarMenu>
        <Collapsible
          defaultOpen={item.items.some(
            (subItem) => location.pathname === subItem.link
          )}
          asChild
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.name}>
                {item.Icon && <item.Icon />}
                <span>{item.name}</span>
                <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem, subIndex) => (
                  <RecursiveMenuItem
                    key={`${subItem.name || subItem.id} - ${subIndex}`}
                    item={subItem}
                    subMenu
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    );
  }

  return null;
};

export default RecursiveMenuItem;

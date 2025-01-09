import React, { useEffect, useState } from "react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/store/store";
import { buildMenu } from "@/lib/utils/buildMenu";
import RecursiveMenuItem from "./RecursiveMenuItem";
import { useAppSelector } from "@/hooks/storeHooks";
import menuItems, { type MenuItem } from "./menuItems";

const SidebarMenuContent: React.FC = () => {
  const { authState } = useAuth();
  const permisos = useAppSelector(
    (state: RootState) => state.permisos.slots.PERMISOS
  );

  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (authState?.isAuthenticated && permisos) {
      const filteredMenu = buildMenu(menuItems, permisos);
      setFilteredMenuItems(filteredMenu);
    }
  }, [authState, permisos]);

  return (
    <SidebarContent className="list-none">
      {filteredMenuItems.length > 0 &&
        filteredMenuItems.map((section, index) => (
          <SidebarGroup key={`${section.heading || section.id} - ${index}`}>
            {section.heading && (
              <SidebarGroupLabel>{section.heading}</SidebarGroupLabel>
            )}
            {section.items &&
              section.items?.map((item, indexItem) => (
                <RecursiveMenuItem
                  key={`${item.name || item.id} - ${indexItem}`}
                  item={item}
                />
              ))}
          </SidebarGroup>
        ))}
    </SidebarContent>
  );
};

export default SidebarMenuContent;

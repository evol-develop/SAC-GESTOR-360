import {
  LuBuilding2,
  LuFolder,
  LuFolderCog,
  LuHouse,
  LuShieldCheck,
  LuUserCog,
  LuUsers,
} from "react-icons/lu";
import type { IconType } from "react-icons";

import { MenuEnums } from "./MenuEnums";

export type MenuItem = {
  id?: number;
  heading?: string;
  link?: string;
  Icon?: IconType;
  badge?: string;
  items?: MenuItem[];
  name?: string;
  show?: boolean;
};

export type MenuItems = {
  items: MenuItem[];
  heading: string;
};

const menuItems: MenuItems[] = [
  {
    heading: "Sistema",
    items: [
      {
        id: MenuEnums.Inicio,
        Icon: LuHouse,
      },
    ],
  },
  {
    heading: "Configuración",
    items: [
      {
        name: "Catálogos",
        Icon: LuFolder,
        items: [],
      },
      {
        name: "Administración",
        Icon: LuFolderCog,
        items: [
          {
            id: MenuEnums.Autrizaciones,
            Icon: LuShieldCheck,
          },
          {
            id: MenuEnums.Empresas,
            Icon: LuBuilding2,
          },
          {
            id: MenuEnums.Roles,
            Icon: LuUserCog,
          },
          {
            id: MenuEnums.Usuarios,
            Icon: LuUsers,
          },
        ],
      },
    ],
  },
  // {
  //   heading: "Reportes",
  //   items: [
  //     {
  //       id: MenuEnums.Reportes,
  //       Icon: LuClipboard,
  //     },
  //   ],
  // },
];

export default menuItems;

import { ChevronsUpDown } from "lucide-react";
import { useController, Control } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { ResponseInterface, userResult } from "@/interfaces/responseInterface";

type dataProps = {
  label: string;
  value: string;
};

type MultiSelectWithAllProps = {
  control: Control<any>;
  name: string;
  tipo: TipoSelect;
};

type TipoSelect = "users";

export const MultiSelectWithAll = ({
  control,
  name,
  tipo,
}: MultiSelectWithAllProps) => {
  const {
    field: { value = [], onChange },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  const [items, setItems] = useState<dataProps[]>([]);

  useEffect(() => {
    const getItems = async () => {
      switch (tipo) {
        case "users":
          try {
            const response = await axios.get<ResponseInterface>(
              "/api/user/getusers"
            );
            const data: dataProps[] = (response.data.result as userResult[])
              .filter((item) => item.activo)
              .map((item) => ({
                label: `${item.fullName}`,
                value: `${item.id}`,
              }));

            setItems(data);
          } catch (err) {
            console.error(err);
          }
          break;
      }
    };
    getItems();
  }, [tipo]);

  const handleSelect = useCallback(
    (itemValue: string) => {
      if (itemValue === "all") {
        onChange(["all"]);
      } else {
        onChange(
          value.includes("all")
            ? [itemValue]
            : value.includes(itemValue)
            ? value.filter((v: string) => v !== itemValue)
            : [...value, itemValue]
        );
      }
    },
    [value, onChange]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="sm:text-sm justify-between w-full text-xs"
        >
          {value.length > 0
            ? value[0] === "all"
              ? "Todos seleccionados"
              : `${value.length} seleccionados`
            : "Seleccionar"}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:text-sm w-[200px] text-xs">
        <DropdownMenuCheckboxItem
          checked={value.includes("all")}
          onCheckedChange={() => handleSelect("all")}
        >
          Todos
        </DropdownMenuCheckboxItem>
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={value.includes(item.value)}
            onCheckedChange={() => handleSelect(item.value)}
            className="flex items-center justify-between"
          >
            <UserAvatar
              withTooltip
              userId={item.value}
              className="size-6"
              rounded="rounded-full"
            />
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type MultiselectFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  tipo: TipoSelect;
};

export const MultiselectField = ({
  control,
  name,
  label,
  tipo,
}: MultiselectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelectWithAll control={control} name={name} tipo={tipo} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

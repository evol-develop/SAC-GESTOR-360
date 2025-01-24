import { UseFormReturn } from "react-hook-form";
import { LuChevronsUpDown, LuLoaderCircle } from "react-icons/lu";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import axios from "@/lib/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EvolRolInterface } from "@/interfaces/userInterface";
import { ResponseInterface, userResult } from "@/interfaces/responseInterface";

type Props = {
  tipo: string;
  label: string;
  name: string;
  form: UseFormReturn<any, any, undefined>;
  placeholder?: string;
};

type dataProps = {
  label: string;
  value: string;
};

export const ComboboxForm = ({
  tipo,
  label,
  name,
  form,
  placeholder = "Selecciona una opción...",
}: Props) => {
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const getData = async () => {
      switch (tipo) {
        case "ROLESUSUARIO":
          try {
            const data: dataProps[] = [
              { label: "ADMINISTRADOR", value: "Administrador" },
              { label: "USUARIO", value: "Usuario" },
              // { label: 'SUPER-ADMINISTRADOR', value: 'SuperAdmin' },
            ];

            setData(data);
          } catch (err) {
            console.error(err);
          }

          break;
        case "USUARIOS":
          try {
            setLoading(true);
            const response = await axios.get<ResponseInterface>(
              "/api/user/getusers"
            );
            const data: dataProps[] = (response.data.result as userResult[])
              .filter((item) => item.activo)
              .map((item) => ({
                label: `${item.fullName} (${item.email})`,
                value: `${item.id}`,
              }));

            setData(data);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "ROL":
          try {
            const response = await axios.get<ResponseInterface>(
              `/api/roles/getroles`
            );

            const data: dataProps[] = (
              response.data.result as EvolRolInterface[]
            ).map((item) => ({
              label: `${item.nombre}`,
              value: `${item.id.toString()}`,
            }));
            setData(data);
          } catch (err) {
            console.error(err);
          }

          break;
        case "ReporteEmpresa":
          try {
            const response = await axios.get<ResponseInterface>(
              `/api/documentos/getreportesempresas`
            );
            const data: dataProps[] = (response.data.result as any[]).map(
              (item) => ({
                label: `${item.descripcion}`,
                value: `${item.id.toString()}`,
              })
            );
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          }
          break;
      }
    };
    getData();
  }, [tipo]);

  const filteredOptions = useMemo(() => {
    return data.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleSelect = (selectedValue: string) => {
    form.setValue(name, selectedValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="relative w-full">
            <FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(!open)}
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value
                  ? data.find(
                      (option) =>
                        option.value === field.value ||
                        option.label === field.value
                    )?.label
                  : placeholder}
                {!loading ? (
                  <LuChevronsUpDown className="shrink-0 w-4 h-4 ml-2 opacity-50" />
                ) : (
                  <LuLoaderCircle className="shrink-0 animate-spin w-4 h-4 ml-2" />
                )}
              </Button>
            </FormControl>
            {open && (
              <div className="bg-primary-foreground absolute z-50 w-full mt-1 border rounded shadow-md">
                <Input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                />
                <ul ref={listRef} className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className={cn(
                        "cursor-pointer px-2 py-1 hover:bg-primary/25",
                        field.value === option.value && "bg-primary/50"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

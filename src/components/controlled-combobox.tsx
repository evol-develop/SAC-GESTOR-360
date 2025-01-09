import { LuChevronsUpDown } from "react-icons/lu";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { cn } from "@/lib/utils";
import axios from "@/lib/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EvolRolInterface } from "@/interfaces/userInterface";
import { ResponseInterface, userResult } from "@/interfaces/responseInterface";

type Props = {
  tipo: string;
  value: string;
  setValue: (value: string) => void;
  label?: string;
  placeholder?: string;
};

type dataProps = {
  label: string;
  value: string;
};

export const ComboboxControlado = ({
  tipo,
  value,
  setValue,
  label = "",
  placeholder = "Selecciona una opción...",
}: Props) => {
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const getData = useCallback(async () => {
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
  }, [tipo]);

  useEffect(() => {
    getData();
  }, [getData]);

  const filteredOptions = useMemo(() => {
    return data.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue === value ? "" : selectedValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col w-full">
      {label !== "" && (
        <label className="mb-1 text-sm font-medium">{label}</label>
      )}
      <div className="relative w-full">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? data.find(
                (option) => option.value === value || option.label === value
              )?.label
            : placeholder}
          <LuChevronsUpDown className="shrink-0 w-4 h-4 ml-2 opacity-50" />
        </Button>
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
                    value === option.value && "bg-primary/50"
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
    </div>
  );
};

import { UseFormReturn } from "react-hook-form";
import { LuChevronsUpDown, LuLoaderCircle } from "react-icons/lu";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { priorities } from "@/contexts/Notifications/constants";
import {
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import axios, { axiosIns2 } from "@/lib/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EvolRolInterface } from "@/interfaces/userInterface";
import { ResponseInterface, userResult } from "@/interfaces/responseInterface";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import { alertasInterface } from "@/interfaces/catalogos/alertasInterface";
import { appConfig } from "@/appConfig";
import axiosIns from "@/lib/utils/axios";

type Props = {
 tipo:
   | "ROLESUSUARIO"
   | "USUARIOS"
   | "ROL"
   | "ReporteEmpresa"
   | "PRIORIDAD"
   | "EMPRESAS"
   | "FRECUENCIAS"
   | "ANIO"
   | "MES"
   | "CLIENTES"
   | "ALERTAS"
   | "TIPOS_CLIENTES"
   | "SERVICIOS"
   | "CFDI"
   | "METODOSPAGO"
   | "FormasPago"
   | "REGIMEN"
   | "DEPARTAMENTOS"
   | "EVENTOS"
   | "ASUNTOS"
 label: string;
 name: string;
 form: UseFormReturn<any, any, undefined>;
 placeholder?: string;
 disabled?: boolean; 
 onSelect?: (value: string | number) => void;
 isDraggingFile?: boolean;

};

type dataProps = {
 label: string;
 value: string| number;
 disabled?: boolean;
 isDraggingFile?: boolean;
};

export const ComboboxForm = ({
 tipo,
 label,
 name,
 form,
 placeholder = "Selecciona una opción...",
 disabled = false,
 onSelect,
 isDraggingFile= false
}: Props) => {
 const [data, setData] = useState<
   {
     disabled?: boolean;
     label: string;
     value: string | number;
   }[]
 >([]);
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

            setData(data.map(item => ({
              label: item.label,
              value: item.value.toString(),
              disabled: item.disabled
            })));
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

            setData(data.map(item => ({
              label: item.label,
              value: item.value.toString(),
              disabled: item.disabled
            })));
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
              label: item.nombre,
              value: item.id.toString(),
              disabled: item.nombre === "Cliente", // Deshabilitar la opción "Cliente"
            }));
            setData(data.map(item => ({
              label: item.label,
              value: item.value.toString(),
              disabled: item.disabled
            })) );
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
              setData(data.map(item => ({
                label: item.label,
                value: item.value.toString(),
                disabled: item.disabled
              })));
            }
          } catch (err) {
            console.error(err);
          }
          break;
        case "PRIORIDAD":
          try {
            setLoading(true);
            const data: dataProps[] = priorities.map((item) => ({
              label: `${item.label}`,
              value: `${item.value}`,
            }));

            setData(data.map(item => ({
              label: item.label,
              value: item.value.toString(),
              disabled: item.disabled
            })));
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "EMPRESAS":
          try {
            setLoading(true);
            const response = await axios.get<ResponseInterface>(
              `/api/empresas/GetAllEmpresas`
            );
            const data: dataProps[] = (
              response.data.result as EmpresaInterface[]
            ).map((item) => ({
              label: `${item.nombre}`,
              value: `${item.id}`,
            }));
            if (response.data.result.length > 0) {
              setData(data.map(item => ({
                label: item.label,
                value: item.value.toString(),
                disabled: item.disabled
              })));
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "FRECUENCIAS":
          
         const frecuencias: { label: string; value: string }[] = [
          {
            label: "MENSUAL",
            value: "MENSUAL",
          },
          {
            label: "ÚNICA",
            value: "ÚNICA",
          },
          {
            label: "ANUAL",
            value: "ANUAL",
          },
         ];

         setData(frecuencias);
         break;
        case "MES":
          const meses: { label: string; value: number }[] = [
            { label: "Enero", value: 1 },
            { label: "Febrero", value: 2 },
            { label: "Marzo", value: 3 },
            { label: "Abril", value: 4 },
            { label: "Mayo", value: 5 },
            { label: "Junio", value: 6 },
            { label: "Julio", value: 7 },
            { label: "Agosto", value: 8 },
            { label: "Septiembre", value: 9 },
            { label: "Octubre", value: 10 },
            { label: "Noviembre", value: 11 },
            { label: "Diciembre", value: 12 },
          ];
          
        setData(meses);
        break;
        case "ANIO":
          const currentYear = new Date().getFullYear();
          const years: { label: string; value: string }[] = [];

        for (let year = 2014; year <= currentYear; year++) {
          years.push({
            label: year.toString(),
            value: year.toString(),
          });
        }

        setData(years);
        break;
        case "CLIENTES":
         try {
           setLoading(true);
           const response = await axios.get<ResponseInterface>(
             `/api/clientes/getclientes`
           );
           const data: dataProps[] = (
             response.data.result as EmpresaInterface[]
           ).map((item) => ({
             label: `${item.nombre}`,
             value: `${item.id}`,
           }));
           if (response.data.result.length > 0) {
             setData(data);
           }
         } catch (err) {
           console.error(err);
         } finally {
           setLoading(false);
         }
         break;
        case "ALERTAS":
          try {
            setLoading(true);
            const response = await axios.get<ResponseInterface>(
              `/api/alertas/getAlertas`
            );

            console.log(response.data.result)
            const data: dataProps[] = (
              response.data.result as alertasInterface[]
            ).map((item) => ({
              label: `${item.descripcion}`,
              value: `${item.id}`,
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "REGIMEN":
          try {
            setLoading(true);
            const response = await axiosIns2.get<ResponseInterface>(
              `/api/getCatalogoSAT?code=${appConfig.TOKEN}&Catalogo=RegimenFiscal`
            );
            const data: dataProps[] = (
              response.data.result as { id: number; descripcion: string; clave: string }[]
            ).map((item) => ({
              label: `${item.clave}- ${item.descripcion}`,
              value: item.id,
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "CFDI":
          try {
            setLoading(true);
            const response = await axiosIns2.get<ResponseInterface>(
              `/api/getCatalogoSAT?code=${appConfig.TOKEN}&Catalogo=UsoCFDI`
            );
            const data: dataProps[] = (
              response.data.result as { id: number; descripcion: string; clave: string }[]
            ).map((item) => ({
              label: `${item.clave}- ${item.descripcion}`,
              value: item.id,
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "SERVICIOS":
          try {
            setLoading(true);
            const response = await axios.get<ResponseInterface>(
              `/api/servicios/getServicios`
            );
            const data: dataProps[] = (
              response.data.result as { id: number; descripcion: string; clave: string }[]
            ).map((item) => ({
              label: item.descripcion,
              value: item.id.toString(),
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;        
        case "TIPOS_CLIENTES":
          try {
            setLoading(true);
            const response = await axios.get<ResponseInterface>(
              `/api/tipos/getTipos`
            );
            const data: dataProps[] = (
              response.data.result as { id: number; descripcion: string; clave: string }[]
            ).map((item) => ({
              label: item.descripcion,
              value: item.id,
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "FormasPago":
          try {
            setLoading(true);
            const response = await axiosIns2.get<ResponseInterface>(
              `/api/getCatalogoSAT?code=${appConfig.TOKEN}&Catalogo=FormasPago`
            );
            const data: dataProps[] = (
              response.data.result as { id: number; descripcion: string; clave: string }[]
            ).map((item) => ({
              label: `${item.clave}- ${item.descripcion}`,
              value: item.id,
            }));
            if (response.data.result.length > 0) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          break;
        case "METODOSPAGO":
            try {
              setLoading(true);
              const response = await axiosIns2.get<ResponseInterface>(
                `/api/getCatalogoSAT?code=${appConfig.TOKEN}&Catalogo=MetodoPago`
              );
              const data: dataProps[] = (
                response.data.result as { id: number; descripcion: string; clave: string }[]
              ).map((item) => ({
                label: `${item.clave}- ${item.descripcion}`,
                value: item.id,
              }));
              if (response.data.result.length > 0) {
                setData(data);
              }
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
        break;
        case "ASUNTOS":
          try {
            const data: dataProps[] = [
              { label: "MANTENIMIENTO WEB", value: "MANTENIMIENTO WEB" },
              { label: "MANTENIMIENTO ESCRITORIO", value: "MANTENIMIENTO ESCRITORIO" },
              { label: "PÓLIZA DE MANTENIMIENTO", value: "PÓLIZA DE MANTENIMIENTO" },
              { label: "MEJORA DE SERVICIOS", value: "MEJORA DE SERVICIOS" },
              { label: "MEJORA/MANTENIMIENTO", value: "MEJORA/MANTENIMIENTO" },
              { label: "IMPLEMENTACIÓN/INSTALACIÓN", value: "IMPLEMENTACIÓN/INSTALACIÓN" },
              { label: "ACTUALIZAR SAC", value: "ACTUALIZAR SAC" },
              { label: "ACTUALIZAR DRIVERS", value: "ACTUALIZAR DRIVERS" },
              { label: "MEJORA SISTEMA", value: "MEJORA SISTEMA" },
              { label: "INSTALACIÓN IMPRESORAS", value: "INSTALACIÓN IMPRESORAS" },
              
            ];

            setData(data.map(item => ({
              label: item.label,
              value: item.value.toString(),
            })));
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

 const handleSelect = (selectedValue: any) => {
   form.setValue(name, selectedValue);
   setOpen(false);
   setSearch("");

   onSelect?.(selectedValue);
 };

 return (
   <FormField
     control={form.control}
     name={name}
     render={({ field }) => (<>

       <FormItem>
         <FormLabel >{label}</FormLabel>
         <div className="relative w-full">
           <FormControl>
             <Button
               type="button"
               variant="outline"
               onClick={() => setOpen(!open)}
               className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground",
                isDraggingFile && "bg-gray-300 bg-opacity-30 " // <- estilos cuando se está arrastrando
              )}
               disabled={disabled}
             >
              <span className="truncate block max-w-[calc(100%-2rem)]">
                 {field.value
                   ? data.find(
                       (option) =>
                         option.value.toString() === field.value.toString() ||
                         option.label === field.value
                     )?.label
                   : placeholder}
               </span>
               {!loading ? (
                 <LuChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
               ) : (
                 <LuLoaderCircle className="ml-2 w-4 h-4 animate-spin shrink-0" />
               )}
             </Button>
           </FormControl>
           {open && (
             <div className="absolute z-50 mt-1 w-full rounded border shadow-md bg-primary-foreground">
               <Input
                 ref={inputRef}
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Buscar..."
                 disabled={disabled} 
               />
              <ul ref={listRef} className="overflow-y-auto max-h-60">
               {filteredOptions.map((option) => (
                 <li
                 key={option.value}
                 className={cn(
                   "cursor-pointer px-2 py-1 hover:bg-primary/25",
                   "truncate", // <- esto corta el texto con puntos suspensivos si es muy largo
                   "max-w-full", // <- asegura que no se extienda más allá de su contenedor
                   field.value === option.value && "bg-primary/50",
                   option.disabled && "text-gray-400 cursor-not-allowed"
                 )}
                 onClick={() => !option.disabled && handleSelect(option.value)}
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
       </>)}
   />
 );
};

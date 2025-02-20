import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button"; // Para simular un campo interactivo

type FormDatepickerProps = {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  label: string;
};

const FormDatepicker = ({ form, name, label }: FormDatepickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const datepickerRef = useRef<HTMLDivElement | null>(null);

  // Cierra el calendario si se hace clic fuera de él
  const handleClickOutside = (event: MouseEvent) => {
    if (
      datepickerRef.current &&
      !datepickerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Agregar y remover evento de clic global
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedDate = field.value? new Date(field.value): null;
        const today = new Date();
        return (
          <FormItem ref={datepickerRef} className="relative">
            <FormLabel>{label}</FormLabel>
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center justify-between w-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).replace(/\//g, "-") // Reemplaza "/" con "-"
                  : "Selecciona una fecha"}
              </Button>
              {isOpen && (
                <div className="absolute left-0 z-50 bg-white rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    className=""
                    selected={selectedDate || today}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : null); // Guardar en formato ISO
                      setIsOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormDatepicker;

import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LuPlus } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";

interface SelectGridProps<T> {
  items: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  onSelect: (selected: T) => void;
  selectedItems: T[];
  setSelectedItems: (items: T[]) => void;
  titulo: string;
  getValues: any;
    setValue: any;
}

const SelectGrid = <T extends { [key: string]: any }>({
  items,
  labelKey,
  valueKey,
  onSelect,
  selectedItems,
  setSelectedItems,
  titulo,
    getValues,
    setValue,
}: SelectGridProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  
  const handleAddItem = (fieldName: string) => {
    if (!selectedValue) return;
  
    const item = items.find((x) => x[valueKey].toString() === selectedValue);
    if (item && !selectedItems.some((s) => s[valueKey] === item[valueKey])) {
      const newItems = [...selectedItems, item];
      setSelectedItems(newItems);
  
      // Obtiene el valor actual del campo dinámicamente
      const currentValues = getValues(fieldName) || [];
      setValue(fieldName, [...currentValues, item]); 
    }
  };
  
  

  const handleRemoveItem = (fieldName: string,id: string | number) => {
    const newItems = selectedItems.filter((s) => s[valueKey] !== id);
    setSelectedItems(newItems);
  
    // También actualizar la lista en el formulario
    const servicios = getValues(fieldName) || [];
    setValue(fieldName, servicios.filter((s: any) => s[valueKey] !== id)); 
  };


  return (
    
      <><div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center w-full">
              {/* Select */}
              <div className="flex-1">
                  <Select onValueChange={(value) => setSelectedValue(value)}>
                      <SelectTrigger className="w-full h-8">
                          <SelectValue className="text-xs" placeholder={titulo} />
                      </SelectTrigger>
                      <SelectContent>
                          { items && items.map((item) => (
                              <SelectItem key={item[valueKey]} value={item[valueKey].toString()}>
                                  {item[labelKey]}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>

              {/* Botón */}
              <button
                  className="flex items-center justify-center gap-2 h-8 px-4 text-xs text-white transition bg-blue-500 rounded hover:bg-blue-700 flex-shrink-0 min-w-[50px]"
                  onClick={(e)=>handleAddItem(titulo)}
                  type="button"
              >
                  <LuPlus size={16} />
                  Agregar
              </button>
          </div>
      </div><div className="grid grid-cols-1 gap-3 mt-2">
              {selectedItems && selectedItems.length > 0 && (
                  <div className="text-xs font-semibold">{titulo} relacionados</div>
              )}

              {selectedItems.length > 0 && (
                  <div className="overflow-hidden mt-4 rounded-md border">
                      <div className="overflow-y-auto max-h-40">
                          <table className="w-full text-xs border-collapse">
                              <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
                                  <tr>
                                      <th className="w-[70%] px-4 py-2 text-left border-b">Nombre</th>
                                      {titulo ==="Servicios" ?(
                                        <><th className="w-[70%] px-4 py-2 text-left border-b">Precio</th>
                                        <th className="w-[70%] px-4 py-2 text-left border-b">Frecuencia</th></>
                                      ): (<>
                                      {titulo ==="usuarios" && (<th className="w-[70%] px-4 py-2 text-left border-b">Rol</th>)}
                                      </>)}
                                      <th className="w-[30%] px-4 py-2 text-center border-b">Acciones</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {selectedItems &&
                                    selectedItems.map((item) => {
                                    // Buscar el usuario en items basado en el id
                                    const user = items.find((x) => x.id === item.id);
                                    const userRoll = user ? user.userRoll : "Desconocido"; // Manejar caso en que no se encuentre

                                    return (
                                        <tr key={item[valueKey]} className="border-b">
                                        <td className="px-4 py-2 text-sm">{item[labelKey]}</td>
                                        {titulo === "Servicios" ? (
                                            <>
                                            <td className="px-4 py-2 text-sm">${item.precio}</td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.frecuencia === "A"
                                                ? "ANUAL"
                                                : item.frecuencia === "M"
                                                ? "MENSUAL"
                                                : "ÚNICA"}
                                            </td>
                                            </>
                                        ) : (<>
                                      {titulo ==="usuarios" && (
                                            <td className="px-4 py-2 text-sm">{userRoll}</td>)}
                                            </>)}
                                        <td className="px-4 py-2 text-center">
                                            <button
                                            className="p-2 text-white bg-red-500 rounded hover:bg-red-700"
                                            onClick={() => handleRemoveItem(titulo, item[valueKey])}
                                            >
                                            <LuTrash2 size={18} />
                                            </button>
                                        </td>
                                        </tr>
                                    );
                                    })}
                                </tbody>

                          </table>
                      </div>
                  </div>
              )}
          </div></>

  );
};

export default SelectGrid;

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow, TableHeader } from "@/components/ui/table";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { facturacionParentItem, facturacionChildItem } from "@/interfaces/modulos/facturacionInterface";
import { Button } from "@/components/ui/button";

interface Props {
  parents: facturacionParentItem[];
  children: facturacionChildItem[];
  tipoFactura: string;
  onChange: (updated: any[]) => void;
}

export const FacturaComponent: React.FC<Props> = ({ parents, children, tipoFactura, onChange }) => {
  const [openParents, setOpenParents] = useState<number[]>([]);
  const [childItems, setChildItems] = useState(
    children.map(child => ({ ...child, checked: false }))
  );
  
  const [parentData, setParentData] = useState(parents);

  const toggleChildChecked = (id_venta: number | undefined) => {
    const updated = childItems.map((item) =>
      item.id_venta === id_venta ? { ...item, checked: !item.checked } : item
    );
    setChildItems(updated);
    onChange(updated);
  };

  useEffect(() => {
    const updated = childItems.map((item) => {
      const cantidad = item.cantidad ?? 1;
      const importe = item.importe_servicio ?? 0;
      const subtotal = cantidad * importe;
      const descuento = (item.porcentaje_descuento ?? 0) / 100 * subtotal;
      const subtotalConDescuento = subtotal - descuento;
      const iva = subtotalConDescuento * 0.16;
      const total = subtotalConDescuento + iva;
  
      return {
        ...item,
        checked: tipoFactura === "masiva", // true si masiva, false si no
        subtotal,
        importe_descuento: descuento,
        iva,
        total,
      };
    });
  
    setChildItems(updated);
    onChange(updated);
  }, [tipoFactura]);
  

  const toggleParent = (id_parent: number) => {
    setOpenParents((prev) =>
      prev.includes(id_parent)
        ? prev.filter((id) => id !== id_parent) // Si ya está abierto, lo cerramos
        : [...prev, id_parent] // Si no está abierto, lo abrimos
    );
  };
  const handleChildChange = (id_venta: number | undefined, key: "cantidad" | "importe_servicio", value: number) => {
    const updated = childItems.map((item) => {
      if (item.id_venta === id_venta) {
        const cantidad = key === "cantidad" ? value : item.cantidad;
        const importe = key === "importe_servicio" ? value : item.importe_servicio;
        const total = cantidad * importe;
        
        const subtotal = total / 1.16; 
        const iva = total - subtotal; 

        return {
          ...item,
          [key]: value,
          subtotal: subtotal,
          iva: iva,
          total: total,
        };
      }
      return item;
    });

    setChildItems(updated);
    onChange(updated);
};

  

  const toggleAllParents = () => {
    if (openParents.length === parents.length) {
      setOpenParents([]);
    } else {
      setOpenParents(parents.map((p) => p.id_parent));
    }
  };

  useEffect(() => {
    const updatedParents = parents.map((parent) => {
      const childrenOfParent = childItems.filter(
        (child) => child.id_parent === parent.id_parent && child.checked
      );
  
      const newTotal = childrenOfParent.reduce((acc, child) => acc + child.total, 0);
  
      return {
        ...parent,
        importe_total: newTotal,
      };
    });
    setParentData(updatedParents);
  }, [childItems]);
  

  useEffect(() => {
    if (childItems.length === 0 && children.length > 0) {
      setChildItems(children.map(child => ({ ...child, checked: false })));
    }
  
    if (parentData.length === 0 && parents.length > 0) {
      setParentData(parents);
    }
  }, [parents, children]);
  
  

  return (
    <div className="overflow-x-auto w-full">

      <Button
        type="button"
        variant="default"
        className="m-1 text-xs w-1/8 md:w-auto"
      >
        Buscar
      </Button>
      
      <button
        onClick={toggleAllParents}
        type="button"
        className="px-4 py-2 m-2 text-xs text-white rounded bg-primary hover:bg-primary/90"
      >
        {openParents.length === parents.length ? "Contraer" : "Expandir"}
      </button>

      <div className="overflow-y-auto  h-[210px] m-1 rounded-sm border">


      {/* Encabezado solo para pantallas grandes */}


      {/* Cuerpo de la tabla para pantallas pequeñas */}
      <div className="md:hidden">
        {/* Mostrar solo registros de los parents sin el encabezado en pantallas pequeñas */}
        {parentData.map((parent) => (
          <div key={parent.id_parent} className="flex flex-col p-4 mb-4 bg-muted/50">
            <div className="font-semibold">Nombre del cliente</div>
            <div>{parent.nombre_cliente}</div>
         

            <div className="font-semibold">Método</div>
            <div>{parent.metodo_pago}</div>

            <div className="font-semibold">Forma de Pago</div>
            <div>{parent.forma_pago}</div>

            <div className="font-semibold">Total</div>
            <div>${parent.importe_total.toFixed(2)}</div>

            {/* Mostrar los child items si el parent está clickeado */}
            <div className="pl-4">
            {openParents.includes(parent.id_parent) && (
              <div className="flex flex-col gap-4 mt-4">
                {childItems
                  .filter((c) => c.id_parent === parent.id_parent)
                  .map((child) => (
                    <div
                      key={child.id_venta}
                      className="flex flex-col gap-2 p-4 bg-white rounded-lg border shadow-sm"
                    >
                      <div>
                    <label className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={child.checked}
                          onChange={() => toggleChildChecked(child.id_venta)}
                        />
                      {child.nombre_servicio}
                    </label>
                  </div>

          <div>
            <strong>Servicio:</strong> {child.nombre_servicio}
          </div>
          <div>
            <strong>Cantidad:</strong>
            <Input
              type="number"
              value={child.cantidad}
              min={1}
              className="w-full max-w-[100px] mt-1"
              onChange={(e) =>
                handleChildChange(child.id_venta, "cantidad", parseFloat(e.target.value))
              }
            />
          </div>
          <div>
            <strong>Precio:</strong>
            <Input
              type="number"
              value={child.importe_servicio}
              step="0.01"
              className="w-full max-w-[100px] mt-1"
              onChange={(e) =>
                handleChildChange(child.id_venta, "importe_servicio", parseFloat(e.target.value))
              }
            />
          </div>
          <div>
            <strong>Desc %:</strong> {child.porcentaje_descuento ?? 0}%
          </div>
          <div>
            <strong>Importe Desc%:</strong> ${child.importe_descuento?.toFixed(2) ?? "0.00"}
          </div>
          <div>
            <strong>Subtotal:</strong> ${child.subtotal?.toFixed(2) ?? "0.00"}
          </div>
          <div>
            <strong>IVA:</strong> ${child.iva?.toFixed(2) ?? "0.00"}
          </div>
          {/* <div>
            <strong>Total:</strong> ${child.total.toFixed(2)}
          </div> */}

<div className="font-semibold">Total</div>
          <div>
            ${childItems
              .filter((c) => c.id_parent === parent.id_parent && c.checked)
              .reduce((acc, c) => acc + c.total, 0)
              .toFixed(2)}
          </div>

        </div>
      ))}
  </div>
)}


            </div>
          </div>
        ))}
      </div>

      {/* Tabla de registros de los parents en pantallas grandes */}
      <div className="hidden md:block">
        <Table>
          {/* Agregar encabezado general */}
          <TableHeader>
          <TableRow className="text-xs font-semibold uppercase bg-gray-100">
          <TableCell className="w-1"></TableCell>
            <TableCell className="w-48">Cliente</TableCell>
            <TableCell className="w-32">Método de pago</TableCell>
            <TableCell className="w-32">Forma de pago</TableCell>
            <TableCell className="w-28">Importe total</TableCell>
   
          
          </TableRow>
          </TableHeader>


          <TableBody>
            {parentData.map((parent) => (
              <React.Fragment key={parent.id_parent}>
                <TableRow           
                className="font-semibold cursor-pointer text-primary hover:bg-muted"
                 onClick={() => toggleParent(parent.id_parent)}>
                <TableCell
    
            >
              {/* Aquí se decide si mostrar expandir o colapsar */}
              {openParents.includes(parent.id_parent) ? (
                <MdOutlineExpandLess />
              ) : (
                <MdOutlineExpandMore />
              )}
            </TableCell>
                  <TableCell className="font-semibold text-primary">{parent.nombre_cliente}</TableCell>
                  <TableCell className="font-semibold text-primary">{parent.metodo_pago}</TableCell>
                  <TableCell className="font-semibold text-primary">{parent.forma_pago}</TableCell>
                  {/* <TableCell className="font-semibold text-primary">${parent.importe_total.toFixed(2)}</TableCell> */}
                  <TableCell className="font-semibold text-primary">
                    ${childItems
                      .filter((c) => c.id_parent === parent.id_parent && c.checked)
                      .reduce((acc, c) => acc + c.total, 0)
                      .toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* Children */}
                {openParents.includes(parent.id_parent) && (
                  <>
                   <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      {/* Puedes poner una subtabla o contenido con grid/flex aquí */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-xs font-semibold uppercase bg-gray-200">
                            <tr>
                              <th className="px-2 py-1 text-left"></th>
                              <th className="px-2 py-1 text-left">Servicio</th>
                              <th className="px-2 py-1 text-left">Cantidad</th>
                              <th className="px-2 py-1 text-left">Precio</th>
                              <th className="px-2 py-1 text-left">Desc %</th>
                              <th className="px-2 py-1 text-left">Importe Desc%</th>
                              <th className="px-2 py-1 text-left">Subtotal</th>
                              <th className="px-2 py-1 text-left">IVA</th>
                              <th className="px-2 py-1 text-left">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {childItems
                              .filter((c) => c.id_parent === parent.id_parent)
                              .map((child) => (
                                <tr key={child.id_venta} className="bg-muted/50">
                                  <td className="px-2 py-1">
                                    <input
                                      type="checkbox"
                                      checked={child.checked}
                                      onChange={() => toggleChildChecked(child.id_venta)}
                                    />
                                  </td>
                                  <td className="px-2 py-1">{child.nombre_servicio}</td>
                                  <td className="px-2 py-1">
                                    <Input
                                      type="number"
                                      value={child.cantidad}
                                      min={1}
                                      className="w-20"
                                      onChange={(e) =>
                                        handleChildChange(child.id_venta, "cantidad", parseFloat(e.target.value))
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1">
                                    <Input
                                      type="number"
                                      value={child.importe_servicio}
                                      step="0.01"
                                      className="w-24"
                                      onChange={(e) =>
                                        handleChildChange(child.id_venta, "importe_servicio", parseFloat(e.target.value))
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1">{child.porcentaje_descuento ?? 0}%</td>
                                  <td className="px-2 py-1">${child.importe_descuento?.toFixed(2) ?? "0.00"}</td>
                                  <td className="px-2 py-1">${child.subtotal?.toFixed(2) ?? "0.00"}</td>
                                  <td className="px-2 py-1">${child.iva?.toFixed(2) ?? "0.00"}</td>
                                  <td className="px-2 py-1">${child.total.toFixed(2)}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </TableCell>
                  </TableRow>

                 
                  </>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      </div>
    </div>
  );
};

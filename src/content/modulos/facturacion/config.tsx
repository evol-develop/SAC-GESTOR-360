import * as z from "zod";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { Card,CardContent, CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import {Form,FormControl,FormField,FormItem,FormLabel,} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import { RootState } from "@/store/store";
import { createUser } from "@/api/authApi";
import { encrypt } from "@/lib/utils/crypto";
import FormInput from "@/components/form-base";
import { Switch } from "@/components/ui/switch";
import FormFooter from "@/components/form-footer";
import { useAppSelector } from "@/hooks/storeHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComboboxForm } from "@/components/custom-combobox";
import { PropsFormulario } from "@/interfaces/formInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { serviciosInterface } from "@/interfaces/catalogos/serviciosInterfaces";
import {lineasInterface} from "@/interfaces/catalogos/lineasInterface";
import {sublineasInterface} from "@/interfaces/catalogos/sublineasInterface";
import { Checkbox } from "@/components/ui/checkbox"
import { datosSATInterface } from "@/interfaces/catalogos/datosSATInterface";
import { useEffect, useState } from "react";
import { departamentoInterface } from "@/interfaces/catalogos/departamentoInterface";
import { Controller } from "react-hook-form";
import { LuLoaderCircle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {FacturaComponent }from "@/components/FacturaComponent";
import { facturacionParentItem, facturacionChildItem } from "@/interfaces/modulos/facturacionInterface";
import  RadioSelector  from "@/components/RadioSelector";
import { useMemo } from "react";

const validationSchema = z.object({
  precio: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().min(0.01, "El precio es obligatorio")),
  descripcion: z.string().max(120).min(1, "La descripción es un dato requerido"),
  frecuencia: z.string().min(1, "La frecuencia es obligatoria"), // Elimina .optional()
  capturar_cantidad: z.boolean().optional(),
  lineaId: z.number().min(1, "La línea es obligatoria"),
  sublineaId: z.number().min(1, "La sublínea es obligatoria"),
  id_unidad: z.number().min(1, "La unidad es obligatoria"),
  tasa_iva: z.string().min(1, "La tasa de IVA es obligatoria"),
  aplica_iva: z.boolean().nullable().optional(),
  clave_sat: z.string().min(1, "La clave SAT es obligatoria"),
  aplica_ieps: z.boolean().optional(),
  obj_imp: z.string().min(1, "El objeto de impuesto es obligatorio").optional(),
  tasa_ieps: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
  porcentaje_retencion_isr: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
  porcentaje_retencion_iva: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
  activo: z.boolean().optional(),
  departamentoId: z.number().min(1, "El departamento es obligatorio"),
  userId: z.string().min(1, "El usuario es obligatorio"),
});

export const OperacionesFormulario = () => {
  
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as serviciosInterface;
    // const userRol = values.globalState.ROL;

    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      precio: valores.precio,
      descripcion: valores.descripcion,
      frecuencia:valores.frecuencia,
      capturar_cantidad: valores.capturar_cantidad,
      lineaId: valores.lineaId,
      sublineaId: valores.sublineaId,
      id_unidad:valores.id_unidad,
      tasa_iva:valores.tasa_iva,
      aplica_iva:valores.aplica_iva,
      clave_sat:valores.clave_sat,
      aplica_ieps:valores.aplica_ieps,
      obj_imp:valores.obj_imp,
      tasa_ieps:valores.tasa_ieps,
      porcentaje_retencion_isr:valores.porcentaje_retencion_isr,
      porcentaje_retencion_iva:valores.porcentaje_retencion_iva,
      activo:valores.activo,
      userId:valores.userId,
      departamentoId:valores.departamentoId,
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/servicios/create",
        valoresForm
      );

      

      if(response.data.isSuccess){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
      return response.data;
      
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al crear el servicio");
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as serviciosInterface;

    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      precio: valores.precio,
      descripcion: valores.descripcion,
      frecuencia:valores.frecuencia,
      capturar_cantidad: valores.capturar_cantidad,
      lineaId: valores.lineaId,
      sublineaId: valores.sublineaId,
      id_unidad:valores.id_unidad,
      tasa_iva:valores.tasa_iva,
      aplica_iva:valores.aplica_iva,
      clave_sat:valores.clave_sat,
      aplica_ieps:valores.aplica_ieps,
      obj_imp:valores.obj_imp,
      tasa_ieps:valores.tasa_ieps,
      porcentaje_retencion_isr:valores.porcentaje_retencion_isr,
      porcentaje_retencion_iva:valores.porcentaje_retencion_iva,
      activo:valores.activo,
      linea:valores.linea,
      sublinea:valores.sublinea,
      userId:valores.userId,
      departamentoId:valores.departamentoId,
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/servicios/update", {
        ...valoresForm,
      });

     
      if(response.data.isSuccess){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
      return response.data;
      
    } catch (error) {
      console.error(error);
      throw `Error al editar el servicio`;
    }
  };

  return {
    createItemCatalogo,
    updateItemCatalogo,
  };
};

export const Facturacion = ({
  dataModal,
  onSubmit,
  handleCreateItemClose,
}: PropsFormulario) => {
  const Servicios =useAppSelector((state: RootState) => state.page.slots.SERVICIOSPRODUCTOS as datosSATInterface[] );
  const Unidades =useAppSelector((state: RootState) => state.page.slots.UNIDADES as datosSATInterface[] );
  const Lineas =useAppSelector((state: RootState) => state.page.slots.LINEAS as lineasInterface[] );
  const SubLineas =useAppSelector((state: RootState) => state.page.slots.SUBLINEAS as sublineasInterface[] );
  const departamentos =useAppSelector((state: RootState) => state.page.slots.DEPARTAMENTOS as departamentoInterface[] );
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  
  
  const tasaIvaTransformada = dataModal.tasa_iva === 16 ? "2" 
  : dataModal.tasa_iva === 0 ? "1"
  : String(dataModal.tasa_iva);

  
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      precio:dataModal.precio,
      descripcion:dataModal.descripcion,
      frecuencia: dataModal.frecuencia,
      capturar_cantidad: dataModal.capturar_cantidad,
      lineaId:dataModal.lineaId,
      sublineaId:dataModal.sublineaId,
      id_unidad:dataModal.id_unidad,
      tasa_iva: tasaIvaTransformada,
      aplica_iva:dataModal.aplica_iva,
      clave_sat:dataModal.clave_sat,
      aplica_ieps:dataModal.aplica_ieps,
      obj_imp:dataModal.obj_imp,
      tasa_ieps:dataModal.tasa_ieps,
      porcentaje_retencion_isr:dataModal.porcentaje_retencion_isr,
      porcentaje_retencion_iva:dataModal.porcentaje_retencion_iva,
      activo:dataModal.activo,
      departamentoId:dataModal.departamentoId,
      userId: dataModal.userId,
    },
  });



  const onSubmit2: SubmitHandler<z.infer<typeof validationSchema>> = async (values) => {
    console.log(values);

    //onSubmit(values);
  }

  const onError = (errors: any) => {
    console.log(errors);
    toast.error("Error al enviar el formulario");
  };

  const [tasaIvaActual, setTasaIvaActual] = useState<string>(
    'Selecciona una opcion'
  );

 
  const misParents: facturacionParentItem[] = [
    {
      id_parent: 1,
      nombre_cliente: "Empresa ABC",
      importe_total: 5000,
      anio: 2025,
      mes: 4,
      frecuencia: "Mensual",
      id_cliente: 101,
      metodo_pago: "PDU",
      forma_pago: " Transferencia"
    },
    {
      id_parent: 2,
      nombre_cliente: "Comercial XYZ",
      importe_total: 3200,
      anio: 2025,
      mes: 4,
      frecuencia: "Mensual",
      id_cliente: 102,
      metodo_pago: "PUE",
      forma_pago: "Pago en parcialidades"
    }
  ];

  const misChildren: facturacionChildItem[] = [
    {
      id_venta: 1,
      linea_detalle: 1,
      nombre_servicio: "Servicio de Mantenimiento",
      importe_servicio: 1000,
      importe_servicio_original: 1000,
      cantidad: 2,
      total: 2000,
      subtotal: 1724.14,
      iva: 275.86,
      tasa_iva: 0.16,
      porcentaje_descuento: 0,
      importe_descuento: 0,
      capturar_cantidad: true,
      id_servicio: 10,
      id_cliente: 101,
      id_parent: 1
    },
    {
      id_venta: 2,
      linea_detalle: 2,
      nombre_servicio: "Consultoría Técnica",
      importe_servicio: 1500,
      importe_servicio_original: 1500,
      cantidad: 2,
      total: 3000,
      subtotal: 2586.21,
      iva: 413.79,
      tasa_iva: 0.16,
      porcentaje_descuento: 0,
      importe_descuento: 0,
      capturar_cantidad: true,
      id_servicio: 11,
      id_cliente: 101,
      id_parent: 1
    },
    {
      id_venta: 3,
      linea_detalle: 3,
      nombre_servicio: "Capacitación",
      importe_servicio: 1600,
      importe_servicio_original: 1600,
      cantidad: 2,
      total: 3200,
      subtotal: 2758.62,
      iva: 441.38,
      tasa_iva: 0.16,
      porcentaje_descuento: 0,
      importe_descuento: 0,
      capturar_cantidad: true,
      id_servicio: 12,
      id_cliente: 102,
      id_parent: 2
    }
  ];

  const [tipoFactura, setTipoFactura] = useState("individual")

  const opciones = [
    { label: "Individual", value: "individual" },
    { label: "Masiva", value: "masiva" },
  ]
  
  return (
    <Tabs defaultValue="facturas" className="w-full">

      <TabsList className="grid grid-cols-2 mb-2 w-full">
        <TabsTrigger value="facturas">Facturas</TabsTrigger>
        <TabsTrigger value="listado">Listados de facturas</TabsTrigger>
      </TabsList>
  
      <Form {...generalForm}>
        <form onSubmit={generalForm.handleSubmit(onSubmit)}>
        
          <Card className="gap-2">
            <TabsContent value="facturas">

              {/* <CardContent></CardContent> */}
              <CardContent>
              <RadioSelector
                title="Tipo de Factura"
                options={opciones}
                value={tipoFactura}
                onChange={setTipoFactura}
              />
              
              
               
               <div className="grid grid-cols-1 gap-2 mb-1 md:grid-cols-4">

                <ComboboxForm
                  label="Cliente"
                  tipo="CLIENTES"
                  name="clienteId"
                  form={generalForm}
                  disabled={tipoFactura === "masiva"}
                />

                  <ComboboxForm
                  label="Frecuencia"
                  tipo="FRECUENCIAS"
                  name="frecuencia"
                  form={generalForm}
                />

                <ComboboxForm
                  label="Año"
                  tipo="ANIO"
                  name="anio"
                  form={generalForm}
                />      

                <ComboboxForm
                  label="Mes"
                  tipo="MES"
                  name="mes"
                  form={generalForm}
                />  


                
               </div>
             
             

            
              <FacturaComponent
                parents={misParents}
                tipoFactura={tipoFactura}
                children={misChildren}
                onChange={(e)=>{console.log(e)}}
                />
       


              <div className="flex flex-wrap gap-2 justify-center px-6 pb-2 md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="m-1 w-full text-xs md:w-auto"
                >
                  Inicializar
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="m-1 w-full text-xs md:w-auto"
                >
                  Guardar
                </Button>

                <Button
                  type="button"
                   variant="default"
                  className="m-1 w-full text-xs md:w-auto"
                >
                  Autorizar
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  className="m-1 w-full text-xs md:w-auto"
                >
                  Desautorizar
                </Button>

                <Button
                  type="button"
                   variant="default"
                  className="m-1 w-full text-xs md:w-auto"
                >
                  CFDI
                </Button>
              </div>

              </CardContent>
              
            </TabsContent>
  
            <TabsContent value="listado">
              <CardContent className="grid grid-cols-1 gap-4">
              </CardContent>
            </TabsContent>
  
           
          </Card>
        </form>
      </Form>
    </Tabs>
  );
  
};

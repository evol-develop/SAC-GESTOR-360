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

const validationSchema = z
  .object({
    precio: z
        .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    descripcion: z.string().max(120).min(1, "La descripción es un dato requerido"),
    frecuencia: z.string().min(1, "La frecuencia es obligatoria").optional(),
    capturar_cantidad: z.boolean(),
    lineaId: z.number(),
    sublineaId: z.number(),
    id_unidad: z.number(),
    tasa_iva: z.string(),
    aplica_iva:z.boolean().optional(),
    clave_sat:z.string(),
    aplica_ieps:z.boolean(),
    obj_imp:z.string().optional(),
    tasa_ieps: z
        .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    porcentaje_retencion_isr: z
        .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    porcentaje_retencion_iva: z
        .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    activo: z.boolean().optional(),
  })

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
      activo:valores.activo
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/servicios/create",
        valoresForm
      );

      return response.data;
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al actualizar la informacion del usuario");
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
      linea:values.dataModal.linea,
      sublinea:values.dataModal.sublinea
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/servicios/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar la informacion del usuario`;
    }
  };

  return {
    createItemCatalogo,
    updateItemCatalogo,
  };
};

export const Formulario = ({
  dataModal,
  onSubmit,
  handleCreateItemClose,
}: PropsFormulario) => {
  const isEditing = useAppSelector((state: RootState) => state.page.isEditing);
  const Servicios =useAppSelector((state: RootState) => state.page.slots.SERVICIOSPRODUCTOS as datosSATInterface[] );
  const Unidades =useAppSelector((state: RootState) => state.page.slots.UNIDADES as datosSATInterface[] );
  const Lineas =useAppSelector((state: RootState) => state.page.slots.LINEAS as lineasInterface[] );
  const SubLineas =useAppSelector((state: RootState) => state.page.slots.SUBLINEAS as sublineasInterface[] );

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
      tasa_iva:tasaIvaTransformada,
      aplica_iva:dataModal.aplica_iva,
      clave_sat:dataModal.clave_sat,
      aplica_ieps:dataModal.aplica_ieps,
      obj_imp:dataModal.obj_imp,
      tasa_ieps:dataModal.tasa_ieps,
      porcentaje_retencion_isr:dataModal.porcentaje_retencion_isr,
      porcentaje_retencion_iva:dataModal.porcentaje_retencion_iva,
      activo:dataModal.activo
    },
  });

  const frecuencias = [
    { clave: "A", descripcion: "ANUAL" },
    { clave: "M", descripcion: "MENSUAL" },
    { clave: "U", descripcion: "UNICA" },
  ];

  
  const tasaIvaOptions = [
    { clave: "1", descripcion: '0.00 %' },
    { clave: "2", descripcion: '16.00 %'},
     { clave: "3", descripcion: 'EXENTO' }
  ];

  const onSubmit2: SubmitHandler<z.infer<typeof validationSchema>> = async (values) => {
    console.log(values);

    onSubmit(values);
  }

  const onError = (errors: any) => {
    console.log(errors);
    toast.error("Error al enviar el formulario");
  };

  const [tasaIvaActual, setTasaIvaActual] = useState<string>(
    'Selecciona una opcion'
  );

  function calcularTasaIvaActual() {
    if (dataModal.aplica_iva === false) {
      setTasaIvaActual('EXENTO');
    } else if (dataModal.tasa_iva == 16) {
      setTasaIvaActual('16.00 %');
    } else if (dataModal.tasa_iva == 0) {
      setTasaIvaActual('0.00 %');
    }
  }

  useEffect(() => {
    calcularTasaIvaActual();
  },[]);

  return (
    <Tabs defaultValue="general" className="w-full">
   
      <TabsContent value="general">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="h-[560px] w-full overflow-y-auto">
             
              <CardContent className="relative grid grid-cols-4 gap-2 py-3">

                 {dataModal.id !== undefined && ( 
                <FormField
                    control={generalForm.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel>
                          {field.value ? "Activo" : "Inactivo"}
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="!mt-0"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />)}
                  
                  <FormField
                    control={generalForm.control}
                    name="capturar_cantidad"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="capturar_cantidad"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="capturar_cantidad" className="text-xs font-medium leading-none">
                            Cantidad capturable
                          </label>
                        </div>
                      </div>
                    )}
                  /> 

                  <FormField
                      control={generalForm.control}
                      name="aplica_ieps"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="aplica_ieps"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="aplica_ieps" className="text-xs font-medium leading-none">
                              Aplica IEPS
                            </label>
                          </div>
                        </div>
                      )}
                    />

                <div className="flex items-center">
                  
                  <FormInput
                    form={generalForm}
                    name="tasa_ieps"
                    label="Tasa IEPS(%)"
                    placeholder=""
                    type="number"
                    required
                    disabled={generalForm.watch("aplica_ieps") ? false : true}
                  />
                
                  </div>

                </CardContent>
               
                <CardContent className="relative grid grid-cols-2 gap-3 py-1">
               

                <FormInput
                  form={generalForm}
                  name="descripcion"
                  label="Descripción"
                  placeholder=""
                  required
                />

                <FormInput
                  form={generalForm}
                  name="precio"
                  label="Precio"
                  placeholder=""
                  type="number"
                  required
                />
                </CardContent>

              <CardContent className="relative grid grid-cols-3 gap-2">

                <FormInput
                  form={generalForm}
                  name="porcentaje_retencion_isr"
                  label="Porcentaje retencion isr (%)"
                  placeholder=""
                  type="number"
                  required
                />

                <FormInput
                  form={generalForm}
                  name="porcentaje_retencion_iva"
                  label="Porcentaje retencion iva (%)"
                  placeholder=""
                  type="number"
                  required
                />
              </CardContent>

              <CardContent className="relative grid grid-cols-3 gap-6 py-2">

              <div>
                <FormLabel className="text-xs">Tasa Iva(%) </FormLabel>
                <Select name="tasa_iva" onValueChange={(value) => generalForm.setValue("tasa_iva", value)}>
                  <SelectTrigger >
                  <SelectValue
                  placeholder={tasaIvaActual}/>
                  </SelectTrigger>
                  <SelectContent>
                  {tasaIvaOptions.map((metodo) => (
                    <SelectItem key={metodo.clave} value={metodo.clave}>
                      {metodo.descripcion}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Clave sat</FormLabel>
              <Select name="clave_sat" onValueChange={(value) => generalForm.setValue("clave_sat", value)}>
                <SelectTrigger className="w-72">
                <SelectValue
                  placeholder={
                    Servicios && Servicios.length > 0
                      ? Servicios.find((x) => x.id.toString() === generalForm.watch("clave_sat"))
                          ?.descripcion || "Selecciona un tipo de producto"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {Servicios && Servicios.map((item: { id: number; descripcion: string; clave: string  }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.clave}- {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>
              
              <div>
              <FormLabel className="text-xs">Frecuencia </FormLabel>
              <Select name="frecuencia" onValueChange={(value) => generalForm.setValue("frecuencia", value)}>
                <SelectTrigger >
                <SelectValue
                placeholder={
                  frecuencias.find((metodo) => metodo.clave === generalForm.watch("frecuencia"))
                    ?.descripcion || "Selecciona una frecuencia"
                }/>
                </SelectTrigger>
                <SelectContent>
                {frecuencias.map((metodo) => (
                  <SelectItem key={metodo.clave} value={metodo.clave}>
                    {metodo.descripcion}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Línea</FormLabel>
              <Select name="lineaId" onValueChange={(value) => generalForm.setValue("lineaId", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    Lineas && Lineas.length > 0
                      ? Lineas.find((x) => x.id === generalForm.watch("lineaId"))
                          ?.descripcion || "Seleccione una línea"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {Lineas && Lineas.map((item: { id: number; descripcion: string }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Sublínea</FormLabel>
              <Select name="sublineaId" onValueChange={(value) => generalForm.setValue("sublineaId", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    SubLineas && SubLineas.length > 0
                      ? SubLineas.find((x) => x.id === generalForm.watch("sublineaId"))
                          ?.descripcion || "Seleccione una sublínea"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {SubLineas && SubLineas.map((item: { id: number; descripcion: string }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Unidad </FormLabel>
              <Select name="id_unidad" onValueChange={(value) => generalForm.setValue("id_unidad", parseInt(value))}>
                <SelectTrigger className="w-72">
                <SelectValue
                  placeholder={
                    Unidades && Unidades.length > 0
                      ? Unidades.find((x) => x.id === generalForm.watch("id_unidad"))
                          ?.descripcion || "Selecciona una unidad"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {Unidades && Unidades.map((item: { id: number; descripcion: string; clave: string  }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.clave}- {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              </CardContent>

              <FormFooter
                handleCreateItemClose={handleCreateItemClose}
                form={generalForm}
                dataModal={dataModal}
              />
            </Card>
          </form>
        </Form>
      </TabsContent>

    </Tabs>
  );
};

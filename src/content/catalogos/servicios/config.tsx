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
import { useAutorizacionesSecuenciales } from "@/components/Autorizar";
import { useMemo } from "react";

const validationSchema = z.object({
  precio: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0.01, "El precio es obligatorio")
  ).optional(),

  descripcion: z.string().max(120).min(1, "La descripción es un dato requerido").optional().nullable(),
  frecuencia: z.string().min(1, "La frecuencia es obligatoria").optional().nullable(),

  capturar_cantidad: z.preprocess(
    (val) => val === undefined ? false : val,
    z.boolean()
  ),

  lineaId: z.number().min(1, "La línea es obligatoria").optional().nullable(),
  sublineaId: z.number().min(1, "La sublínea es obligatoria").optional().nullable(),
  id_unidad: z.number().min(1, "La unidad es obligatoria").optional().nullable(),
  tasa_iva: z.preprocess((val) => {
    if (val === null || val === undefined || val === "" || val === "undefined") {
      return "3";
    }
    return val;
  }, z.string().min(1, "La tasa de IVA es obligatoria")).optional().nullable(),
  
  aplica_iva: z.preprocess(
    (val) => val === undefined ? false : val,
    z.boolean()
  ).nullable(),

 // clave_sat: z.string().min(1, "La clave SAT es obligatoria").optional().nullable(),
  clave_sat: z.string().optional().transform(val => val ?? null),

  aplica_ieps: z.preprocess(
    (val) => val === undefined ? false : val,
    z.boolean()
  ),

  obj_imp: z.string().min(1, "El objeto de impuesto es obligatorio").optional().nullable(),

  tasa_ieps: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable()
  ),

  porcentaje_retencion_isr: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable()
  ),

  porcentaje_retencion_iva: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable()
  ),

  activo: z.preprocess(
    (val) => val === undefined ? false : val,
    z.boolean()
  ),

  departamentoId: z.number().min(1, "El departamento es obligatorio").optional().nullable(),
  userId: z.string().min(1, "El usuario es obligatorio").optional().nullable(),
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

export const Formulario = ({
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

  const frecuencias = [
    { clave: "A", descripcion: "ANUAL" },
    { clave: "M", descripcion: "MENSUAL" },
    { clave: "U", descripcion: "UNICA" },
  ];

  const tasaIvaOptions = [
    { clave: 1, descripcion: '0.00 %' },
    { clave: 2, descripcion: '16.00 %'},
     { clave: 3, descripcion: 'EXENTO' }
  ];

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

  const subLineasFiltradas = useMemo(() => {
    return SubLineas?.filter((x) => x.lineaId === generalForm.watch("lineaId")) || [];
  }, [generalForm.watch("lineaId"), SubLineas]);

  const usuariosFiltrados = useMemo(() => {
    
    if(usuarios && usuarios){
      return usuarios.filter(user => user.userRoll !== "Cliente");
    }

  }, [usuarios]);
  
  const {
    facturacion: autorizadoFacturacion,
  } = useAutorizacionesSecuenciales();
  
  return (
    <Tabs defaultValue="general" className="w-full">
   
      <TabsContent value="general">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="h-[560px] w-full overflow-y-auto">
             
            <Tabs defaultValue="general" className="gap-3 w-full">
            <TabsList className="flex flex-wrap w-full h-full">
              <TabsTrigger value="general">Generales</TabsTrigger>
             

              {autorizadoFacturacion && <TabsTrigger value="facturacion">Facturación</TabsTrigger>}
              
              <TabsTrigger value="departamento">Departamento y usuarios</TabsTrigger>
          
            </TabsList>

            <div className="flex-1">
            <TabsContent value="general">
            
               
              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">
              

              <FormInput
                form={generalForm}
                name="descripcion"
                label="Descripción"
                placeholder=""
                required
                className="w-96"
              />

 
              </CardContent>

            

              </TabsContent>
              
            <TabsContent value="facturacion">
            
              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">

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
                    disabled={generalForm.watch("aplica_ieps") ? false : true}
                  />
                
                  </div>

                </CardContent>
             

              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-3">

              <FormInput
                form={generalForm}
                name="precio"
                label="Precio"
                placeholder=""
                type="number"
              />
              
                <FormInput
                  form={generalForm}
                  name="porcentaje_retencion_isr"
                  label="Porcentaje retencion isr (%)"
                  placeholder=""
                  type="number"
                />

                <FormInput
                  form={generalForm}
                  name="porcentaje_retencion_iva"
                  label="Porcentaje retencion iva (%)"
                  placeholder=""
                  type="number"
                />
              </CardContent>

              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">

              <div>
                <FormLabel className="text-xs">Tasa Iva(%) </FormLabel>
                <Controller
                name="tasa_iva"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString() || ""}>
                  <SelectTrigger >
                  <SelectValue
                  placeholder={tasaIvaActual}/>
                  </SelectTrigger>
                  <SelectContent>
                  {tasaIvaOptions.map((metodo) => (
                    <SelectItem key={metodo.clave} value={metodo.clave.toString()}>
                      {metodo.descripcion}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
              </div>

              <div>
              <FormLabel className="text-xs">Clave sat</FormLabel>
              <Controller
                name="clave_sat"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString() || ""}>
                <SelectTrigger className="w-72">
                <SelectValue
                  placeholder={
                    Servicios && Servicios.length > 0
                      ? Servicios.find((x) => x.id.toString() === field.value)
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
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
              </div>
              
              <div>
              <FormLabel className="text-xs">Frecuencia </FormLabel>
              <Controller
                name="frecuencia"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                                            <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString() || ""}>
                <SelectTrigger >
                <SelectValue
                placeholder={
                  frecuencias.find((metodo) => metodo.clave === field.value)
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
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
              </div>

              <div>
              <FormLabel className="text-xs">Línea</FormLabel>
              <Controller
                name="lineaId"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            Lineas && Lineas.length > 0
                              ? Lineas.find((x) => x.id === field.value)?.descripcion || "Seleccione una línea"
                              : "Cargando..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Lineas &&
                          Lineas.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.descripcion}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-xs">Sublínea</FormLabel>
              <Controller
                name="sublineaId"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            subLineasFiltradas && subLineasFiltradas.length > 0
                              ? subLineasFiltradas.find((x) => x.id === field.value)?.descripcion || "Seleccione una sublínea"
                              : "Cargando..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {subLineasFiltradas &&
                          subLineasFiltradas.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.descripcion}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>


              <div>
              <FormLabel className="text-xs">Unidad </FormLabel>
              <Controller
                name="id_unidad"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
               <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                <SelectTrigger className="w-72">
                <SelectValue
                  placeholder={
                    Unidades && Unidades.length > 0
                      ? Unidades.find((x) => x.id === field.value)
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
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
              </div>

              </CardContent>

              </TabsContent>

              <TabsContent value="departamento">

              <CardContent className="grid relative grid-cols-1 gap-1 py-1">
                <div>
                <FormLabel className="text-xs">Departamento al que pertenece</FormLabel>
                <Controller
                name="departamentoId"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                              <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                  <SelectTrigger className="w-72">
                  <SelectValue
                    placeholder={
                      departamentos && departamentos.length > 0
                        ? departamentos.find((x) => x.id ===field.value)
                            ?.nombre || "Selecciona un departamento"
                        : "Cargando..."
                    }
                  />
                  </SelectTrigger>
                  <SelectContent>
                      {departamentos && departamentos.map((item: { id: number; nombre: string }) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                         {item.nombre}
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
                </div>

                <div>
                <FormLabel className="text-xs">Usuario encargado (opcional)</FormLabel>
                <Controller
                name="userId"
                control={generalForm.control}
                render={({ field, fieldState }) => (
                  <>
                             <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString() || ""}
                    >
                  <SelectTrigger className="w-72">
                  <SelectValue
                    placeholder={
                      usuariosFiltrados && usuariosFiltrados.length > 0
                        ? usuariosFiltrados.find((x) => x.id === field.value)
                            ?.fullName || "Selecciona un usuario"
                        : "Cargando..."
                    }
                  />
                  </SelectTrigger>
                  <SelectContent>
                  {/* <SelectItem key={""} value={""}>
                    {"SIN USUARIO"}
                  </SelectItem> */}

                      {usuariosFiltrados && usuariosFiltrados.map((item: { id: string; fullName: string }) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                         {item.fullName}
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
                </div>

                
              </CardContent>

             
              
             
              </TabsContent>

              </div>
              
              <div className="absolute right-4 bottom-4">
              <FormFooter
                handleCreateItemClose={handleCreateItemClose}
                form={generalForm}
                dataModal={dataModal}
              />
            </div>

              </Tabs>
            </Card>
          </form>
        </Form>
      </TabsContent>

    </Tabs>
  );
};

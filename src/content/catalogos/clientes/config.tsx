import * as z from "zod";
import {  useForm } from "react-hook-form";
import { Card,CardContent} from "@/components/ui/card";
import {Form,FormControl,FormField,FormItem,FormLabel,} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import FormInput from "@/components/form-base";
import { Switch } from "@/components/ui/switch";
import FormFooter from "@/components/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsFormulario } from "@/interfaces/formInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { clienteInterface } from "@/interfaces/catalogos/clienteInterface";
import { Checkbox } from "@/components/ui/checkbox"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { datosSATInterface } from "@/interfaces/catalogos/datosSATInterface";
import { alertasInterface } from "@/interfaces/catalogos/alertasInterface";
import { tipoClientes } from "@/interfaces/catalogos/tipoClientes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createUser } from "@/api/authApi";
import FormDatepicker from "@/components/form-datepicker";
import { serviciosInterface } from "@/interfaces/catalogos/serviciosInterfaces";
import  SelectGrid  from "@/components/select";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

const phoneRegExp = /^\d{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = z
  .object({

    Servicios: z.array(z.object({ id: z.number(), descripcion: z.string() })).optional(),
    nombre: z.string().min(1, "El nombre es un dato requerido").max(200),
    rfc: z.string().length(13, "El RFC debe tener exactamente 13 caracteres"),
    cp: z.string().min(5, "El código postal debe tener 5 dígitos").max(6, "El código postal debe tener 5 dígitos"),
    telefono: z.string().min(10, "El teléfono debe ser de 10 dígitos").max(10).regex(phoneRegExp, "El teléfono debe ser de 10 dígitos"),
    email: z.string().min(1, "El correo es un dato requerido").max(120).email("El correo no es válido"),
    curp: z.string().length(18, "El CURP debe tener 18 caracteres"),
    tiposClienteId: z.number().optional(),
    activo: z.boolean().optional(),
    domicilio: z.string().optional(),
    colonia: z.string().optional(),
    estado: z.string().optional(),
    ciudad: z.string().optional(),
    celular: z.string().optional(),
    email2: z.string().optional(),
    //limite_credito: z.string().optional(),
    // descuento_default: z.string().optional(),
    // dias_credito: z.string().optional(),
    alertaId: z.number().optional(),
    facturar: z.boolean().optional(),
    retener_iva: z.boolean().optional(),
    retener_isr: z.boolean().optional(),
    porcentaje_retencion_iva: z.number().optional(),
    porcentaje_retencion_isr: z.number().optional(),
    metodo_pago: z.string().min(1, "El método de pago es obligatorio").optional(),
    id_forma_pago: z.number().optional(),
    fecha_registro: z.string().optional(),
    enviar_cobranza: z.boolean().optional(),
    nombreComercial: z.string().optional(),
    fecha_final: z.string().optional(),
    id_regimen_fiscal: z.number().optional(),
    id_uso_cfdi: z.number().optional(),
    password: z
    .string()
    .regex(passwordRegex, {
      message:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    }).optional(),
  password2: z.string().regex(passwordRegex, {
    message:
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
  }).optional(),
    limite_credito: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    descuento_default: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),
    dias_credito: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()),

  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Las contraseñas no coinciden",
  });

export const OperacionesFormulario = () => {
  
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as clienteInterface;
    
    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      rfc: valores.rfc,
      cp: valores.cp,
      tiposClienteId: valores.tiposClienteId,
      domicilio: valores.domicilio,
      colonia: valores.colonia,
      estado: valores.estado,
      ciudad: valores.ciudad,
      telefono: valores.telefono,
      celular: valores.celular,
      email: valores.email,
      email2: valores.email2,
      limite_credito: valores.limite_credito,
      descuento_default: valores.descuento_default,
      dias_credito: valores.dias_credito,
      alertaId: valores.alertaId,
      curp: valores.curp,
      facturar: valores.facturar,
      retener_iva: valores.retener_iva,
      retener_isr: valores.retener_isr,
      porcentaje_retencion_iva: valores.porcentaje_retencion_iva,
      porcentaje_retencion_isr: valores.porcentaje_retencion_isr,
      metodo_pago: valores.metodo_pago,
      id_forma_pago: valores.id_forma_pago,
      fecha_registro: valores.fecha_registro,
      enviar_cobranza: valores.enviar_cobranza,
      nombreComercial: valores.nombreComercial,
      fecha_final: valores.fecha_final,
      activo : valores.activo,
      id_regimen_fiscal: valores.id_regimen_fiscal,
      id_uso_cfdi: valores.id_uso_cfdi,
      password : valores.password,
      Servicios: valores.Servicios,
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/clientes/create",
        valoresForm
      );

      if (response.data.isSuccess) 
      {
        console.log("Creando usuario en firebase");
        await createUser(valores.email);
      }


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
    const valores = values.values as clienteInterface;
    
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      rfc: valores.rfc,
      cp: valores.cp,
      tiposClienteId: valores.tiposClienteId,
      domicilio: valores.domicilio,
      colonia: valores.colonia,
      estado: valores.estado,
      ciudad: valores.ciudad,
      telefono: valores.telefono,
      celular: valores.celular,
      email: valores.email,
      email2: valores.email2,
      limite_credito: valores.limite_credito,
      descuento_default: valores.descuento_default,
      dias_credito: valores.dias_credito,
      alertaId: valores.alertaId,
      curp: valores.curp,
      facturar: valores.facturar,
      retener_iva: valores.retener_iva,
      retener_isr: valores.retener_isr,
      porcentaje_retencion_iva: valores.porcentaje_retencion_iva,
      porcentaje_retencion_isr: valores.porcentaje_retencion_isr,
      metodo_pago: valores.metodo_pago,
      id_forma_pago: valores.id_forma_pago,
      fecha_registro: valores.fecha_registro,
      enviar_cobranza: valores.enviar_cobranza,
      nombreComercial: valores.nombreComercial,
      fecha_final: valores.fecha_final,
      activo : valores.activo,
      id_regimen_fiscal: valores.id_regimen_fiscal,
      id_uso_cfdi: valores.id_uso_cfdi,
      password : valores.password,
      Servicios: valores.Servicios,
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/clientes/update", {
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
 
  const alertas =useAppSelector((state: RootState) => state.page.slots.ALERTAS as alertasInterface[]) ;
  const cfdi =useAppSelector((state: RootState) => state.page.slots.CFDI as datosSATInterface[]) ;
  const formasPago =useAppSelector((state: RootState) => state.page.slots.FORMASPAGO as datosSATInterface[]) ;
  const regimen =useAppSelector((state: RootState) => state.page.slots.REGIMEN as datosSATInterface[] );
  const tipoCliente =useAppSelector((state: RootState) => state.page.slots.TIPOS_CLIENTES as tipoClientes[]) ;
  const servicios =useAppSelector((state: RootState) => state.page.slots.SERVICIOS as serviciosInterface[]) ;

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      nombre: dataModal.nombre,
      rfc: dataModal.rfc,
      cp: dataModal.cp,
      tiposClienteId: dataModal.tiposClienteId,
      domicilio: dataModal.domicilio,
      colonia: dataModal.colonia,
      estado: dataModal.estado,
      ciudad: dataModal.ciudad,
      telefono: dataModal.telefono,
      celular: dataModal.celular,
      email: dataModal.email,
      email2: dataModal.email2,
      limite_credito: dataModal.limite_credito,
      descuento_default: dataModal.descuento_default,
      dias_credito: dataModal.dias_credito,
      alertaId: dataModal.alertaId,
      curp: dataModal.curp,
      facturar: dataModal.facturar,
      retener_iva: dataModal.retener_iva,
      retener_isr: dataModal.retener_isr,
      porcentaje_retencion_iva: dataModal.porcentaje_retencion_iva,
      porcentaje_retencion_isr: dataModal.porcentaje_retencion_isr,
      metodo_pago: dataModal.metodo_pago,
      id_forma_pago: dataModal.id_forma_pago,
      fecha_registro: dataModal.fecha_registro,
      enviar_cobranza: dataModal.enviar_cobranza,
      nombreComercial: dataModal.nombreComercial,
      fecha_final: dataModal.fecha_final,
      activo : dataModal.activo,
      id_regimen_fiscal: dataModal.id_regimen_fiscal,
      id_uso_cfdi: dataModal.id_uso_cfdi,
      password : dataModal.password,
      Servicios: dataModal.Servicios,
    },
  });

  const metodosPago = [
    { clave: "PPD", descripcion: "Pago en parcialidades o diferido" },
    { clave: "PUE", descripcion: "Pago en una sola exhibición" },
  ];

  const { control, setValue, getValues } = generalForm;
  const [selectedItems, setSelectedItems] = useState<serviciosInterface[]>([]);
  const handleSelectItem = (item: serviciosInterface) => {
    const servicios = getValues("Servicios") || [];

    if (!selectedItems.some((s) => s.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      setValue("Servicios", []);
      setValue("Servicios", [...servicios, item]);
    }
  };


  useEffect(() => {
    if (dataModal.clientesServicios && dataModal.clientesServicios.length > 0) {
     
      const nuevosServicios = dataModal.clientesServicios
        .filter((item: any) => !selectedItems.some((s) => s.id === item.id))
        .map((item: any) => item.servicio); 
        
      if (nuevosServicios.length > 0 && selectedItems.length === 0) {
        const updatedItems = [...selectedItems, ...nuevosServicios];
        const uniqueItems = Array.from(new Map(updatedItems.map(item => [item.id, item])).values());

        setSelectedItems(uniqueItems);
  
        setValue("Servicios", uniqueItems);
      }
    }
  }, []);  


  return (

        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)} >
            <Card className="h-[380px] w-full overflow-y-auto">
        
            <Tabs defaultValue="general" className="w-full gap-3">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Datos generales</TabsTrigger>
              <TabsTrigger value="domicilio">Datos del domicilio</TabsTrigger>
              <TabsTrigger value="fiscales">Datos fiscales</TabsTrigger>
              <TabsTrigger value="ingreso">Datos de ingreso</TabsTrigger>
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
            </TabsList>

            <TabsContent value="general">

            <CardContent className="relative grid grid-cols-5 gap-3 py-3">
                    <FormField
                      control={generalForm.control}
                      name="facturar"
                      render={({ field }) => (
                        <div className="flex space-x-2 items-top">
                          <Checkbox
                            id="facturar"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="facturar" className="text-xs font-medium leading-none">
                              Facturar
                            </label>
                          </div>
                        </div>
                      )}
                    /> 

                    <FormField
                      control={generalForm.control}
                      name="retener_iva"
                      render={({ field }) => (
                        <div className="flex space-x-2 items-top">
                          <Checkbox
                            id="retener_iva"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="retener_iva" className="text-xs font-medium leading-none">
                              Retener IVA
                            </label>
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="retener_isr"
                      render={({ field }) => (
                        <div className="flex space-x-2 items-top">
                          <Checkbox
                            id="retener_isr"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="retener_isr" className="text-xs font-medium leading-none">
                              Retener ISR
                            </label>
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="enviar_cobranza"
                      render={({ field }) => (
                        <div className="flex space-x-2 items-top">
                          <Checkbox
                            id="enviar_cobranza"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="enviar_cobranza" className="text-xs font-medium leading-none">
                              Enviar cobranza
                            </label>
                          </div>
                        </div>
                      )}
                    />

                    {dataModal.id !== undefined && (
                        <FormField
                          control={generalForm.control}
                          name="activo"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 place-self-end">
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
                        />
                      )}
              </CardContent>

              <CardContent className="relative grid grid-cols-2 gap-3 py-3"> {/* Ajusta el padding vertical */} 
        
              <FormInput
                form={generalForm}
                name="nombre"
                label="Nombre"
                placeholder=""
                className=""
              />
                      
              <FormInput
                form={generalForm}
                name="nombreComercial"
                label="Nombre comercial"
                type="text"
                  className=""
              />

               </CardContent>
              
              <CardContent className="relative grid grid-cols-3 gap-3">

              <FormInput
                form={generalForm}
                name="rfc"
                label="RFC"
                type="text"
              />

              <FormInput
                form={generalForm}
                name="curp"
                label="CURP"
                placeholder=""
                type="text"
              />

                <FormInput
                  form={generalForm}
                  name="telefono"
                  label="Teléfono"
                  placeholder=""
                  type="number"
                />

              <FormInput
                  form={generalForm}
                  name="celular"
                  label="Celular"
                  placeholder=""
                  type="number"
                />

              <FormInput
                  form={generalForm}
                  name="email2"
                  label="Correo (para envio de facturas)"
                  placeholder=""
                  type="email"
                />

                {dataModal.id !== undefined && generalForm.getValues("activo") == false && (
                  <FormDatepicker
                      form={generalForm}
                      name="fecha_final"
                      label="Fecha final"
                    />
                )}


              </CardContent>

            </TabsContent>

            <TabsContent value="domicilio">
            <CardContent className="relative grid grid-cols-3 gap-3">

            <FormInput
                form={generalForm}
                name="cp"
                label="Código Postal"
                placeholder=""
                type="number"
              />

              <FormInput
                form={generalForm}
                name="domicilio"
                label="Domicilio"
                placeholder=""
                type="text"
              />

              <FormInput
                form={generalForm}
                name="colonia"
                label="Colonia"
                placeholder=""
              />

              <FormInput
                form={generalForm}
                name="estado"
                label="Estado"
                placeholder=""
              />

              <FormInput
                form={generalForm}
                name="ciudad"
                label="Ciudad"
                placeholder=""
              />
              
            </CardContent>
            </TabsContent>

            <TabsContent value="fiscales">
             <CardContent className="relative grid grid-cols-3 gap-3">
              
                <FormInput
                  form={generalForm}
                  name="limite_credito"
                  label="Límite de crédito"
                  placeholder=""
                  type="number"
                 
                />

                <FormInput
                  form={generalForm}
                  name="descuento_default"
                  label="Dto. Default %"
                  placeholder=""
                  type="number"
                  
                />

                <FormInput
                  form={generalForm}
                  name="dias_credito"
                  label="Días de crédito"
                  placeholder=""
                  type="number"
                />
               
              <div>
              <FormLabel className="text-xs">Regimen Fiscal</FormLabel>
              <Select name="id_regimen_fiscal" onValueChange={(value) => generalForm.setValue("id_regimen_fiscal", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    regimen && regimen.length > 0
                      ? regimen.find((x) => x.id === generalForm.watch("id_regimen_fiscal"))
                          ?.descripcion || "Selecciona un régimen fiscal"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {regimen && regimen.map((item: { id: number; descripcion: string; clave: string  }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.clave}- {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Uso de CFDI</FormLabel>
              <Select name="id_uso_cfdi" onValueChange={(value) => generalForm.setValue("id_uso_cfdi", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    cfdi && cfdi.length > 0
                      ? cfdi.find((x) => x.id === generalForm.watch("id_uso_cfdi"))
                          ?.descripcion || "Selecciona un cfdi "
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {cfdi && cfdi.map((item: { id: number; descripcion: string ;clave: string}) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.clave}- {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Tipo de cliente</FormLabel>
              <Select name="tiposClienteId" onValueChange={(value) => generalForm.setValue("tiposClienteId", parseInt(value))}>
              <SelectTrigger >
              <SelectValue
                  placeholder={
                    tipoCliente && tipoCliente.length > 0
                      ? tipoCliente.find((x) => x.id === generalForm.watch("tiposClienteId"))
                          ?.descripcion || "Selecciona un tipo de cliente"
                      : "Cargando..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tipoCliente && tipoCliente.map((item: { id: number; descripcion: string }) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Método de pago </FormLabel>
              <Select name="metodo_pago" onValueChange={(value) => generalForm.setValue("metodo_pago", value)}>
                <SelectTrigger>
                <SelectValue
                placeholder={
                  metodosPago.find((metodo) => metodo.clave === generalForm.watch("metodo_pago"))
                    ?.descripcion || "Selecciona un método de pago"
                }/>
                </SelectTrigger>
                <SelectContent>
                {metodosPago.map((metodo) => (
                  <SelectItem key={metodo.clave} value={metodo.clave}>
                    {metodo.descripcion}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Alerta </FormLabel>
              <Select name="alertaId" onValueChange={(value) => generalForm.setValue("alertaId", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    alertas && alertas.length > 0
                      ? alertas.find((x) => x.id === generalForm.watch("alertaId"))
                          ?.descripcion || "Selecciona una alerta"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {alertas && alertas.map((item: { id: number; descripcion: string }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>

              <div>
              <FormLabel className="text-xs">Forma de pago  </FormLabel>
              <Select name="id_forma_pago" onValueChange={(value) => generalForm.setValue("id_forma_pago", parseInt(value))}>
                <SelectTrigger >
                <SelectValue
                  placeholder={
                    formasPago && formasPago.length > 0
                      ? formasPago.find((x) => x.id === generalForm.watch("id_forma_pago"))
                          ?.descripcion || "Selecciona una forma de pago"
                      : "Cargando..."
                  }
                />
                </SelectTrigger>
                <SelectContent>
                    {formasPago && formasPago.map((item: { id: number; descripcion: string; clave:string }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                        {item.clave}- {item.descripcion}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="ingreso">
            <CardContent className="relative grid grid-cols-3 gap-3">
            {dataModal.id === undefined && (<>
              <FormInput
                  form={generalForm}
                  name="email"
                  label="Correo para ingresar al sistema"
                  placeholder=""
                  type="email"
                />              </>)}

                <FormInput
                  form={generalForm}
                  name="password"
                  label="Ingrese una contraseña"
                  placeholder=""
                  type="password"
                />

                <FormInput
                  form={generalForm}
                  name="password2"
                  label="Confirme la contraseña"
                  placeholder=""
                  type="password"
                />


            </CardContent>
            </TabsContent>

            <TabsContent value="servicios">
            <CardContent className="relative grid grid-cols-1 gap-3 py-3">
              {servicios &&  (
                  <SelectGrid
                  items={servicios}
                  labelKey="descripcion"
                  valueKey="id"
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onSelect={handleSelectItem}
                  titulo={"Servicios"}
                  getValues={getValues}
                  setValue={setValue}
                />
              )}
              </CardContent>

              <div className="absolute bottom-0 right-0 p-4">
                <FormFooter handleCreateItemClose={handleCreateItemClose} form={generalForm} dataModal={dataModal} />
              </div>
            </TabsContent>

            </Tabs>
            </Card>
          </form>
        </Form>
  );
};


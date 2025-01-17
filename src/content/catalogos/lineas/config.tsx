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
import { clienteInterface } from "@/interfaces/catalogos/clienteInterface";
import { act } from "react";

const phoneRegExp = /^\d{10}$/;

const validationSchema = z
  .object({
    nombre: z.string().max(120).min(1, "El nombre es un dato requerido"),
    apellido: z.string().max(120).min(1, "El apellido es un dato requerido"),
    telefono: z
      .string()
      .max(10)
      .min(1, "El teléfono es un dato requerido")
      .regex(phoneRegExp, "El teléfono debe ser de 10 dígitos"),
    email: z
      .string()
      .max(120)
      .min(1, "El correo es un dato requerido")
      .email("El correo no es válido"),
    activo: z.boolean(),
  })

const validationSegSchema = z
  .object({
    password: z
      .string()
      .max(255)
      .min(6, "La contraseña debe de tener al menos 6 caracteres"),
    confirmPassword: z.string().max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as clienteInterface;
    // const userRol = values.globalState.ROL;

    const valoresForm = {
      id : valores.id,
      id_empresa: idEmpresa,
      nombre: valores.nombre,
      rfc: valores.rfc,
      cp: valores.cp,
      id_tipo_cliente: valores.id_tipo_cliente,
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
      id_alerta: valores.id_alerta,
      curp: valores.curp,
      factura: valores.factura,
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
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/user/create",
        valoresForm
      );

      console.log(response.data);

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
    // const userRol = values.globalState.ROL;

    const valoresForm = {
      id : valores.id,
      id_empresa: idEmpresa,
      nombre: valores.nombre,
      rfc: valores.rfc,
      cp: valores.cp,
      id_tipo_cliente: valores.id_tipo_cliente,
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
      id_alerta: valores.id_alerta,
      curp: valores.curp,
      factura: valores.factura,
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
      
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/user/update", {
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

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
  
      
    },
  });

  const seguridadForm = useForm<z.infer<typeof validationSegSchema>>({
    resolver: zodResolver(validationSegSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleUpdatePass: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async (values) => {
    if (values.password === values.confirmPassword) {
      const response = await axios.post<ResponseInterface>(
        `api/user/updatepassautorizacion/${encrypt(values.password)}`
      );

      if (response.data.isSuccess) {
        handleCreateItemClose();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      {/* <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        {isEditing && <TabsTrigger value="seguridad">Seguridad</TabsTrigger>}
      </TabsList> */}
      <TabsContent value="general">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="max-h-[50dvh] overflow-y-auto">
              {/* <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Agrega o actualiza la información del cliente.
                </CardDescription>
              </CardHeader> */}
              <CardContent className="relative grid grid-cols-1 gap-2">
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
                <FormInput
                  form={generalForm}
                  name="nombre"
                  label="Nombre"
                  placeholder="Ej. Pedro"
                  required
                />

            <FormInput
                  form={generalForm}
                  name="nombreComercial"
                  label="Nombre comercial"
                  placeholder="Ej. Pedro"
                  required
                />

                <FormInput
                  form={generalForm}
                  name="rfc"
                  label="RFC"
                  placeholder="Ej. Pérez"
                  required
                />
                <FormInput
                  form={generalForm}
                  name="curp"
                  label="CURP"
                  placeholder=""
                  required
                />
                <FormInput
                  form={generalForm}
                  name="CP"
                  label="Código Postal"
                  placeholder=""
                  required
                />

<FormInput
                  form={generalForm}
                  name="CP"
                  label="REGIMEN FISCAL"
                  placeholder=""
                  required
                />

<FormInput
                  form={generalForm}
                  name="CP"
                  label="USO DE CFDI"
                  placeholder=""
                  required
                />

<FormInput
                  form={generalForm}
                  name="CP"
                  label="TIPO CLIENTE"
                  placeholder=""
                  required
                />

                <FormInput
                  form={generalForm}
                  name="curp"
                  label="Cupr"
                  placeholder="Ej. correo@email.com"
                  type="email"
                  required
                />
                <FormInput
                  form={generalForm}
                  name="telefono"
                  label="Teléfono"
                  placeholder="Ej. 1234567890"
                  required
                />

                {dataModal.id === undefined && (
                  <>
                    <FormInput
                      form={generalForm}
                      name="password"
                      label="Contraseña"
                      placeholder="********"
                      required
                      type="password"
                    />
                    <FormInput
                      form={generalForm}
                      name="confirmPassword"
                      label="Confirmar Contraseña"
                      placeholder="********"
                      required
                      type="password"
                    />
                  </>
                )}

                <ComboboxForm
                  label="Rol de Usuario"
                  tipo="ROL"
                  name="userRol"
                  form={generalForm}
                />
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
      <TabsContent value="seguridad">
        <Form {...seguridadForm}>
          <form onSubmit={seguridadForm.handleSubmit(handleUpdatePass)}>
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Actualiza la contraseña del usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormInput
                  form={seguridadForm}
                  name="password"
                  label="Contraseña"
                  placeholder="********"
                  required
                  type="password"
                />
                <FormInput
                  form={seguridadForm}
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  placeholder="********"
                  required
                  type="password"
                />
              </CardContent>
              <FormFooter
                handleCreateItemClose={handleCreateItemClose}
                form={seguridadForm}
                dataModal={dataModal}
              />
            </Card>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

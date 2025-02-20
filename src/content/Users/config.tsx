import * as z from "zod";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { UsuarioAdicionalesInterface } from "@/interfaces/UsuarioAdicionalesInterface";
import { useEffect, useState } from "react";


export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as UsuarioAdicionalesInterface;
    // const userRol = values.globalState.ROL;

    const valoresForm = {
      email: valores.email,
      nombre: valores.nombre,
      apellido: valores.apellido,
      password: valores.password,
      userRoll: valores.userRol,
      empresaId: idEmpresa,
      telefono: valores.telefono,
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
    const valores = values.values as UsuarioAdicionalesInterface;
    // const userRol = values.globalState.ROL;

    const valoresForm = {
      email: valores.email,
      nombre: valores.nombre,
      apellido: valores.apellido,
      password: valores.password,
      userRoll: valores.userRol,
      empresaId: idEmpresa,
      telefono: valores.telefono,
      activo: valores.activo,
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

  
const phoneRegExp = /^\d{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
      password: isEditing
      ? z.string().optional() // No es obligatorio si `isEditing` es true
      : z
          .string()
          .min(8, "La contraseña debe tener al menos 8 caracteres")
          .regex(passwordRegex, {
            message:
              "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
          }),
    confirmPassword: z.string().optional(),
    userRol: z.string().max(120).min(1, "El rol es un dato requerido"),
    activo: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

const validationSegSchema = z
  .object({
    password: z
      .string()
      .max(255)
      .min(6, "La contraseña debe de tener al menos 6 caracteres")
      .regex(passwordRegex, {
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
      }),
    confirmPassword: z.string().max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });
  
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      activo: dataModal.id !== undefined ? dataModal.activo : true,
      email: dataModal.email || "",
      nombre: dataModal.nombre || "",
      apellido: dataModal.apellido || "",
      telefono: dataModal.telefono || "",
      userRol: dataModal.userRoll || "",
      password: "",
      confirmPassword: "",
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
      const encodedPass = encodeURIComponent(btoa(values.password));
      const response = await axios.post<ResponseInterface>(
        `api/user/updatepassautorizacion/${encodedPass}`
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


  //console.log(isEditing); 

  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        {isEditing && <TabsTrigger value="seguridad">Seguridad</TabsTrigger>}
      </TabsList>
      <TabsContent value="general">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="max-h-[50dvh] overflow-y-auto">
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Agrega o actualiza la información del usuario.
                </CardDescription>
              </CardHeader>
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
                  name="apellido"
                  label="Apellido"
                  placeholder="Ej. Pérez"
                  required
                />
                <FormInput
                  form={generalForm}
                  name="email"
                  label="Correo Electrónico"
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

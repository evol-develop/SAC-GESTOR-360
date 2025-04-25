import * as z from "zod";
import { toast } from "sonner";
import { Card,CardContent} from "@/components/ui/card";
import {Form,FormControl,FormField,FormItem,FormLabel,} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import FormInput from "@/components/form-base";
import { Switch } from "@/components/ui/switch";
import FormFooter from "@/components/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsFormulario } from "@/interfaces/formInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SubmitHandler, useForm } from "react-hook-form";
//import { eventosInterface } from "@/interfaces/catalogos/clientesEventosInterface";


const validationSchema = z
  .object({
    nombre: z.string().max(120).min(1, "El nombre es un dato requerido"),
    activo: z.boolean().optional(),
  })



export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as any;
    

    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/eventos/create",
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
    const valores = values.values as any;
  
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/eventos/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar la alerta`;
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

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      nombre: dataModal.nombre,
      activo: dataModal.activo,
    },
  });


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
                  label="Nombre del evento"
                  placeholder=""
                  required
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

    </Tabs>
  );
};

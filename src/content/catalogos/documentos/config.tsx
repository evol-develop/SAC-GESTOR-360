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
import {alertasInterface} from "@/interfaces/catalogos/alertasInterface";
import { SubmitHandler, useForm } from "react-hook-form";


const validationSchema = z
  .object({
    descripcion: z.string().max(120).min(1, "El nombre es un dato requerido"),
    activo: z.boolean().optional(),
  })



export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as alertasInterface;
    

    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/documentos/create",
        valoresForm
      );


      return response.data;
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al crear el documento");
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as alertasInterface;
  
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/documentos/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar el documento`;
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
     descripcion: dataModal.descripcion,
      activo: dataModal.activo,
    },
  });


  return (
    <Tabs defaultValue="general" className="w-full">
      {/* <TabsList className="grid grid-cols-2 w-full">
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
              <CardContent className="grid relative grid-cols-1 gap-2">
                {dataModal.id !== undefined && (
                  <FormField
                    control={generalForm.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-center place-self-end">
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
                  name="descripcion"
                  label="Descripción"
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

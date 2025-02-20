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
import { sublineasInterface } from "@/interfaces/catalogos/sublineasInterface";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { lineasInterface } from "@/interfaces/catalogos/lineasInterface";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";

const validationSchema = z
  .object({
    descripcion: z.string().max(120).min(1, "El nombre es un dato requerido"),
    activo: z.boolean().optional(),
    lineaId: z.number(),
  })



export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as sublineasInterface;
    

    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      lineaId: valores.lineaId,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/sublineas/create",
        valoresForm
      );


      return response.data;
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al guardar la sublínea");
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as sublineasInterface;
  
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      lineaId: valores.lineaId,
      descripcion: valores.descripcion,
      activo: valores.activo,
      
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/sublineas/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar la sublinea`;
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

  const lineas =useAppSelector((state: RootState) => state.page.slots.LINEAS as lineasInterface[]) ;


  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
     descripcion: dataModal.descripcion,
      activo: dataModal.activo,
      lineaId: dataModal.lineaId,
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
                  name="descripcion"
                  label="Descripción"
                  placeholder=""
                  required
                />

              <div>
                <FormLabel className="text-xs">Lineas</FormLabel>
                <Select name="lineaId" onValueChange={(value) => generalForm.setValue("lineaId", parseInt(value))}>
                <SelectTrigger className="w-72">
                <SelectValue
                    placeholder={
                      lineas && lineas.length > 0
                        ? lineas.find((x) => x.id === generalForm.watch("lineaId"))
                            ?.descripcion || "Selecciona una línea"
                        : "Cargando..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {lineas && lineas.map((item: { id: number; descripcion: string }) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.descripcion}
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

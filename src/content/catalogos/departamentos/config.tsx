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
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import  SelectGrid  from "@/components/select";
import { useEffect, useState } from "react";
import { departamentoInterface } from "@/interfaces/catalogos/departamentoInterface";


const validationSchema = z
  .object({

    usuarios: z.array(z.object({ id: z.string(), fullName: z.string() })).optional(),
    nombre: z.string().min(1, "El nombre es un dato requerido").max(200),
  })

export const OperacionesFormulario = () => {
  
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as departamentoInterface;
    
    const valoresForm = {
      id : valores.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      
      usuarios: valores.usuarios,
    };

    console.log(valores);
    console.log(valoresForm);
    
    try {
      const response = await axios.post<ResponseInterface>(
        "/api/departamentos/create",
        valoresForm
      );

      return response.data;
    } catch (err) {
     
      console.error(err);
      throw new Error("Error al actualizar la informacion del departamento");
    }

  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as departamentoInterface;
    
    const valoresForm = {
      id : values.dataModal.id,
      empresaId: idEmpresa,
      nombre: valores.nombre,
      usuarios: valores.usuarios,
    };

    try {
      const response = await axios.post<ResponseInterface>("/api/departamentos/update", {
        ...valoresForm,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw `Error al actualizar la informacion del departamento`;
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
 
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[]) ;
  const usuariosFiltrados = usuarios.filter(user => user.userRoll !== "Cliente");

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      nombre: dataModal.nombre,
     
      usuarios: dataModal.usuarios,
    },
  });

  const { control, setValue, getValues } = generalForm;
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const handleSelectItem = (item: any) => {
    const servicios = getValues("usuarios") || [];

    console.log(servicios);

    if (!selectedItems.some((s) => s.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      setValue("usuarios", []);
      setValue("usuarios", [...servicios, item]);
    }
  };


  


  useEffect(() => {
    if (dataModal.departamentosUsuarios && dataModal.departamentosUsuarios.length > 0) {
     
      const nuevosServicios = dataModal.departamentosUsuarios
        .filter((item: any) => !selectedItems.some((s) => s.id === item.id))
        .map((item: any) => item.user); 
        
      if (nuevosServicios.length > 0 && selectedItems.length === 0) {
        const updatedItems = [...selectedItems, ...nuevosServicios];
        const uniqueItems = Array.from(new Map(updatedItems.map(item => [item.id, item])).values());

        setSelectedItems(uniqueItems);
  
        setValue("usuarios", uniqueItems);
      }
    }
  }, []);  

   //console.log(usuarios)

  const handleSubmit = (data: any) => {

  }

  const onError = (errores:any) => {
    console.error(errores)
  }

  return (

        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)} >
            <Card className="h-[380px] w-full overflow-y-auto">
        
            <Tabs defaultValue="general" className="w-full gap-3">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Datos generales</TabsTrigger>
         
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            </TabsList>

            <TabsContent value="general">

              <CardContent className="relative grid grid-cols-2 gap-3 py-3"> {/* Ajusta el padding vertical */} 
        
              <FormInput
                form={generalForm}
                name="nombre"
                label="Nombre"
              />
                      
               </CardContent>
              

            </TabsContent>

           

            <TabsContent value="usuarios">
            <CardContent className="relative grid grid-cols-1 gap-3 py-3">
              {usuariosFiltrados &&  (
                  <SelectGrid
                  items={usuariosFiltrados}
                  labelKey="fullName"
                  valueKey="id"
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onSelect={handleSelectItem}
                  titulo={"usuarios"}
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


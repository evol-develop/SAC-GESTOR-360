import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { LuCirclePlus, LuLoaderCircle } from "react-icons/lu";
import {Form,FormControl,FormField,FormItem,FormLabel,} from "@/components/ui/form";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import axios from "@/lib/utils/axios";
import { PAGE_SLOT } from "./constants";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { createUser } from "@/api/authApi";
import { Input } from "@/components/ui/input";
import DocumentosList from "./DocumentosList";
import FormInput from "@/components/form-base";
import { uploadImage } from "@/api/storageApi";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createSlot } from "@/store/slices/page";
import FormFooter from "@/components/form-footer";
import { IMAGE_SCHEMA } from "@/lib/utils/docType";
import { Checkbox } from "@/components/ui/checkbox";
import { CropImage } from "@/components/crop-image";
import { useAppSelector } from "@/hooks/storeHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { PropsFormulario } from "@/interfaces/formInterface";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { ComboboxControlado } from "@/components/controlled-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const phoneRegExp = /^\d{10}$/;

const validationSchema = z.object({
  isActive: z.boolean(),
  nombre: z.string().max(120).min(1, "El nombre es un dato requerido"),
  pictureURL: IMAGE_SCHEMA,
  nombreCorto: z
    .string()
    .max(120)
    .min(1, "El nombre corto es un dato requerido"),
  representante: z
    .string()
    .max(120)
    .min(1, "El/la representante es un dato requerido"),
  telefono: z
    .string()
    .max(10)
    .min(1, "El teléfono es un dato requerido")
    .regex(phoneRegExp, "El teléfono debe ser de 10 dígitos"),
  correo: z.string().max(120).min(1, "El correo es un dato requerido"),
  direccion: z.string().max(120).min(1, "La dirección es un dato requerido"),
});

export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as EmpresaInterface;
    valores.isActive = true;

    if (valores.pictureURL !== "" && valores.pictureURL instanceof File) {
      try {
        const uploaded = await uploadImage(valores.pictureURL, "EMPRESAS");
        valores.pictureURL = uploaded;
      } catch (error) {
        console.error(error);
      }
    } else {
      delete valores.pictureURL;
    }

    const response = await axios.post<ResponseInterface>(
      "api/empresas/PostEmpresa",
      valores
    );

    if (response.data.isSuccess) await createUser(valores.correo);

    return response.data;
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<ResponseInterface> => {
    const clasificacion = values.globalState.EMPRESAS;
    const valores = values.values as EmpresaInterface;

    const item = {
      ...valores,
      clasificacion: clasificacion,
      id: values.dataModal.id,
    };

    if (item.pictureURL !== "" && item.pictureURL instanceof File) {
      try {
        const uploaded = await uploadImage(item.pictureURL, "EMPRESAS");
        item.pictureURL = uploaded;
      } catch (error) {
        console.error(error);
      }
    } else {
      delete item.pictureURL;
    }

    const response = await axios.put<ResponseInterface>(
      "api/empresas/PutEmpresa",
      item
    );

    return response.data;
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
  const { dispatch } = usePage(PAGE_SLOT);
  const isEditing = useAppSelector((state: RootState) => state.page.isEditing);
  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);
  const DocumentosRelacionados = useAppSelector(
    (state: RootState) => state.page.slots.DOCUMENTOSRELACIONADOS
  );
  const EmpresaSeleccionada = useAppSelector(
    (state: RootState) => state.page.dataModal
  );

  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>("");

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      isActive: dataModal.id !== undefined ? dataModal.isActive : true,
      nombre: dataModal.nombre || "",
      pictureURL: dataModal.pictureURL || "",
      nombreCorto: dataModal.nombreCorto || "",
      representante: dataModal.representante || "",
      telefono: dataModal.telefono || "",
      correo: dataModal.correo || "",
      direccion: dataModal.direccion || "",
    },
  });

  const handleAddDocument = async () => {
    if (!reporteSeleccionado) {
      toast.warning("Selecciona un reporte");
      return;
    }

    const existe = DocumentosRelacionados.find(
      (x: any) => x.id.toString() === reporteSeleccionado
    );

    if (existe) {
      toast.warning("El reporte ya esta relacionado");
      return;
    }

    const response = await RelacionaReporteEmpresa();

    if (!response.data.isSuccess) {
      toast.error(response.data.message);
      return;
    }

    const newDocumentosRelacionados = [
      ...DocumentosRelacionados,
      response.data.result,
    ];

    dispatch(
      createSlot({
        DOCUMENTOSRELACIONADOS: newDocumentosRelacionados,
      })
    );
  };

  const RelacionaReporteEmpresa = async () => {
    const response = await axios.get<ResponseInterface>(
      `/api/documentos/relacionaReporte/${EmpresaSeleccionada.id}/${reporteSeleccionado}`,
      {
        headers: { "Content-Type": "application/text" },
      }
    );

    return response;
  };

  const GetDocumentosRelacionados = async () => {
    try {
      const response = await axios.get<ResponseInterface>(
        `/api/documentos/GetReportesRelacionados/${EmpresaSeleccionada.id}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      dispatch(
        createSlot({
          DOCUMENTOSRELACIONADOS: response.data.result,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        createSlot({
          DOCUMENTOSRELACIONADOS: [],
        })
      );
    }
  };

  useEffect(() => {
    if (EmpresaSeleccionada.id) {
      GetDocumentosRelacionados();
    }
  }, [EmpresaSeleccionada.id]);

  const [AgregandoReporte, setAgregandoReporte] = useState<CheckedState>(false);
  const [NuevoReporte, setNuevoReporte] = useState("");

  const handleAddReporte = async () => {
    const registro = {
      idEmpresa: EmpresaSeleccionada.id,
      descripcion: NuevoReporte,
    };

    const res = await axios.post<ResponseInterface>(
      "/api/documentos/CreateReporteEmpresa",
      registro
    );

    if (res.data.isSuccess) {
      toast.success("Reporte agregado");

      GetDocumentosRelacionados();
      setAgregandoReporte(false);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        {isEditing && <TabsTrigger value="reportes">Reportes</TabsTrigger>}
      </TabsList>
      <TabsContent value="general">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="max-h-[60dvh] overflow-y-auto">
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Agrega o actualiza la información del usuario.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                {dataModal.id !== undefined && (
                  <FormField
                    control={generalForm.control}
                    name="isActive"
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
                  placeholder="Ej. Empresa S.A. de C.V."
                  required
                />
                <CropImage
                  form={generalForm}
                  name="pictureURL"
                  setValue={generalForm.setValue}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    form={generalForm}
                    name="nombreCorto"
                    label="Nombre Corto"
                    placeholder="Ej. Empresa"
                    required
                  />
                  <FormInput
                    form={generalForm}
                    name="representante"
                    label="Representante"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    form={generalForm}
                    name="telefono"
                    label="Teléfono"
                    placeholder="Ej. 1234567890"
                    required
                  />
                  <FormInput
                    form={generalForm}
                    name="correo"
                    label="Correo Electrónico"
                    placeholder="Ej. correo@mail.com"
                    required
                  />
                </div>
                <FormInput
                  form={generalForm}
                  name="direccion"
                  label="Dirección"
                  placeholder="Ej. Calle 123, Colonia Centro, Ciudad, Estado"
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
      <TabsContent value="reportes">
        <Card className=" max-h-[60dvh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Reportes</CardTitle>
            <CardDescription>
              Agrega o actualiza los reportes relacionados a la empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <div className="flex space-x-2 items-top">
              <Checkbox
                id="agregaReporte"
                checked={AgregandoReporte}
                onCheckedChange={(checked) => {
                  setAgregandoReporte(checked);
                  setNuevoReporte("");
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="agregaReporte"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Agregar Reporte
                </label>
              </div>
            </div>
            {AgregandoReporte ? (
              <div className="flex items-center w-full space-x-2">
                <Input
                  id="descripcion"
                  placeholder="Descripción del reporte"
                  value={NuevoReporte}
                  onChange={(e) => setNuevoReporte(e.target.value)}
                />
                <Button
                  onClick={handleAddReporte}
                  variant="outline"
                  // size="sm"
                >
                  <LuCirclePlus className="mr-2" />
                  Agregar
                </Button>
              </div>
            ) : (
              <div className="flex items-center w-full space-x-2">
                <ComboboxControlado
                  tipo="ReporteEmpresa"
                  value={reporteSeleccionado}
                  setValue={setReporteSeleccionado}
                />
                <Button
                  onClick={handleAddDocument}
                  color="secondary"
                  variant="outline"
                  // size="sm"
                >
                  <LuCirclePlus className="mr-2" />
                  Agregar
                </Button>
              </div>
            )}
            {isLoading && <LuLoaderCircle className="animate-spin" />}
            <DocumentosList
              items={DocumentosRelacionados}
              puedeCargarComprobante={true}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

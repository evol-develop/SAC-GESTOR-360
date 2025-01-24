import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib/utils/axios";
import { PAGE_SLOT } from "./constants";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import {
  MenuByRolInterface,
  MenuInterface,
} from "@/interfaces/entidades/menuInterface";
import { Label } from "@/components/ui/label";
import FormInput from "@/components/form-base";
import { Switch } from "@/components/ui/switch";
import { createSlot } from "@/store/slices/page";
import FormFooter from "@/components/form-footer";
import { useAppSelector } from "@/hooks/storeHooks";
import { PropsFormulario } from "@/interfaces/formInterface";
import { RolInterface } from "@/interfaces/entidades/rolInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { AutorizacionByRolInterface } from "@/interfaces/autorizacionRol";

const validationSchema = z.object({
  activo: z.boolean(),
  nombre: z.string().min(1, "El nombre es requerido"),
  isAdmin: z.boolean(),
});

export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as RolInterface;

    const valoresForm = {
      nombre: valores.nombre,
      empresaId: idEmpresa,
      activo: valores.activo,
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/roles/create",
        {
          ...valoresForm,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al actualizar la informacion del rol");
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string | number
  ): Promise<any> => {
    const valores = values.values as RolInterface;

    const valoresForm = {
      id: values.dataModal.id,
      nombre: valores.nombre,
      empresaId: idEmpresa,
      activo: valores.activo,
    };

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/roles/update",
        {
          ...valoresForm,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al actualizar la informacion del rol");
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
  const ModalType = useAppSelector(
    (state: RootState) => state.page.slots.ModalType
  );

  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      activo: dataModal.id !== undefined ? dataModal.activo : true,
      nombre: dataModal.nombre || "",
      isAdmin: dataModal.isAdmin || false,
    },
  });

  return (
    <>
      {ModalType === PAGE_SLOT ? (
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmit)}>
            <Card className="max-h-[50dvh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  Agrega o actualiza la información del rol.
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
                  placeholder="Ej. Administrador"
                  required
                />
                <FormField
                  control={generalForm.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        {field.value
                          ? "Es Administrador"
                          : "No es Administrador"}
                      </FormLabel>
                    </FormItem>
                  )}
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
      ) : ModalType === "PERMISOS" ? (
        <Card className="max-h-[50dvh] overflow-y-auto">
          <CardContent className="relative grid grid-cols-1 gap-2 p-0">
            <GridMenu />
          </CardContent>
        </Card>
      ) : (
        <Card className="max-h-[50dvh] overflow-y-auto">
          <CardContent className="relative grid grid-cols-1 gap-2 p-0">
            <GridAutorizaciones />
          </CardContent>
        </Card>
      )}
    </>
  );
};

const GridMenu = () => {
  const { dispatch } = usePage(PAGE_SLOT);

  const CargaMenus = async () => {
    try {
      const response = await axios.get(
        `/api/roles/getmenubyrol/${RolSeleccionado.id}/ROLES`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      dispatch(
        createSlot({ MENUS: response.data.result as MenuByRolInterface[] })
      );

      dispatch(createSlot({ ModalType: "Permisos" }));
    } catch (err) {
      console.error(err);
    }
  };

  const RolSeleccionado: RolInterface = useAppSelector(
    (state: RootState) => state.page.slots.RolSeleccionado
  );

  const items: MenuInterface[] = useAppSelector(
    (state: RootState) => state.page.slots.MENUS
  );

  const handleChanguePermiso = async (item: MenuInterface) => {
    try {
      const response = await axios.post<ResponseInterface>(
        `/api/roles/cambiarpermiso/${RolSeleccionado.id}`,
        item
      );

      if (response.data.isSuccess) {
        CargaMenus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Opción</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items !== undefined &&
          items.map((item: any, index) => (
            <TableRow key={`${item.id} - ${index}`}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell align="center">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Switch
                          id="permiso"
                          checked={item.acceso || false}
                          onCheckedChange={() => handleChanguePermiso(item)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.acceso ? "Denegar" : "Permitir"}
                    </TooltipContent>
                  </Tooltip>
                  <Label htmlFor="permiso">{item.acceso ? "" : ""}</Label>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export const GridAutorizaciones = () => {
  const { dispatch } = usePage(PAGE_SLOT);

  const CargaAutorizaciones = async (id_rol: number) => {
    try {
      const response = await axios.get(
        `/api/autorizaciones/getautorizacionesbyrol/${id_rol}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      dispatch(
        createSlot({
          AutorizacionesByRol: response.data
            .result as AutorizacionByRolInterface[],
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const RolSeleccionado: RolInterface = useAppSelector(
    (state: RootState) => state.page.slots.RolSeleccionado
  );

  const items: AutorizacionByRolInterface[] = useAppSelector(
    (state: RootState) => state.page.slots.AutorizacionesByRol
  );

  const handleChanguePermisoAutorizacion = async (
    item: AutorizacionByRolInterface
  ) => {
    try {
      const response = await axios.post<ResponseInterface>(
        `/api/autorizaciones/cambiarpermisoautrizacion/${RolSeleccionado.id}`,
        {
          ...item,
        }
      );

      if (response.data.isSuccess) {
        await CargaAutorizaciones(RolSeleccionado.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Autorizaciones</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items !== undefined &&
          items.map((item: any, index) => (
            <TableRow key={`${item.id} - ${index}`}>
              <TableCell>{item.autorizacion.descripcion}</TableCell>
              <TableCell align="center">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Switch
                          id="permiso"
                          checked={item.activo || false}
                          onCheckedChange={() =>
                            handleChanguePermisoAutorizacion(item)
                          }
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.activo ? "Denegar" : "Permitir"}
                    </TooltipContent>
                  </Tooltip>
                  <Label htmlFor="permiso">{item.activo ? "" : ""}</Label>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

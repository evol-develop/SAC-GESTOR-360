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
import { clienteInterface, clienteNotasInterface } from "@/interfaces/catalogos/clienteInterface";
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
import { formatoAPI, zip_codes } from "@/interfaces/catalogos/formatoAPI";
import { toast } from "sonner";
//import { eventosInterface } from "@/interfaces/catalogos/eventosInterface";
import { clientesEventosInterface, eventoInterface } from "@/interfaces/catalogos/clientesEventosInterface";
import { useMemo } from "react";
import { usePage } from "@/hooks/usePage";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {LuLoaderCircle} from "react-icons/lu";
import { timeLineInterface } from "@/interfaces/timeLineInterface";
import {TimelineLayout} from "@/components/timeLine/timeline-layout";
import {createSlot, deleteSlot,addItemSlot} from "@/store/slices/page";
import { ModalGenerico } from "@/components/ModalGenerico";
import { id } from "date-fns/locale";
import { PAGE_SLOT, titulos } from "./constants";
import UserAvatar from "@/components/UserAvatar";
import { useAutorizacionesSecuenciales } from "@/components/Autorizar";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import { TooltipProvider } from "@/components/ui/tooltip";

const phoneRegExp = /^\d{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = z
  .object({
    Eventos: z.array(z.object({ id: z.number(), descripcion: z.string() })).optional(),
    Servicios: z.array(z.object({ id: z.number(), descripcion: z.string() })).optional(),
    nombre: z.string().min(1, "El nombre es un dato requerido").max(200),
    rfc: z.string().min(12, "El RFC debe tener 12 caracteres en personas morales").max(13, "El RFC debe tener 13 caracteres en personas fisicas").optional().nullable(),
    cp: z.string().min(5, "El código postal debe tener 5 dígitos").max(6, "El código postal debe tener 5 dígitos").optional().nullable(),
    telefono: z.string().min(10, "El teléfono debe ser de 10 dígitos").max(10).regex(phoneRegExp, "El teléfono debe ser de 10 dígitos").optional().nullable(),
    email: z.string().min(1, "El correo es un dato requerido").max(120).email("El correo no es válido").optional().nullable(),
    curp: z.string().length(18, "El CURP debe tener 18 caracteres").optional().nullable().optional(),
    tiposClienteId: z.number().optional().nullable(),
    activo: z.boolean().optional(),
    domicilio: z.string().optional().nullable(),
    colonia: z.string().optional().nullable(),
    estado: z.string().optional().nullable(),
    ciudad: z.string().optional().nullable(),
    celular: z.string().optional().nullable(),
    email2: z.string().optional().nullable(),
    //limite_credito: z.string().optional(),
    // descuento_default: z.string().optional(),
    // dias_credito: z.string().optional(),
    alertaId: z.number().optional().nullable(),
    facturar: z.boolean().optional(),
    retener_iva: z.boolean().optional(),
    retener_isr: z.boolean().optional(),
    porcentaje_retencion_iva: z.number().optional().nullable(),
    porcentaje_retencion_isr: z.number().optional().nullable(),
    id_metodo_pago: z.number().optional().nullable(),
    id_forma_pago: z.number().optional().nullable(),
    fecha_registro: z.string().optional().nullable(),
    enviar_cobranza: z.boolean().optional(),
    nombreComercial: z.string().optional().nullable(),
    fecha_final: z.string().optional().nullable(),
    id_regimen_fiscal: z.number().optional().nullable(),
    id_uso_cfdi: z.number().optional().nullable(),
  //   password: z
  //   .string()
  //   .regex(passwordRegex, {
  //     message:
  //       "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
  //   }).optional(),
  // password2: z.string().regex(passwordRegex, {
  //   message:
  //     "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
  // }).optional(),
    limite_credito: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()).nullable(),
    descuento_default: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()).nullable(),
    dias_credito: z
    .preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().optional()).nullable(),

  })
  // .refine((data) => data.password === data.password2, {
  //   path: ["password2"],
  //   message: "Las contraseñas no coinciden",
  // });

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

      if (response.data.isSuccess && valores.email != null) 
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
 
   const { dispatch } = usePage(); 
  const alertas =useAppSelector((state: RootState) => state.page.slots.ALERTAS as alertasInterface[]) ;
  const cfdi =useAppSelector((state: RootState) => state.page.slots.CFDI as datosSATInterface[]) ;
  const formasPago =useAppSelector((state: RootState) => state.page.slots.FormasPago as datosSATInterface[]) ;
  const metodosPago =useAppSelector((state: RootState) => state.page.slots.METODOSPAGO as datosSATInterface[]) ;
  const regimen =useAppSelector((state: RootState) => state.page.slots.REGIMEN as datosSATInterface[] );
  const tipoCliente =useAppSelector((state: RootState) => state.page.slots.TIPOS_CLIENTES as tipoClientes[]) ;
  const servicios =useAppSelector((state: RootState) => state.page.slots.SERVICIOS as serviciosInterface[]) ;
  const clienteId =useAppSelector((state: RootState) => state.page.dataModal.id as number );
  const eventosCliente =useAppSelector((state: RootState) => state.page.slots.EVENTOS_CLIENTE as clientesEventosInterface[]) ;
  const ticketsCliente =useAppSelector((state: RootState) => state.page.slots.TICKETS_CLIENTE as any[]) ;
  const clientesNotas =useAppSelector((state: RootState) => state.page.slots.NOTAS_CLIENTE as clienteNotasInterface[]) ;
    
  const [formatCLM, setformatCLM] = useState<any[]>([]);
  const [ timelineDataEventos, setTimelineDataEventos ] = useState<timeLineInterface[]>([]);
  const [ timelineDataMovimientos, setTimelineDataMovimientos ] = useState<timeLineInterface[]>([]);
  
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
      id_metodo_pago: dataModal.id_metodo_pago,
      id_forma_pago: dataModal.id_forma_pago,
      fecha_registro: dataModal.fecha_registro,
      enviar_cobranza: dataModal.enviar_cobranza,
      nombreComercial: dataModal.nombreComercial,
      fecha_final: dataModal.fecha_final,
      activo : dataModal.activo,
      id_regimen_fiscal: dataModal.id_regimen_fiscal,
      id_uso_cfdi: dataModal.id_uso_cfdi,
      // password : dataModal.password,
      Servicios: dataModal.Servicios,
    },
  });


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

    const onSubmit2: SubmitHandler<z.infer<typeof validationSchema>> = async (values) => {
      console.log(values);
  
      //onSubmit(values);
    }
  
    const onError = (errors: any) => {
      console.log(errors);
      //toast.error("Error al enviar el formulario");
    };
  
    async function changeCode(value: string) {
      try {
          const response = await axios.get<zip_codes>(`https://sepomex.icalialabs.com/api/v1/zip_codes?zip_code=${value}`);
  
          // Verifica si 'result' existe y contiene 'zip_codes'
          if (response.data && response.data.zip_codes) {
              const zipCodes = response.data.zip_codes as formatoAPI[];
              console.log(zipCodes);

              setformatCLM([]);

                zipCodes.map((item) => {
                    setformatCLM((prev) => [
                        ...prev, 
                        { label: `${item.d_asenta} ${item.d_ciudad} ${item.d_mnpio} `, value: `${item.d_asenta} -${item.d_ciudad} -${item.d_mnpio} ` }
                    ]);
                });
  
          }else
          {
            toast.error('No se encontraron datos para este CP');
          }
      } catch (err) {
          console.error(err);
      }
  }

  function llenarCampos(value: string) {
    const [colonia, ciudad, estado] = value.split(" -");
  
    generalForm.setValue("colonia", colonia || ""); 
    generalForm.setValue("ciudad", ciudad || ""); 
    generalForm.setValue("estado", estado || ""); 
  
  }

  function OpenModalAñadirEvento(item : any){
    dispatch(createSlot({ openModal: true }));
    dispatch(createSlot({ formulario: "evento" }));
  }

  // function OpenModalAñadirDocumento(item : any){
  //   dispatch(createSlot({ openModal: true }));
  //   dispatch(createSlot({ formulario: "documento" }));
  // }

  function OpenModalAñadirNota(item : any){
    dispatch(createSlot({ openModal: true }));
    dispatch(createSlot({ formulario: "nota" }));
  }
    
  useEffect(() => {
    if (eventosCliente && eventosCliente.length > 0) {
      const transformed = eventosCliente.map((evento) => ({
        id: evento.id.toString(), // transformamos el número a string si es necesario
        title: evento.evento.nombre,
        description: evento.comentario,
        time: new Date(evento.fecha_inicio).toISOString(), // puedes ajustar el formato si lo deseas
      }));
  
      setTimelineDataEventos(transformed);
    }
  }, [eventosCliente]);

  useEffect(() => {
    if (ticketsCliente && ticketsCliente.length > 0) {
      const transformed = ticketsCliente.map((item) => ({
        id: item.ticket.id.toString(),
        title: item.ticket.titulo,
        description: (
          <>
            <UserAvatar userId={item.ticket.userId} className="rounded-full size-6" withTooltip />
            <div>
              <a
                href={`/site/procesos/consultaTickets/mostrarArchivos/${item.ticket.id}/0`}
                className="text-blue-600 underline"
              >
                Ver ticket
              </a>
              <div className="mt-2 text-xs">
                <b>Estatus:</b> {item.ticketEstatus.nombre}
                <br />
                <b>Descripción:</b> {item.ticket.descripcion}
              </div>
            </div>
          </>
        ),
        
        time: new Date(item.ticket.fechaCrea).toISOString(),
      }));
      
      

    
      setTimelineDataMovimientos(transformed);
      //console.log(ticketsCliente[0]);
    }
  }, [ticketsCliente]);

  const CargaEventos = async () => {
    try {
      const response = await axios.get(
        `/api/clientes/getEventosByCliente/${clienteId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        const eventos = response.data.result as clientesEventosInterface[];
  
        dispatch(createSlot({ EVENTOS_CLIENTE: eventos }));
      }

    } catch (err) {
      console.error(err);
    }
  };

  const CargaTickets = async () => {
    try {
      const response = await axios.get(
        `/api/tickets/getTicketsByCliente/${dataModal.id}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        const tickets = response.data.result as clientesEventosInterface[];
  
        dispatch(createSlot({ TICKETS_CLIENTE: tickets }));
      }

    } catch (err) {
      console.error(err);
    }
  };
  
  const CargaNotas = async () => {
    try {
      const response = await axios.get(
        `/api/clientes/getNotasByCliente/${clienteId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        const notas = response.data.result as any[];
  
        dispatch(createSlot({ NOTAS_CLIENTE: notas }));
      }

    } catch (err) {
      console.error(err);
    }
  };
  
    useEffect(() => {
      if (clienteId) {
        CargaEventos();
        CargaNotas();
        CargaTickets();
      }
    }, [clienteId]);
    const {
      servicios: autorizadoServicios,
      notas: autorizadoNotas,
      eventos: autorizadoEventos,
      fiscales: autorizadoFiscales,
      documentos: autorizadoDocumentos,
      movimientos: autorizadoMovimientos,
    } = useAutorizacionesSecuenciales();
    console.log(autorizadoFiscales)
  return (

    <TooltipProvider>
      <Form {...generalForm}>
        <form onSubmit={generalForm.handleSubmit(onSubmit)} >
        <Card className="h-[600px] lg:h-[440px] w-full overflow-y-auto">

          <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col">
          <TabsList className="flex flex-wrap w-full h-full">
              <TabsTrigger value="general">Generales</TabsTrigger>
              <TabsTrigger value="domicilio">Domicilio</TabsTrigger>
              
              {autorizadoFiscales && <TabsTrigger value="fiscales">Datos fiscales</TabsTrigger>}
              {autorizadoServicios && <TabsTrigger value="servicios">Servicios</TabsTrigger>}

              {dataModal.id !== undefined &&(
              <>
                 {autorizadoDocumentos && <TabsTrigger value="documentos">Documentos</TabsTrigger>}
                 {autorizadoMovimientos && <TabsTrigger value="movimientos">Tickets </TabsTrigger>}
                {autorizadoNotas && <TabsTrigger value="notas">Notas</TabsTrigger>}
                {autorizadoEventos && <TabsTrigger value="eventos">Eventos</TabsTrigger>}
              </>
            )}
  
            </TabsList>

            <div className="flex-1">
              <TabsContent value="general">



                <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-3">


                  {dataModal.id !== undefined && (<>

                  
                    <FormDatepicker
                    form={generalForm}
                    name="fecha_registro"
                    label="Fecha de registro"
                  />

                {!generalForm.getValues("activo") && (
                    <FormDatepicker
                    form={generalForm}
                    name="fecha_final"
                    label="Fecha final"
                  />)}
                  


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
                    </>)}
                        
                      </CardContent>
                    <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">
          
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
                
                  <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">


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
                    name="email"
                    label="Correo (ingreso)"
                    placeholder=""
                    type="email"
                  />   
                  
                <FormInput
                    form={generalForm}
                    name="email2"
                    label="Correo (facturas)"
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
              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">

              <FormInput
                  form={generalForm}
                  name="domicilio"
                  label="Domicilio"
                  placeholder=""
                  type="text"
                />
                
              <FormInput
                form={generalForm}
                name="cp"
                label="Código Postal"
                placeholder=""
                onChange={(e) =>{
                  
                  // handleChange(e);

                  if(e.target.value.length === 5){
                    changeCode(e.target.value);
                  }
                }}
                type="number"
              />
                  
                <div>
                  <FormLabel className="text-xs">Ubicación </FormLabel>
                  <Select  onValueChange={(value) => llenarCampos(value)}>
                    <SelectTrigger>
                    <SelectValue
                    placeholder={"Selecciona una ubicación"
                    }/>
                    </SelectTrigger>
                    <SelectContent>
                    {formatCLM && formatCLM.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormInput
                  form={generalForm}
                  name="colonia"
                  label="Colonia"
                  placeholder=""
                />


                <FormInput
                  form={generalForm}
                  name="ciudad"
                  label="Ciudad"
                  placeholder=""
                />
                
                
                <FormInput
                  form={generalForm}
                  name="estado"
                  label="Estado"
                  placeholder=""
                />
                
              </CardContent>
              </TabsContent>

              <TabsContent value="documentos">
                
              <CardContent className="grid relative grid-cols-1 gap-3 py-3">
              
             
              <div className="overflow-y-auto  h-[450px] lg:h-[300px]  rounded-sm border">
            
              </div>
              </CardContent>
              </TabsContent>  
              
              <TabsContent value="movimientos">
              <div className="overflow-y-auto h-[450px] lg:h-[300px]">
                {timelineDataMovimientos &&   timelineDataMovimientos.length >0 && (<div className="rounded-none border"><TimelineLayout timelineData={timelineDataMovimientos} /></div>)}
                </div>
              </TabsContent>
              
              <TabsContent value="fiscales">

              <CardContent className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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

     
                </CardContent>
                
              <CardContent className="grid relative grid-cols-1 gap-3 py-3 sm:grid-cols-2">

                
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
              <Select name="metodo_pago" onValueChange={(value) => generalForm.setValue("id_metodo_pago",  parseInt(value))}>
                <SelectTrigger>
                <SelectValue
                placeholder={
                  metodosPago && metodosPago.find((metodo) => metodo.id === generalForm.watch("id_metodo_pago"))
                    ?.descripcion || "Selecciona un método de pago"
                }/>
                </SelectTrigger>
                <SelectContent>
                {metodosPago && metodosPago.map((metodo) => (
                  <SelectItem key={metodo.clave} value={metodo.clave}>
                    {metodo.clave} - {metodo.descripcion}
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

              <TabsContent value="servicios">
              <div className="absolute right-0 bottom-0 p-4">
                  <FormFooter handleCreateItemClose={handleCreateItemClose} form={generalForm} dataModal={dataModal} />
                </div>
              <CardContent className="grid relative grid-cols-1 gap-3 py-3">
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


              </TabsContent>

              <TabsContent value="notas">

              <CardContent className="grid relative grid-cols-1 gap-3 py-3">
              
              <Button type="button" onClick={(e) => OpenModalAñadirNota(e)} className="absolute top-0 right-0 p-4 w-full sm:right-6 le sm:w-1/6">+ añadir </Button>
              <div className="overflow-y-auto mt-10  h-[450px] lg:h-[300px] rounded-sm border">
            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              {clientesNotas && clientesNotas.map((nota) => (
                <div
                  key={nota.id}
                  className="p-4 bg-white rounded-xl border border-gray-200 shadow-md"
                >
                  {/* <h2 className="mb-2 text-lg font-semibold">Folio #{nota.id}</h2> */}
                
                  <div className="text-sm text-gray-500">
                     <p>
                    <UserAvatar
                      withTooltip
                      userId={nota.usuarioCreaId}
                      className="size-6"
                      rounded="rounded-full"
                    />
                    
                   
                    <span className="font-semibold">Fecha:</span>{" "}
                    {new Date(nota.fecha_crea).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </p>

                  </div>
                  <p className="mb-2 text-gray-700">{nota.nota}</p>
                </div>
              ))}
            </div>
            
              </div>
              </CardContent>
              </TabsContent>

              <TabsContent value="eventos">

              <CardContent className="grid relative grid-cols-1 gap-3 py-3">
              
                <Button type="button" onClick={(e) => OpenModalAñadirEvento(e)} className="absolute top-0 right-0 p-4 w-full sm:right-6 le sm:w-1/6">+ añadir </Button>
                <div className="overflow-y-auto mt-10 h-[450px] lg:h-[300px]  rounded-sm border">
                {timelineDataEventos && timelineDataEventos.length >0 && (<div className="rounded-none border"><TimelineLayout timelineData={timelineDataEventos} /></div>)}
                </div>
                </CardContent>

              </TabsContent>



    
          
            </div>
            </div>
          </Tabs>

                
        </Card>

        
        <div className="absolute right-0 bottom-0 p-4">
                  <FormFooter handleCreateItemClose={handleCreateItemClose} form={generalForm} dataModal={dataModal} />
                </div>
                
      </form>
    </Form>
    </TooltipProvider>
    );
};

export const asignarEvento = () => {
  const { dispatch } = usePage(); 
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const { authState: { user },logout,} = useAuth();
  const clienteId =useAppSelector((state: RootState) => state.page.dataModal.id as number );
  const eventos =useAppSelector((state: RootState) => state.page.slots.EVENTOS as eventoInterface[]) ;
  const eventosCliente =useAppSelector((state: RootState) => state.page.slots.EVENTOS_CLIENTE as clientesEventosInterface[]) ;
  
  const validationSchema = z
    .object({
       nota: z.string().optional(),
       eventoId:z.number()
    })
    
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      eventoId: dataModal.eventoId,
      nota: dataModal.nota,
    },
  });

    const onSubmit: SubmitHandler<any> = async (valores) => {
  try {          

      const valoresForm = {
        Id : clienteId,
        userId: user?.id,
        clienteId: clienteId,
        eventoId : valores.eventoId,
        nota: valores.nota
      };

        const response = await axios.post<ResponseInterface>(
          "/api/clientes/createEvento",
          valoresForm
        );
        
        generalForm.reset();
         dispatch(deleteSlot("openModal"));

       
        if(response.data.isSuccess){

          var resultado =response.data.result;

          console.log(resultado)
          
          const data = {
            id: resultado.id.toString(),
            evento:{
              nombre: resultado.evento.nombre,
            } ,
            comentario: valoresForm.nota,
            fecha_inicio: new Date(resultado.fecha_inicio).toISOString(), 
          };

          console.log(eventosCliente)
  
          if (eventosCliente !== undefined ) {
            dispatch(
              addItemSlot({
                state: "EVENTOS_CLIENTE",
                data: data
              })
            );
          } else if (eventosCliente === undefined) {
            dispatch(createSlot({ EVENTOS_CLIENTE: [data] }));
          }
          
          toast.success(response.data.message);
        }else{
          toast.error(response.data.message)
        }
        return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Error al registrar  el evento");
    }
  };

    
  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };

  const eventosFiltrados = useMemo(() => {
    if (!eventos || !eventosCliente) return eventos;
  
    return eventos.filter(evento =>
      !eventosCliente.some(clienteEvento => clienteEvento.evento.id === evento.id)
    );
  }, [eventos, eventosCliente]);
  

  const CargaEventos = async () => {
    try {
      const response = await axios.get(
        `/api/clientes/getEventosByCliente/${clienteId}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );
      
      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        
        const eventos = response.data.result as clientesEventosInterface[];
  
        dispatch(createSlot({ EVENTOS_CLIENTE: eventos }));
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (clienteId) {
      CargaEventos();
    }
  }, [clienteId]);
      
  
    return (
    <Form {...generalForm}>
      <form onSubmit={generalForm.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-[400px] w-full overflow-y-auto flex flex-col">
          <CardContent className="grid flex-row gap-2 py-3">

          <label className="block text-xs font-medium text-black">
                
              </label>
              <textarea
                {...generalForm.register("nota")}
                placeholder="Añade un comentario ..."
               
                className="p-1 mb-5 w-full h-48 text-sm rounded-md border shadow resize-none border-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
            <div>
              <FormLabel className="text-xs">Eventos </FormLabel>
              <Select name="userId" onValueChange={(value) => generalForm.setValue("eventoId", parseInt(value))}>
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={
                      eventosFiltrados && eventosFiltrados.length > 0
                        ? eventosFiltrados.find((x) => x.id === generalForm.watch("eventoId"))?.nombre ||
                          "Selecciona un evento"
                        : "Cargando..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {eventosFiltrados &&
                    eventosFiltrados.map((item: { id: number; nombre: string }) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            
          </CardContent>

          <div className="flex flex-col items-end"  >
                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    type="submit"
                    className="text-xs"
                    disabled={generalForm.formState.isSubmitting}
                  >
                  {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  
                    Añadir evento
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
};


export const añadirNota = () => {
  const { dispatch } = usePage(); 
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const usuarios =useAppSelector((state: RootState) => state.page.slots.USUARIOS as any[] );
  const { authState: { user },logout,} = useAuth();
  const clienteId =useAppSelector((state: RootState) => state.page.dataModal.id as number );
  const eventos =useAppSelector((state: RootState) => state.page.slots.EVENTOS as eventoInterface[]) ;
  const notasCliente =useAppSelector((state: RootState) => state.page.slots.NOTAS_CLIENTE as clientesEventosInterface[]) ;
  
  const validationSchema = z
    .object({
       nota: z.string(),
       
    })
    
  const generalForm = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
    
      nota: dataModal.nota,
    },
  });

    const onSubmit: SubmitHandler<any> = async (valores) => {
  try {          

      const valoresForm = {
        Id : clienteId,
        userId: user?.id,
        clienteId: clienteId,
        nota: valores.nota
      };

        const response = await axios.post<ResponseInterface>(
          "/api/clientes/createNota",
          valoresForm
        );
        
        generalForm.reset();
         dispatch(deleteSlot("openModal"));

       
        if(response.data.isSuccess){

          var resultado =response.data.result;

          console.log(resultado)
          
          const data = {
            id: resultado.id.toString(),
            nota: resultado.nota,
            clienteId: clienteId,
            usuarioCreaid: user?.id,
            Fecha_crea: resultado.fecha_crea,
          };

          console.log(notasCliente)
  
          if (notasCliente !== undefined ) {
            dispatch(
              addItemSlot({
                state: "NOTAS_CLIENTE",
                data: data
              })
            );
          } else if (notasCliente === undefined) {
            dispatch(createSlot({ NOTAS_CLIENTE: [data] }));
          }
          
          toast.success(response.data.message);
        }else{
          toast.error(response.data.message)
        }
        return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Error al registrar la nota");
    }
  };

    
  function onSubmit1(valores: any) {
    console.log("hello!", valores);
  }
  
  const onError = (valores: any) => {
    console.log(valores);
  };

 



  
    return (
    <Form {...generalForm}>
      <form onSubmit={generalForm.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-[300px] w-full overflow-y-auto flex flex-col">
          <CardContent className="grid flex-row gap-2 py-3">

          <label className="block text-xs font-medium text-black">
                
              </label>
              <textarea
                {...generalForm.register("nota")}
                placeholder="Añade una nota ..."
                required
                className="p-1 mb-5 w-full h-48 text-sm rounded-md border shadow resize-none border-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
          </CardContent>

          <div className="flex flex-col items-end"  >
                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    type="submit"
                    className="text-xs"
                    disabled={generalForm.formState.isSubmitting}
                  >
                  {generalForm.formState.isSubmitting && (<LuLoaderCircle className="animate-spin" />)}
                  
                    Añadir nota
                  </Button>
                </CardFooter>
              </div>
              
        </Card>
      </form>
    </Form>

    );
};


export const ReturnModal = () => {
  const formulario = useAppSelector((state: RootState) => state.page.slots.formulario as string);
  const { dispatch } = usePage(PAGE_SLOT);

  const eliminarSlots = () => {
    dispatch(deleteSlot("formulario"));
    dispatch(deleteSlot("openModal"));
  };

  const ContentComponent = formulario === "evento" ? asignarEvento : añadirNota;

  return (
    <ModalGenerico
      titulo={formulario === "evento" ? "Añadir evento" : "Añadir nota"}
      Content={ContentComponent}
      handleClose={eliminarSlots}
    />
  );
};

import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LuDownload, LuPlus, LuUpload } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ResponseInterface } from "@/interfaces/responseInterface";
import axios from "@/lib/utils/axios";
import { useAppDispatch } from "@/hooks/storeHooks";
import { useAppSelector } from "@/hooks/storeHooks";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { MdDelete } from "react-icons/md";
import { deleteFile, uploadImage } from "@/api/storageApi";
import { AuthService } from "@/services/auth.service";
import { appConfig } from "@/appConfig";
import { mostrarModalConfirmacion } from "@/components/Autorizar";
import { ModalConfirmacion } from "./ModalConfirm";
import { addItemSlot, deleteItemSlot, updateItemSlot, setIsLoading } from "@/store/slices/page";
import { Loading } from "./Loading";

interface SelectGridProps<T> {
  items: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  onSelect: (selected: T) => void;
  selectedItems: T[];
  setSelectedItems: (items: T[]) => void;
  titulo: string;
  getValues: any;
    setValue: any;
}

const SelectGrid = <T extends { [key: string]: any }>({
  items,
  labelKey,
  valueKey,
  onSelect,
  selectedItems,
  setSelectedItems,
  titulo,
    getValues,
    setValue,
}: SelectGridProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal as any);
  const departamento = useAppSelector((state: RootState) => state.page.slots.DEPARTAMENTOS as any);
   const {user} = useAuth();
  const dispatch = useAppDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    fieldName: string;
    id: string | number;
  } | null>(null);

  const [pendingDelete2, setPendingDelete2] = useState<{
    id: number;
    url: string;
    folder: string;
    titulo: string;
    valueKey: string;
  } | null>(null);

  
  const handleAddItem = (item: string) => {
    add(item)
  };

  const add = async (slot: string) => {
    if (!selectedValue) return;
  
    const foundItem = items.find((x) => x[valueKey].toString() === selectedValue);
    if (foundItem && !selectedItems.some((s) => s[valueKey] === foundItem[valueKey].toString())) {
        let itemToAdd = foundItem;

        if (titulo?.toLowerCase() === 'documentos') {
            itemToAdd = { ...foundItem, rutaArchivo: null } as T;
        }

        const newItems = [...selectedItems, itemToAdd];
        setSelectedItems(newItems);
  
    
      const currentValues = getValues(slot) || [];
      setValue(slot, [...currentValues, itemToAdd]); 
    

    try {

        switch (titulo) {
            case "usuarios":
                
            const valoresForm = {
                comunicacion_cliente: false,
                userId: itemToAdd?.id,
                departamentoId: dataModal.id,
                };

                console.log(valoresForm);
            
                const response = await axios.post<ResponseInterface>(
                    "/api/departamentos/UpdateComunicacionCliente",
                    valoresForm
                );
                    
                if(response.data.isSuccess){

                                        
                    dispatch(
                        addItemSlot({ state: "DEPARTAMENTOS_USUARIOS", data: itemToAdd })
                    );
                
                    toast.success(response.data.message);
                }

                return response.data.result;
                
                break;
            case "Servicios":
                
            const valoresForm2 = {
                id: dataModal.id,
                servicioId: itemToAdd?.id,
            };
            
            const response2 = await axios.post<ResponseInterface>(
                "/api/clientes/createClientesServicios",
                valoresForm2
            );

            var servicio ={
                
                id: itemToAdd?.id,
                descripcion: itemToAdd?.descripcion,
            }
                
            if(response2.data.isSuccess){
                
                dispatch(
                    addItemSlot({ state: "SERVICIOS_CLIENTE", data: servicio })
                );
                
                toast.success(response2.data.message);
            }

            return response2.data.result;
            
            break;
       
            default:
                break;
        }
    
    } catch (error) {
        console.error(error);
    }
    
    }
    
  }

  const handleRemoveItem = async (fieldName: string,item: any) => {
    setPendingDelete({ fieldName, id: item.id });
    setOpenConfirm(true);
  };

  const handleRemoveItem2 = async (id:number,url: string,folder: string, titulo: string, valueKey: string) => {
    setPendingDelete2({ id, url, folder, titulo, valueKey });
    setOpenConfirm(true);
  };

  const RemoveItem = async (fieldName: string,id: string | number) => {
    
    const newItems = selectedItems.filter((s) => s[valueKey] !== id);
    setSelectedItems(newItems);
  

    const servicios = getValues(fieldName) || [];
    setValue(fieldName, servicios.filter((s: any) => s[valueKey] !== id)); 

    try {

        switch (titulo) {
            case "usuarios":
             
            const valoresForm1 = {
                userId: id,
                departamentoId:dataModal.id,
            };

                
            const response1 = await axios.post<ResponseInterface>(
                `/api/departamentos/deleteDepartamentoUsuarios`,
                valoresForm1
            );

            if(response1.data.isSuccess){
                
                dispatch(
                    deleteItemSlot({ state: "DEPARTAMENTOS_USUARIOS", data: id })
                );
                
                toast.success(response1.data.message);
            }

            return response1.data.result;
            
                break;
            case "Servicios":
             
            const response2 = await axios.delete<ResponseInterface>(
                `/api/clientes/deleteClienteServicio/${dataModal.id}/${id}`
            );

            if(response2.data.isSuccess){
                
                dispatch(
                    deleteItemSlot({ state: "SERVICIOS_CLIENTE", data: id })
                );
                
                toast.success(response2.data.message);
            }

            return response2.data.result;
            
            break;
             
            default:
                break;
        }
    
    } catch (error) {
        console.error(error);
    }
    
  };
  
  const setActivoChange = async (item:any,checked: boolean) => {

    const valoresForm = {
    comunicacion_cliente: checked,
    userId: item?.id,
    departamentoId: dataModal.id,
    };


    const response = await axios.post<ResponseInterface>(
        "/api/departamentos/UpdateComunicacionCliente",
        valoresForm
    );
          
    if(response.data.isSuccess){
        
        toast.success(response.data.message);

       

        const actualizados = selectedItems.map((user) =>
        user.id === item.id
            ? { ...user, comunicacion_cliente: checked }
            : user
        );
            
        setSelectedItems(actualizados);
        setValue("usuarios", actualizados);   
    }

  };

  const handleUploadFile = async (file: File,folder: string, id: number,descripcion:string, archivoEliminar?: string) => {
    
    let fileName ;
        
    if(archivoEliminar){
    const decodedUrl = decodeURIComponent(archivoEliminar);
    fileName = decodedUrl.split('/').pop()?.split('?')[0]; 
    }

    dispatch(setIsLoading(true));

    const uploaded = await uploadImage(file, "ClientesDocumentos/"+folder, fileName || "");

    const valoresForm = {
        clienteId: parseInt(dataModal.id.toString() || ""),
        documentoId: id,
        rutaArchivo: uploaded,
    };

    //console.log(valoresForm);
    const response = await axios.post<ResponseInterface>(
        "/api/clientes/createDocumentosClientes",
        valoresForm
    );

    if(response.data.isSuccess){

        var documento ={
            id:id,
            descripcion:descripcion,
            rutaArchivo: uploaded,
        }

        console.log(documento);

        dispatch(
            updateItemSlot({ state: "DOCUMENTOS_CLIENTE", data: documento })
        );

        const actualizados = selectedItems.map((doc) =>
            doc.id === id
              ? { ...doc, rutaArchivo: uploaded }
              : doc
          );
          setSelectedItems(actualizados);
          setValue("documentos", actualizados); // Asegúrate que "Documentos" sea el campo correcto
        
        dispatch(setIsLoading(false));
        toast.success(response.data.message);
    }
    else{
        toast.error("Error al subir el archivo");
        dispatch(setIsLoading(false));
    }

  };

  const handleDeleteFile = async (id:number,url: string,folder: string, titulo: string, valueKey: string) => {

    
    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop()?.split('?')[0];    
    await deleteFile(fileName ?fileName:"", "ClientesDocumentos/"+folder)
    toast.success("Archivo eliminado correctamente");


    dispatch(
        deleteItemSlot({ state: "DOCUMENTOS_CLIENTE", data: id })
    );
    
    const newItems = selectedItems.filter((s) => s[valueKey] !== id);
    setSelectedItems(newItems);
  
    const servicios = getValues(titulo) || [];
    setValue(titulo, servicios.filter((s: any) => s[valueKey] !== id)); 

    const response = await axios.delete<ResponseInterface>(
        `/api/clientes/deleteDocumentosCliente/${dataModal.id}/${id}`
    );
            
    if(response.data.isSuccess){
        
        toast.success(response.data.message);

        const actualizados = selectedItems.map((user) =>
        user.id === id
            ? { ...user, rutaArchivo: null }
            : user
        );
            
        setSelectedItems(actualizados);
        setValue("documentos", actualizados);   
    }
   
  }
    
    const handleDescargarImagen = async (url: string) => {

    var fileName ="";

    const decodedUrl = decodeURIComponent(url);
    fileName = decodedUrl.split('/').pop()?.split('?')[0] as string;    

    const token = AuthService.getAuthToken();

    const finalUrl = `${appConfig.URL_API}api/tickets/descargar-imagen?firebaseUrl=${encodeURIComponent(url)}&nombre=${encodeURIComponent(fileName)}`;

    try {
        const response = await fetch(finalUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    
        if (!response.ok) throw new Error("Fallo al descargar la imagen");
    
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
    
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error al descargar imagen:", error);
    }
  };

  return (
    
      <>
      {titulo !== "Documentos" && (<div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center w-full">
              {/* Select */}
              <div className="flex-1">
                  <Select onValueChange={(value) => setSelectedValue(value)}>
                      <SelectTrigger className="w-full h-8">
                          <SelectValue className="text-xs" placeholder={titulo} />
                      </SelectTrigger>
                      <SelectContent>
                          { items && items.map((item) => (
                              <SelectItem key={item[valueKey]} value={item[valueKey].toString()}>
                                  {item[labelKey]}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>

              {/* Botón */}
              <button
                  className="flex items-center justify-center gap-2 h-8 px-4 text-xs text-white transition bg-blue-500 rounded hover:bg-blue-700 flex-shrink-0 min-w-[50px]"
                  onClick={(e)=>handleAddItem(titulo)}
                  type="button"
              >
                  <LuPlus size={16} />
                  Agregar
              </button>
          </div>
      </div>)}
      
      <div className="grid grid-cols-1 gap-3 mt-2">
              {/* {selectedItems && selectedItems.length > 0 && (
                  <div className="text-xs font-semibold">{titulo} relacionados</div>
              )} */}

              {selectedItems.length > 0 && (
                  <div className="overflow-hidden mt-4 rounded-md border">
                      <div className="overflow-y-auto max-h-90 min-h-40">
                          <table className="w-full text-xs border-collapse">
                              <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm dark:bg-gray-800">
                                  <tr>
                                      <th className="w-[70%] px-4 py-2 text-left border-b">Nombre</th>
                                      {titulo ==="Servicios" ?(
                                        <>
                                        {/* <th className="w-[70%] px-4 py-2 text-left border-b">Precio</th>
                                        <th className="w-[70%] px-4 py-2 text-left border-b">Frecuencia</th> */}
                                        </>
                                      ): (<>
                                      {titulo ==="usuarios" && (<th className="w-[70%] px-4 py-2 text-left border-b">Rol</th>)}
                                      {titulo ==="usuarios" && user?.userRoll === "Administrador" && (<th className="w-[70%] px-4 py-2 text-left border-b">Comunicación con cliente</th>)}
                                      {titulo ==="Documentos" && (
                                        <>
                                        <th className="w-[70%] px-4 py-2 text-center border-b">Subir</th>
                                        <th className="w-[70%] px-4 py-2 text-center border-b">Descargar</th>
                                        <th className="w-[70%] px-4 py-2 text-center border-b">Eliminar archivo</th>
                                        </>
                                        
                                        
                                        )}
                                      </>)}
                                      {titulo !== "Documentos" && (
                                      <th className="w-[30%] px-4 py-2 text-center border-b">Quitar</th>
                                      )}
                                  </tr>
                              </thead>
                              <tbody>
                                {selectedItems &&
                                    selectedItems.map((item) => {
                                    // Buscar el usuario en items basado en el id
                                    const itemUser = items.find((x) => x.id === item.id);
                                    const userRoll = itemUser ? itemUser.userRoll : "Desconocido"; // Manejar caso en que no se encuentre

                                    return (
                                        <tr key={item[valueKey]} className="border-b">
                                        <td className="px-4 py-2 text-sm">{item[labelKey]}</td>
                                        {titulo === "Servicios" ? (
                                            <>
                                            {/* <td className="px-4 py-2 text-sm">${item.precio}</td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.frecuencia === "A"
                                                ? "ANUAL"
                                                : item.frecuencia === "M"
                                                ? "MENSUAL"
                                                : "ÚNICA"}
                                            </td> */}
                                            </>
                                        ) : (<>
                                        {titulo ==="usuarios" && (
                                            <>
                                            <td className="px-4 py-2 text-sm">{userRoll}</td>
                                            {user?.userRoll === "Administrador" && (
                                                <td className="px-4 py-2 text-sm">
                                            <Switch
                                            className="!mt-0"
                                            checked={!!item.comunicacion_cliente}
                                            onCheckedChange={(checked) => {
                                               setActivoChange(item,checked);
                                            }}/>
                                            </td>
                                            )}
                                        </>)
                                        }
                                        {titulo === "Documentos" && (
                                            <>
                                             <td className="px-4 py-2 text-center">
                                                <label className="inline-flex gap-2 items-center p-2 text-white bg-green-500 rounded cursor-pointer hover:bg-green-700">
                                                    <LuUpload size={18} />
                                                    <input
                                                    type="file"
                                                    accept="image/*" // puedes cambiarlo según el tipo de archivo
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                        handleUploadFile(file, "Cliente_" + dataModal.id.toString(), item.id,item.descripcion, item.rutaArchivo);
                                                        }
                                                    }}
                                                    />
                                                </label>
                                            </td>
                                            {console.log(item.rutaArchivo)}
                                            <td className="px-4 py-2 text-center">
                                                <div>{item.rutaArchivo === null ? (
                                                    "No hay archivo"
                                                ) : (
                                                    <button
                                                    className="p-2 text-white bg-yellow-500 rounded hover:bg-yellow-700"
                                                    onClick={() => handleDescargarImagen(item.rutaArchivo)}
                                                    type="button"
                                                    >
                                                    <LuDownload size={18} />
                                                    </button>
                                                )}</div>
                                            </td>
                                            
                                            <td className="px-4 py-2 text-center">
                                                <div>{item.rutaArchivo === null ? (
                                                    "No hay archivo"
                                                ) : (
                                                    <button
                                                    className="p-2 text-white bg-red-500 rounded hover:bg-red-700"
                                                    onClick={() => handleRemoveItem2(item.id,item.rutaArchivo,"Cliente_"+dataModal.id.toString(), titulo, item[valueKey])}
                                                    type="button"
                                                >
                                                <MdDelete  size={18} />
                                                </button>
                                                )}</div>
                                            </td>
                                            </>
                                            )}
                                        </>
                                        )}
                                        {titulo !== "Documentos" && (
                                        <td className="px-4 py-2 text-center">
                                            <button
                                            type="button"
                                            className="p-2 text-white bg-red-500 rounded hover:bg-red-700"
                                            onClick={() => handleRemoveItem(titulo, item)}
                                            >
                                            <LuTrash2 size={18} />
                                            </button>
                                        </td>
                                        )}
                                        </tr>
                                    );
                                    })}
                                </tbody>

                          </table>
                      </div>
                  </div>
              )}
          </div>
          
          <ModalConfirmacion
            open={openConfirm}
            titulo={`¿Estás seguro de eliminar este ${titulo === "Documentos" ? "documento" : titulo === "usuarios" ? "usuario" : "servicio"}?`}
            mensaje=""
            onConfirm={async () => {

                if(titulo === "Documentos"){
                    
                    if (pendingDelete2) {
                        await handleDeleteFile(
                            pendingDelete2.id,
                            pendingDelete2.url,
                            pendingDelete2.folder,
                            pendingDelete2.titulo,
                            pendingDelete2.valueKey
                            
                        );
                    }
                    setPendingDelete2(null); 
                }else{
                    if (pendingDelete) {
                        await RemoveItem(
                            pendingDelete.fieldName,
                            pendingDelete.id,
                            
                        );
                    }
                    setPendingDelete(null); 
                }
                setOpenConfirm(false);
            }}
            onCancel={() => {
                setOpenConfirm(false);
                setPendingDelete(null); 
            }}
            />

          

</>

  );
};

export default SelectGrid;

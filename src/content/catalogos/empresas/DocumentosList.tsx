import {
  LuFile,
  LuFileUp,
  LuFolderOpen,
  LuTrash2,
  LuUpload,
} from "react-icons/lu";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib/utils/axios";
import { PAGE_SLOT } from "./constants";
import { usePage } from "@/hooks/usePage";
import { RootState } from "@/store/store";
import { H6 } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/storeHooks";
import { createSlot, setIsLoading } from "@/store/slices/page";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface DocumentosListProps {
  items: any[];
  puedeCargarComprobante?: boolean;
}

function DocumentosList({
  items,
  puedeCargarComprobante,
}: DocumentosListProps) {
  const [isLoadingArchivo, setIsLoadingArchivo] = useState(false);

  const DocumentosRelacionados = useAppSelector(
    (state: RootState) => state.page.slots.DOCUMENTOSRELACIONADOS
  );

  const EmpresaSeleccionada = useAppSelector(
    (state: RootState) => state.page.dataModal
  );

  const { dispatch } = usePage(PAGE_SLOT);

  const onChangeArchivo = async (event: any, item: any) => {
    dispatch(setIsLoading(true));
    setIsLoadingArchivo(true);
    const file = event.target.files[0];
    const archivoAnterior = item.nombreReporte;
    const subFolder = `${item.empresaId}/${EmpresaSeleccionada.id}`;

    // await uploadFile("PlantillasReportes", file, archivoAnterior, subFolder)
    //   .then(async (file) => {
    //     let message = "";

    //     try {
    //       const response = await axios.post<ResponseInterface>(
    //         "api/documentos/UpdateReporteEmpresa",
    //         {
    //           ...itemArchivo,
    //           urlReporte: file.fullPath,
    //           nombreReporte: file.nombre,
    //         }
    //       );

    //       message = response.data.message;
    //       const isSuccess = response.data.isSuccess;
    //       const result = response.data.result.result;

    //       let newDocumentosRelacionados = DocumentosRelacionados.map((item) => {
    //         if (item.id === result.id) {
    //           return result;
    //         }
    //         return item;
    //       });

    //       dispatch(
    //         createSlot({
    //           DOCUMENTOSRELACIONADOS: newDocumentosRelacionados,
    //         })
    //       );
    //     } catch (err) {
    //       console.error(err);
    //       setIsLoadingArchivo(false);
    //       dispatch(setIsLoading(false));
    //       setItemArchivo(null);
    //     }

    //     // enqueueSnackbar("Se cargo correctamente el comprobante...", {
    //     //   variant: "success",
    //     //   anchorOrigin: { vertical: "top", horizontal: "center" },
    //     //   TransitionComponent: Zoom,
    //     // });
    //     // })
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setIsLoadingArchivo(false);
    //     setItemArchivo(null);
    //   });

    dispatch(setIsLoading(false));
    setIsLoadingArchivo(false);
  };

  const handleClickEliminarDocumento = async (item: any) => {
    dispatch(setIsLoading(true));
    try {
      const response = await axios.post<ResponseInterface>(
        `api/documentos/EliminarReporteEmpresa/${EmpresaSeleccionada.id}/${item.id}`
      );

      const isSuccess = response.data.isSuccess;

      if (!isSuccess) {
        // enqueueSnackbar("Ocurrió un error al eliminar el documento...", {
        //   variant: "error",
        //   anchorOrigin: { vertical: "top", horizontal: "right" },
        //   TransitionComponent: Zoom,
        // });
        return;
      }

      const newDocumentosRelacionados = DocumentosRelacionados.filter(
        (x: any) => x.id !== item.id
      );

      dispatch(
        createSlot({
          DOCUMENTOSRELACIONADOS: newDocumentosRelacionados,
        })
      );

      // enqueueSnackbar("Se eliminó correctamente el documento...", {
      //   variant: "success",
      //   anchorOrigin: { vertical: "top", horizontal: "right" },
      //   TransitionComponent: Zoom,
      // });
    } catch (err) {
      console.error(err);
    }
    dispatch(setIsLoading(false));
  };

  return (
    <>
      <H6>Documentos Relacionados</H6>
      {items?.length > 0 ? (
        <Table>
          <TableBody className="grid">
            {items?.map((item) => (
              <TableRow
                key={item.id}
                className={`grid grid-cols-[1fr,auto,auto] gap-1 p-1
                    ${
                      item.urlReporte ? "bg-green-100 dark:bg-green-800" : ""
                    } hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <TableCell className="flex items-center">
                  <LuFile className="mr-2" />
                  {item?.descripcion}
                </TableCell>
                {(!!puedeCargarComprobante || !!item.urlComprobante) && (
                  <TableCell className="flex items-center justify-center">
                    {puedeCargarComprobante && (
                      <>
                        <Input
                          //accept="image/*"
                          id={`icon-button-file-${item.id}`}
                          name="icon-button-file"
                          type="file"
                          className="sr-only"
                          onChange={(e) => onChangeArchivo(e, item)}
                          aria-label="Cargar documento"
                        />
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              asChild
                              size="icon"
                              aria-label="Cargar documento"
                            >
                              <label
                                className="cursor-pointer"
                                htmlFor={`icon-button-file-${item.id}`}
                              >
                                <LuUpload aria-hidden="true" />
                              </label>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cargar Documento</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                    {item.urlComprobante && item.urlComprobante.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="link" asChild size="icon">
                            <a href={item.urlComprobante} target="_blank">
                              <LuFileUp />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Descargar Documento</TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          handleClickEliminarDocumento(item);
                        }}
                      >
                        <LuTrash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar Documento</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center p-2">
          <LuFolderOpen className="text-primary" size={24} />
          <H6>No hay documentos relacionados</H6>
        </div>
      )}
    </>
  );
}

export default DocumentosList;

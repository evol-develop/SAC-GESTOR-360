import Swal from "sweetalert2";
import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import axios from "@/lib/utils/axios";
import { AutorizarInterface } from "@/interfaces/autorizar";
import { buttonVariants } from "../ui/button";
import { TiposAutorizacion } from "@/interfaces/autorizar";
import { ResponseInterface } from "@/interfaces/responseInterface";

const MENSAJES = {
  TITULO_CONFIRMAR: "Confirmar Autorización",
  TITULO_ERROR: "Error",
  TITULO_NO_AUTORIZADO: "No cuentas con la autorización necesaria",
  TITULO_DATOS_INCORRECTOS: "Datos incorrectos",
  ERROR_PASSWORD: "Es necesario ingresar una contraseña",
  ERROR_GENERAL: "Ocurrió un error al procesar la autorización.",
};

const BOTONES = {
  CONFIRMAR: "Autorizar",
  CONFIRMAR2: "Confirmar",
  CANCELAR: "Cancelar",
  OK: "Ok",
};

const ESTILOS_SWAL = {
  customClass: {
    popup:
      "rounded-lg shadow-lg border border-border bg-background text-foreground w-96",
    title: "text-xl font-semibold leading-none tracking-tight",
    htmlContainer: "mt-4",
    input:
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    confirmButton: buttonVariants({ variant: "default", size: "default" }),
    cancelButton: buttonVariants({
      variant: "default",
      size: "default",
      className: "ml-4",
    }),
  },
  buttonsStyling: false,
  background: "hsl(var(--background))",
  color: "hsl(var(--foreground))",
};

export async function mostrarModalConfirmacion(
  p0: string,
  p1: string,
  p2: () => Promise<ResponseInterface>,
  p3: () => void,
  p4: string
): Promise<boolean> {
  const result = await Swal.fire({
    title: p0,
    text: p1,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: BOTONES.CONFIRMAR2,
    cancelButtonText: BOTONES.CANCELAR,
    ...ESTILOS_SWAL,
    customClass: {
      ...ESTILOS_SWAL.customClass,
      popup: `${ESTILOS_SWAL.customClass.popup} z-[9999]`, // agrega la clase sin eliminar las anteriores
    },
    allowOutsideClick: false, // ✅ evita que el usuario cierre el modal haciendo clic fuera
    allowEscapeKey: true,     // ✅ permite cerrar con ESC
    allowEnterKey: true,      // ✅ permite confirmar con Enter
    focusConfirm: true,       // ✅ enfoca el botón de confirmar
  });
  

  if (result.isConfirmed) {
    await p2(); // ejecutar función si se confirmó
    return true;
  } else {
    p3(); // ejecutar función si se canceló
    return false;
  }
}


async function mostrarDialogoPassword(): Promise<string | null> {
  const result = await Swal.fire({
    title: MENSAJES.TITULO_CONFIRMAR,
    html: `
      <div class="grid gap-2">
        <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="password">
          Contraseña
        </label>
        <input 
          type="password" 
          id="password" 
          class="flex px-3 py-1 w-full h-9 text-base bg-transparent rounded-md border shadow-sm transition-colors border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder="Ingrese su contraseña..."
        >
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: BOTONES.CONFIRMAR,
    cancelButtonText: BOTONES.CANCELAR,
    preConfirm: () => {
      const passwordInput =
        Swal.getPopup()?.querySelector<HTMLInputElement>("#password");
      if (!passwordInput?.value) {
        Swal.showValidationMessage(MENSAJES.ERROR_PASSWORD);
        return null;
      }
      return passwordInput.value;
    },
    ...ESTILOS_SWAL,
  });
  return result.isConfirmed ? (result.value as string) : null;
}

async function mostrarMensajeError(titulo: string, texto?: string) {
  await Swal.fire({
    title: titulo,
    text: texto,
    icon: "error",
    confirmButtonText: BOTONES.OK,
    ...ESTILOS_SWAL,
  });
}

export function useAutorizacionesSecuenciales() {
  const [autorizaciones, setAutorizaciones] = useState<any>({
    servicios: false,
    notas: false,
    eventos: false,
    fiscales: false,
    documentos: false,
    movimientos: false,
    facturacion: false,
  });

  useEffect(() => {
    const verificarTodas = async () => {
      const nuevoEstado: any = {
        servicios: false,
        notas: false,
        eventos: false,
        fiscales: false,
        documentos: false,
        movimientos: false,
      };

      const result1 = await verificarAutorizacion(TiposAutorizacion.AñadirServicios);
      if (result1 === "go" || result1 === "true" || result1 === true) {
        nuevoEstado.servicios = true;
      }

      const result2 = await verificarAutorizacion(TiposAutorizacion.AñadirNotas);
      if (result2 === "go" || result2 === "true" || result2 === true) {
        nuevoEstado.notas = true;
      }

      const result3 = await verificarAutorizacion(TiposAutorizacion.AñadirEventos);
      if (result3 === "go" || result3 === "true" || result3 === true) {
        nuevoEstado.eventos = true;
      }

      const result4 = await verificarAutorizacion(TiposAutorizacion.AñadirDatosFiscales);
      if (result4 === "go" || result4 === "true" || result4 === true) {
        nuevoEstado.fiscales = true;
      }
      const result5 = await verificarAutorizacion(TiposAutorizacion.VerDocumentos );
      if (result5 === "go" || result5 === "true" || result5 === true) {
        nuevoEstado.documentos = true;
      }
      const result6 = await verificarAutorizacion(TiposAutorizacion.VerMovimientos);
      if (result6 === "go" || result6 === "true" || result6 === true) {
        nuevoEstado.movimientos = true;
      }
      const result7 = await verificarAutorizacion(TiposAutorizacion.AñadirDatosFacturacion);
      if (result7 === "go" || result7 === "true" || result7 === true) {
        nuevoEstado.facturacion = true;
      }

      setAutorizaciones(nuevoEstado);
    };

    verificarTodas();
  }, []);

  return autorizaciones;
}

export async function verificarAutorizacion(id: string): Promise<string | boolean> {
  const respuesta = await axios.get(
    `api/autorizaciones/tieneautorizacion/${id}`
  );
  return respuesta.data;
}

async function enviarAutorizacion(
  autorizarDTO: AutorizarInterface
): Promise<boolean> {
  const respuesta: AxiosResponse<boolean> = await axios.post(
    `api/autorizaciones/autorizar`,
    autorizarDTO
  );
  return respuesta.data;
}

export async function Autorizar(onConfirm: () => void, id: string) {
  try {
    const tieneAutorizacion = await verificarAutorizacion(id);

    if (tieneAutorizacion === "go") {
      return onConfirm();
    }

    if (tieneAutorizacion === "true" || tieneAutorizacion === true) {
      const password = await mostrarDialogoPassword();
      if (password) {
        const autorizarDTO: AutorizarInterface = {
          autorizacion: id,
          password,
          observaciones: "",
        };

        const autorizado = await enviarAutorizacion(autorizarDTO);

        if (autorizado) {
          onConfirm();
        } else {
          await Swal.fire({
            title: MENSAJES.TITULO_DATOS_INCORRECTOS,
            icon: "warning",
            confirmButtonText: BOTONES.OK,
            ...ESTILOS_SWAL,
          });
        }
      }
    } else {
      await Swal.fire({
        title: MENSAJES.TITULO_NO_AUTORIZADO,
        icon: "warning",
        confirmButtonText: BOTONES.OK,
        ...ESTILOS_SWAL,
      });
    }
  } catch (error) {
    console.error(error);
    await mostrarMensajeError(MENSAJES.TITULO_ERROR, MENSAJES.ERROR_GENERAL);
  }
}

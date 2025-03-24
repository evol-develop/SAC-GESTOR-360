import Swal from "sweetalert2";
import { AxiosResponse } from "axios";

import axios from "@/lib/utils/axios";
import { AutorizarInterface } from "@/interfaces/autorizar";
import { buttonVariants } from "../ui/button";

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
      variant: "outline",
      size: "default",
      className: "ml-4",
    }),
  },
  buttonsStyling: false,
  background: "hsl(var(--background))",
  color: "hsl(var(--foreground))",
};

async function mostrarDialogoPassword(): Promise<string | null> {
  const result = await Swal.fire({
    title: MENSAJES.TITULO_CONFIRMAR,
    html: `
      <div class="grid gap-2">
        <label class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium leading-none" for="password">
          Contraseña
        </label>
        <input 
          type="password" 
          id="password" 
          class="border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex px-3 py-1 w-full h-9 text-base bg-transparent rounded-md border shadow-sm transition-colors"
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

async function verificarAutorizacion(id: string): Promise<string | boolean> {
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

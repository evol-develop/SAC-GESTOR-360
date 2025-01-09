import Swal from "sweetalert2";
import { AxiosResponse } from "axios";

import axios from "@/lib/utils/axios";
import { AutorizarInterface } from "@/interfaces/autorizar";

export async function Autorizar(onConfirm: () => void, id: string) {
  try {
    // Verificar si el usuario tiene autorización
    const respuesta: AxiosResponse<string> = await axios.get(
      `api/autorizaciones/tieneautorizacion/${id}`
    );

    if (respuesta.data === "go") {
      return onConfirm();
    }

    if (respuesta.data === "true") {
      const result = await Swal.fire({
        title: "Confirmar Autorización",
        html: '<input type="password" id="password" class="swal2-input" placeholder="Contraseña...">',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Autorizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        preConfirm: () => {
          const passwordInput =
            Swal.getPopup()?.querySelector<HTMLInputElement>("#password");
          if (!passwordInput?.value) {
            Swal.showValidationMessage("Es necesario ingresar una contraseña");
            return null;
          }
          return passwordInput.value;
        },
      });

      if (result.isConfirmed) {
        const autorizarDTO: AutorizarInterface = {
          autorizacion: id,
          password: result.value as string,
          observaciones: "",
        };

        const autorizacionRespuesta: AxiosResponse<boolean> = await axios.post(
          `api/autorizaciones/autorizar`,
          autorizarDTO
        );

        if (autorizacionRespuesta.data) {
          onConfirm();
        } else {
          await Swal.fire({
            title: "Datos incorrectos",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    } else {
      await Swal.fire({
        title: "No cuentas con la autorización necesaria",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
  } catch (error) {
    console.error(error);
    await Swal.fire({
      title: "Error",
      text: "Ocurrió un error al procesar la autorización.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  }
}

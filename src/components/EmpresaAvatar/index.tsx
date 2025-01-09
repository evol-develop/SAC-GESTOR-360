import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type EmpresaAvatarProps = {
  /**
   * Id de la empresa
   * @type {string}
   * @description El id de la empresa no es necesario si se pasa el objeto de la empresa en dataEmpresa
   */
  empresaId?: number;
  /**
   * Objeto de la empresa
   * @type {EmpresaInterface}
   * @description El objeto de la empresa no es necesario si se pasa el id de la empresa en empresaId
   */
  dataEmpresa?: EmpresaInterface;
  withTooltip?: boolean;
  className?: string;
  rounded?:
    | "rounded-none"
    | "rounded"
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl"
    | "rounded-2xl"
    | "rounded-3xl"
    | "rounded-full";
};

type Empresa = {
  nombre: string;
  extra: string;
  avatar: string | unknown;
};

/**
 * Componente para mostrar el avatar de una empresa
 * @param {EmpresaAvatarProps} props - Propiedades del componente
 * @description El componente EmpresaAvatar permite mostrar el avatar de una empresa, por defecto se muestra el avatar de la empresa del usuario autenticado
 * @returns {React.ReactElement} - El componente
 */
const EmpresaAvatar = ({
  empresaId,
  dataEmpresa,
  withTooltip,
  rounded = "rounded-lg",
  className,
}: EmpresaAvatarProps) => {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    extra: "",
    avatar: "",
  });

  useEffect(() => {
    if (empresaId && !dataEmpresa) {
      const getEmpresa = async () => {
        try {
          const { data } = await axios.get<ResponseInterface>(
            `/api/empresas/getempresabyid/${empresaId}`
          );
          if (data.isSuccess) {
            setEmpresa({
              nombre: data.result.nombre || "",
              extra: data.result.correo || "",
              avatar: data.result.pictureURL || "",
            });
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getEmpresa();
    } else if (!empresaId && dataEmpresa) {
      setEmpresa({
        nombre: dataEmpresa.nombre || "",
        extra: dataEmpresa.correo || "",
        avatar: dataEmpresa.pictureURL || "",
      });
    } else if (empresaId && dataEmpresa) {
      setEmpresa({
        nombre: dataEmpresa.nombre || "",
        extra: dataEmpresa.correo || "",
        avatar: dataEmpresa.pictureURL || "",
      });
    } else {
      setEmpresa({
        nombre: user?.empresa?.nombre || "",
        extra: user?.empresa?.correo || "",
        avatar: user?.empresa?.pictureURL || "",
      });
    }
  }, [empresaId, dataEmpresa, user]);

  if (withTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar
            className={`w-8 h-8 cursor-default select-none ${rounded} ${className}`}
          >
            {typeof empresa.avatar === "string" && (
              <AvatarImage
                src={empresa.avatar}
                alt={empresa.nombre}
                className="rounded-none"
              />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground rounded-none">
              {empresa.nombre.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <div className="grid flex-1 text-sm leading-tight text-center cursor-default">
            <span className="font-semibold truncate">{empresa.nombre}</span>
            <span className="text-xs truncate">{empresa.extra}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    return (
      <Avatar
        className={`w-8 h-8 cursor-default select-none ${rounded} ${className}`}
      >
        {typeof empresa.avatar === "string" && (
          <AvatarImage
            src={empresa.avatar}
            alt={empresa.nombre}
            className="rounded-none"
          />
        )}
        <AvatarFallback className="bg-primary text-primary-foreground rounded-none">
          {empresa.nombre.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    );
  }
};

export default EmpresaAvatar;

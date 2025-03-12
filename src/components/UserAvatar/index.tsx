import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import axios from "@/lib/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { ResponseInterface, userResult } from "@/interfaces/responseInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  /**
   * Id del usuario
   * @type {string}
   * @description El id del usuario no es necesario si se pasa el objeto del usuario en dataUsuario
   */
  userId?: string;
  /**
   * Objeto del usuario
   * @type {userResult}
   * @description El objeto del usuario no es necesario si se pasa el id del usuario en userId
   */
  dataUsuario?: userResult;
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
  showAvatar?: boolean;
  styles?: React.CSSProperties;
  catalogo?: string;
};

type User = {
  nombre: string;
  extra: string;
  avatar: string;
};

/**
 * Componente para mostrar el avatar de una empresa
 * @param {UserAvatarProps} props - Propiedades del componente
 * @description El componente UserAvatar permite mostrar el avatar de un usuario, por defecto se muestra el avatar del usuario autenticado
 * @returns {React.ReactElement} - El componente
 */
const UserAvatar = ({
  userId,
  dataUsuario,
  withTooltip,
  rounded = "rounded-lg",
  className,
  showAvatar = true,
  styles,
  catalogo= 'user'
}: UserAvatarProps) => {
  const { user: userAuth } = useAuth();
  const [user, setUser] = useState<User>({
    nombre: "",
    extra: "",
    avatar: "",
  });

  useEffect(() => {
    if (userId && !dataUsuario) {
      //console.log(userId);
      const getUser = async () => {

        var url =`/api/user/getuserbyid/${userId}`;

        if(catalogo === "clientes")
        {
          url =`/api/clientes/getClientesById/${userId}`;
        }
        try {
          const { data } = await axios.get<ResponseInterface>(
            url
          );
          //console.log(data);
          if (data.isSuccess) {
            if(catalogo === 'clientes'){
              setUser({
                nombre: data.result.nombre || "",
                extra: data.result.email || "",
                avatar: data.result.picturePath || "",
              });
            }else{
              setUser({
                nombre: data.result.fullName || "",
                extra: data.result.email || "",
                avatar: data.result.picturePath || "",
              });
            }
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getUser();
    } else if (!userId && dataUsuario) {
      setUser({
        nombre: dataUsuario.fullName || "",
        extra: dataUsuario.email || "",
        avatar: dataUsuario.avatar || "",
      });
    } else if (userId && dataUsuario) {
      setUser({
        nombre: dataUsuario.fullName || "",
        extra: dataUsuario.email || "",
        avatar: dataUsuario.avatar || "",
      });
    } else {
      setUser({
        nombre: userAuth?.nombre || "",
        extra: userAuth?.role || "",
        avatar: userAuth?.avatar || "",
      });
    }
  }, [userId, dataUsuario, userAuth]);

  if (!showAvatar) {
    return <span>{user.nombre}</span>;
  }

  if (withTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar
            style={styles}
            className={cn(
              "w-8 h-8 cursor-default select-none",
              rounded,
              className
            )}
          >
            <AvatarImage
              src={user.avatar}
              alt={user.nombre}
              className="rounded-none"
            />
            <AvatarFallback className="rounded-none bg-primary text-primary-foreground">
              {user.nombre
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <div className="grid flex-1 text-sm leading-tight text-center cursor-default">
            <span className="font-semibold truncate">{user.nombre}</span>
            <span className="text-xs truncate">{user.extra}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    return (
      <Avatar
        className={`w-8 h-8 cursor-default select-none ${rounded} ${className}`}
      >
        <AvatarImage
          src={user.avatar}
          alt={user.nombre}
          className="rounded-none"
        />
        <AvatarFallback className="rounded-none bg-primary text-primary-foreground">
          {user.nombre
            .split(" ")
            .map((chunk) => chunk[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    );
  }
};

export default UserAvatar;


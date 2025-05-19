import { Badge } from "@/components/ui/badge";

export const getItemActiveLabel = (active: boolean) => {
  return active ? (
    <Badge>Activo</Badge>
  ) : (
    <Badge variant="destructive">Inactivo</Badge>
  );
};

export const getItemEstatusLabel = (estado: string) => {
  //console.log(estado);
  switch (estado) {
    case "Generado":
      return <Badge variant="default">Generado</Badge>;
    case "Asignado":
      return <Badge variant="info">Asignado</Badge>;

    case "En revision":
      return <Badge variant="warning">En revision</Badge>;
    case "Hecho":
      return <Badge variant="success">Hecho</Badge>;
    default:
      return <Badge variant="destructive">Cancelado</Badge>;
  }
};

export const getDefaultLabel = (pred: boolean) => {
  return pred ? (
    <Badge>Predeterminado</Badge>
  ) : (
    <Badge variant="secondary">No Predeterminado</Badge>
  );
};

export const getUserRoleLabel = (userRole: string) => {
  const rol = userRole == "SuperAdmin" ? "SuperAdmin" : userRole;
  const map: {
    text: string;
    variant: "secondary" | "default" | "destructive" | "outline";
  }[] = [
    {
      text: "Usuario",
      variant: "secondary",
    },
    {
      text: "Administrador",
      variant: "default",
    },
    {
      text: "Super-Admin",
      variant: "destructive",
    },
  ];
  if (userRole === "") {
    return <Badge variant="destructive">{"-"}</Badge>;
  }

  const { text, variant } = map.find((item) => item.text === rol) || {
    text: "Usuario",
    variant: "secondary",
  };
  return <Badge variant={variant}>{text}</Badge>;
};

import { Helmet } from "react-helmet-async";

import { format } from "date-fns";
import { appConfig } from "@/appConfig";
import { useAuth } from "@/hooks/useAuth";
import { H3, Small, Muted } from "@/components/typography";

const Index = () => {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Dashboard</title>
      </Helmet>
      <div className="container flex flex-col h-full gap-2 mx-auto">
        <H3>Bienvenido/a, {user ? user.nombre : ""}</H3>
        <Small>
          Administra tu empresa, usuarios y más desde el menú lateral.
        </Small>
        <Muted>{format(new Date(), "PPPP")}</Muted>
      </div>
    </>
  );
};

export default Index;

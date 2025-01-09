import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";

import { appConfig } from "@/appConfig";
import Logo from "@/components/LogoSign";
import { useAuth } from "@/hooks/useAuth";
import ForgotPassword from "./ForgotPassword";
import FormularioLogin from "./FormularioLogin";

const LoginBasic = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [vista, setVista] = useState(true);

  useEffect(() => {
    if (authState?.isInitialized && authState?.isAuthenticated) {
      navigate("/site");
    }
  }, [authState]);

  if (!authState?.isInitialized || authState?.isAuthenticated) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LuLoaderCircle className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title> {appConfig.NOMBRE} - Iniciar Sesión</title>
      </Helmet>
      <div className="min-h-svh bg-muted md:p-10 flex flex-col items-center justify-center gap-6 p-6">
        <div className="flex flex-col w-full max-w-sm gap-4">
          <Logo className="size-16" />
          {vista ? (
            <FormularioLogin setVista={() => setVista(!vista)} />
          ) : (
            <ForgotPassword setVista={() => setVista(!vista)} />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginBasic;

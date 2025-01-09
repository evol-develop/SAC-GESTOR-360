import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

import Logo from "@/components/LogoSign";
import { Button } from "@/components/ui/button";

function StatusMaintenance() {
  return (
    <>
      <Helmet>
        <title>Mantenimiento</title>
      </Helmet>
      <section className="bg-background text-primary flex flex-col items-center justify-center min-h-screen">
        <Logo />
        <h1 className="mb-4 text-5xl font-bold">Mantenimiento</h1>
        <p className="mb-6 text-xl">
          Estamos realizando tareas de mantenimiento, por favor vuelve mas
          tarde.
        </p>

        <Button variant="outline" asChild>
          <Link to="/">Ir al Inicio</Link>
        </Button>
      </section>
    </>
  );
}

export default StatusMaintenance;

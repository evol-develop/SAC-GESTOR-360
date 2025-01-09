import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

import Logo from "@/components/LogoSign";
import { Button } from "@/components/ui/button";

function Status500() {
  return (
    <>
      <Helmet>
        <title>Error 500</title>
      </Helmet>
      <section className="bg-background text-primary flex flex-col items-center justify-center min-h-screen">
        <Logo />
        <h1 className="mb-4 text-5xl font-bold">500</h1>
        <p className="mb-6 text-xl">
          Oops! Algo salió mal. Por favor, intenta nuevamente.
        </p>

        <Button variant="outline" asChild>
          <Link to="/">Ir al Inicio</Link>
        </Button>
      </section>
    </>
  );
}

export default Status500;

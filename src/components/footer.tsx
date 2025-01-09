import { appConfig } from "@/appConfig";
import Logo from "@/components/LogoSign";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/typography";

const Footer = () => {
  return (
    <footer className="bg-primary-foreground sm:flex md:text-left items-center justify-between w-full p-4 text-center">
      <div className="sm:flex-row flex flex-col items-center justify-center gap-2">
        <Logo className="size-10 m-0" />
        <Muted>
          &copy; {new Date().getFullYear()} {appConfig.DESCRIPCION}
        </Muted>
      </div>
      <Muted>
        Creado por{" "}
        <Button asChild variant="link" className="h-auto p-0">
          <a
            href="https://www.evolsoft.com.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            EvolSoft
          </a>
        </Button>
        .
      </Muted>
    </footer>
  );
};

export default Footer;

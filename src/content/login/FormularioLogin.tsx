import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLoaderCircle } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa un correo electrónico")
    .email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "Ingresa una contraseña"),
});

type FormularioLoginProps = {
  setVista: () => void;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">;

export default function FormularioLogin({
  setVista,
  className,
  ...props
}: FormularioLoginProps) {
  const { login } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido/a de vuelta</CardTitle>
          <CardDescription>
            Inicia sesión en tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="correo@ejemplo.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="default"
                disabled={isSubmitting}
                type="submit"
                className="w-full"
              >
                {isSubmitting ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
              <Button
                variant="link"
                onClick={setVista}
                className="px-0"
                type="button"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

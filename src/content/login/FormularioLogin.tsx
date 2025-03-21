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
import AuthErrorDisplay from "@/components/auth/AuthErrorDisplay";

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
  const { login, authState } = useAuth();
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
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido/a de vuelta</CardTitle>
          <CardDescription>
            Inicia sesión en tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {authState.error && <AuthErrorDisplay error={authState.error} />}
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
                  <FormItem className="flex flex-wrap gap-y-2 justify-between items-center space-y-0">
                    <FormLabel>Contraseña</FormLabel>
                    <Button
                      variant="link"
                      onClick={setVista}
                      className="p-0 m-0 w-auto h-auto"
                      type="button"
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="default"
                disabled={isSubmitting || authState.isLoading}
                type="submit"
                className="w-full"
              >
                {isSubmitting || authState.isLoading ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

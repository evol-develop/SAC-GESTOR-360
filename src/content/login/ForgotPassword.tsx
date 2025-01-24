import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "@/lib/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  setVista: () => void;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">;

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword({
  setVista,
  className,
  ...props
}: Props) {
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<{
    email: string;
  }> = async (values) => {
    setSubmitting(true);
    try {
      const response = await axios.get<boolean>(
        `api/PasswordRecovery/mandarCorreoRecuperacion/${values.email}`
      );

      console.log(response);

      if (response.data) {
        toast.success("Correo de recuperación enviado correctamente.", {
          description: "Revisa tu bandeja de entrada o spam.",
        });
      } else {
        toast.error("El correo electrónico ingresado no está registrado.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el correo de recuperación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para recuperar tu contraseña
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
                        required
                      />
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
                  "Enviar Correo de Recuperación"
                )}
              </Button>
              <div className="-mt-2 text-sm text-center">
                ¿Recuperaste tu contraseña o recordaste tu acceso?{" "}
                <Button
                  variant="link"
                  onClick={setVista}
                  className="p-0 m-0"
                  type="button"
                >
                  Inicia Sesión
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

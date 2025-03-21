import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Esquema de validación para el número de teléfono
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "El número de teléfono debe tener al menos 10 dígitos")
    .max(15, "El número de teléfono no debe exceder 15 dígitos")
    .regex(
      /^\+?[0-9]+$/,
      "El número de teléfono debe contener solo dígitos y opcionalmente un signo +"
    ),
});

// Esquema de validación para el código de verificación
const verificationSchema = z.object({
  verificationCode: z
    .string()
    .min(6, "El código de verificación debe tener al menos 6 dígitos")
    .max(6, "El código de verificación no debe exceder 6 dígitos")
    .regex(/^[0-9]+$/, "El código de verificación debe contener solo dígitos"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;

const TwoFactorSetup = () => {
  const { setup2FA, complete2FASetup, is2FAEnabled } = useAuth();
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // Formulario para el número de teléfono
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Formulario para el código de verificación
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // Manejar el envío del número de teléfono
  const onPhoneSubmit = async (data: PhoneFormValues) => {
    try {
      setIsLoading(true);
      const verId = await setup2FA(data.phoneNumber);
      setVerificationId(verId);
      setStep("verification");
      toast.success("Código de verificación enviado a tu teléfono");
    } catch (error) {
      toast.error("Error al enviar el código de verificación");
      console.error("Error en setup2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el envío del código de verificación
  const onVerificationSubmit = async (data: VerificationFormValues) => {
    if (!verificationId) {
      toast.error("No hay un ID de verificación válido");
      return;
    }

    try {
      setIsLoading(true);
      const success = await complete2FASetup(
        verificationId,
        data.verificationCode
      );

      if (success) {
        toast.success(
          "Autenticación de dos factores configurada correctamente"
        );
      } else {
        toast.error("No se pudo completar la configuración");
      }
    } catch (error) {
      toast.error("Error al verificar el código");
      console.error("Error en complete2FASetup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Si 2FA ya está habilitado, mostrar mensaje
  if (is2FAEnabled) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Autenticación de dos factores</CardTitle>
          <CardDescription>
            La autenticación de dos factores ya está habilitada para tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Si deseas desactivar o cambiar la configuración de autenticación de
            dos factores, contacta al administrador del sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Configurar autenticación de dos factores</CardTitle>
        <CardDescription>
          Añade una capa adicional de seguridad a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <Form {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
              className="space-y-4"
            >
              <FormField
                control={phoneForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+52 1234567890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ingresa tu número de teléfono con código de país (ej. +52
                      para México)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LuLoaderCircle className="mr-2 w-4 h-4 animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  "Enviar código de verificación"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...verificationForm}>
            <form
              onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
              className="space-y-4"
            >
              <FormField
                control={verificationForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de verificación</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ingresa el código de 6 dígitos enviado a tu teléfono
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LuLoaderCircle className="mr-2 w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar código"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === "verification" && (
          <Button
            variant="outline"
            onClick={() => setStep("phone")}
            disabled={isLoading}
          >
            Volver
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TwoFactorSetup;

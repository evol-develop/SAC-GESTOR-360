import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuMailPlus, LuSend } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-base";
import { Button } from "@/components/ui/button";
import FormRichText from "@/components/form-rich-text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxForm } from "@/components/custom-combobox";
import { useNotifications } from "@/hooks/useNotifications";

const messageSchema = z.object({
  empresaId: z.string(),
  title: z.string().min(1, { message: "El título es requerido" }),
  message: z.string().min(1, { message: "El mensaje es requerido" }),
  type: z.string().min(1, { message: "El tipo es requerido" }),
});

const MessageEmpresa = () => {
  const { sendNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      type: "",
      title: "",
      message: "",
      empresaId: "all",
    },
  });

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    if (values.title === "") {
      form.setError("title", { message: "El título es requerido" });
      return;
    }
    if (values.message === "") {
      form.setError("message", { message: "El mensaje es requerido" });
      return;
    }
    try {
      sendNotification({
        ...values,
        empresaId:
          values.empresaId !== "all" ? Number(values.empresaId) : "all",
          motivo:""
      });
      toast.success("Mensaje enviado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al actualizar la tarea");
    } finally {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Enviar mensaje
          <LuMailPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        <ScrollArea className="max-h-[85dvh] p-6">
          <DialogHeader>
            <DialogTitle>Enviar mensaje a empresa(s)</DialogTitle>
            <DialogDescription>
              Envia un mensaje a los usuarios de la(s) empresa(s)
              seleccionada(s)
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid w-full grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="title"
                  label="Asunto"
                  placeholder="Ej. Reunión de equipo"
                />
                <ComboboxForm
                  form={form}
                  name="empresaId"
                  tipo="EMPRESAS"
                  label="Enviar a"
                  placeholder="Selecciona una opción"
                />
              </div>
              <FormRichText
                form={form}
                name="message"
                label="Mensaje"
                placeholder="Escribe tu mensaje aquí"
              />
              <FormInput
                form={form}
                name="type"
                label="Tipo"
                placeholder="Describe el tipo mensaje, ej. actualización"
              />
              <Button type="submit">
                Enviar <LuSend />
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MessageEmpresa;

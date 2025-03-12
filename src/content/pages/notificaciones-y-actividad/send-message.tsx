import { z } from "zod";
import { toast } from "sonner";
import { LuSend } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-base";
import { Button } from "@/components/ui/button";
import FormTextarea from "@/components/form-textarea";
import { Separator } from "@/components/ui/separator";
import { Notification } from "@/contexts/Notifications";
import { useNotifications } from "@/hooks/useNotifications";
import { MultiselectField } from "@/components/multi-select-with-all";

const messageSchema = z.object({
  to: z
    .array(z.string())
    .nonempty({ message: "Debes seleccionar al menos un destinatario" }),
  title: z.string(),
  message: z.string(),
  type: z.string(),
});

const SendMessage = () => {
  const { sendNotification } = useNotifications();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      to: [],
      title: "",
      message: "",
      type: "",
    },
  });

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    if (values.title === "") {
      form.setError("title", { message: "El título es requerido" });
      return;
    }
    if (values.message === "") {
      form.setError("message", { message: "El mensaje es requerido" });
      return;
    }
    const notification: Notification = {
      title: values.title,
      message: values.message,
      type: values.type,
      groupIds: values.to.length > 1 ? values.to : [],
      userId: values.to.length === 1 ? values.to[0] : "",
    };
    try {
      // console.log("Enviando notificación", notification);
      sendNotification(notification);
      form.reset();
      toast.success("Notificación enviada correctamente");
    } catch (error) {
      console.error("Error al enviar la notificación", error);
      toast.error("Error al enviar la notificación");
    }
  };

  return (
    <section className="flex flex-col gap-2 pb-4 text-sm size-full">
      <Separator />
      <div className="flex items-center justify-center h-full px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-lg gap-2 mx-auto"
          >
            <div className="grid w-full grid-cols-2 gap-2">
              <FormInput
                form={form}
                name="title"
                label="Asunto"
                placeholder="Ej. Reunión de equipo"
              />
              <MultiselectField
                control={form.control}
                name="to"
                label="Enviar a"
                tipo="users"
              />
            </div>
            <FormTextarea
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
            <div>
              <Button type="submit" className="w-full">
                Enviar <LuSend />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SendMessage;

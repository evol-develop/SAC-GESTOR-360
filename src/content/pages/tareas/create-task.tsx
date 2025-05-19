import { z } from "zod";
import { toast } from "sonner";
import { LuPlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { taskSchema } from "./data/schema";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-base";
import { Task } from "@/contexts/Notifications";
import { Button } from "@/components/ui/button";
import FormTextarea from "@/components/form-textarea";
import FormDatepicker from "@/components/form-datepicker";
import { ComboboxForm } from "@/components/custom-combobox";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const CreateTask = () => {
  const [open, setOpen] = useState(false);
  const { createTask } = useNotifications();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      label: ["general"],
      isCompleted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    if (values.title === "") {
      form.setError("title", { message: "El título es requerido" });
      return;
    }
    if (values.description === "") {
      form.setError("description", { message: "La descripción es requerida" });
      return;
    }
    try {
      createTask({
        ...values,
        dueDate: values.dueDate.toISOString(),
      } as Task);
      toast.success("Tarea asignada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al asignar la tarea");
    } finally {
      form.reset();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="px-2 ml-auto w-full h-8 lg:px-3 sm:w-auto"
        >
          <LuPlus />
          Asignar tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar tarea</DialogTitle>
          <DialogDescription>
            Asigna una tarea a uno de tus colaboradores. Recibirá una
            notificación con los detalles.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80dvh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormInput
                form={form}
                name="title"
                label="Título"
                placeholder="Escribe el título de la tarea"
              />
              <FormTextarea
                form={form}
                name="description"
                label="Descripción"
                placeholder="Escribe una descripción de la tarea"
              />
              <ComboboxForm
                form={form}
                name="priority"
                tipo="PRIORIDAD"
                label="Prioridad"
                placeholder="Selecciona una prioridad"
              />
              <ComboboxForm
                form={form}
                name="userId"
                tipo="USUARIOS"
                label="Asignar a"
                placeholder="Selecciona un usuario"
              />
              <FormDatepicker form={form} name="dueDate" label="Fecha límite" />
              <Button type="submit">Asignar tarea</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;

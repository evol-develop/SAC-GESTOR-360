import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateItem } from "@/api";
import { taskSchema } from "./data/schema";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-base";
import { Task } from "@/contexts/Notifications";
import { Button } from "@/components/ui/button";
import FormTextarea from "@/components/form-textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormDatepicker from "@/components/form-datepicker";
import { ComboboxForm } from "@/components/custom-combobox";
import { useState } from "react";

const EditTask = ({ task }: { task: Task }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      label: task.label,
      isCompleted: task.isCompleted,
      priority: task.priority,
      userId: task.userId,
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
      await updateItem(
        "tasks",
        task.id as string,
        {
          ...values,
          dueDate: values.dueDate.toISOString(),
        } as Task
      );
      toast.success("Tarea actualizada correctamente");
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
          <LuPencil />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <ScrollArea className="max-h-[80vh] p-6">
          <DialogHeader>
            <DialogTitle>Editar tarea</DialogTitle>
            <DialogDescription>
              Modifica los datos de la tarea seleccionada.
            </DialogDescription>
          </DialogHeader>
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
              <Button type="submit">Guardar cambios</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;

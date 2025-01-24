import * as z from "zod";

export const taskSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: "El usuario es requerido" }),
  status: z.string({ required_error: "El estado es requerido" }).optional(),
  groupIds: z.array(z.string()).optional(),
  empresaId: z.number().optional(),
  createdAt: z.string().optional(),
  senderId: z.string().optional(),
  title: z.string({ required_error: "El título es requerido" }),
  description: z.string({ required_error: "La descripción es requerida" }),
  isCompleted: z.boolean(),
  // dueDate puede ser date o string
  dueDate: z.date(),
  label: z.array(z.string()),
  priority: z.string({ required_error: "La prioridad es requerida" }),
});

export type Task = z.infer<typeof taskSchema>;

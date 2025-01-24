import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useNotifications } from "@/hooks/useNotifications";

const Tareas = () => {
  const { myTasks } = useNotifications();

  return (
    <div className="container flex flex-col flex-1 h-full gap-4 mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tareas asignadas</h2>
        <p className="text-muted-foreground">
          Aquí podrás ver las tareas que has asignado a tus colaboradores.
        </p>
      </div>
      <DataTable data={myTasks} columns={columns} />
    </div>
  );
};

export default Tareas;

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TicketMovimiento {
  id: number;
  tm: number;
  fecha: string;
  observaciones: string;
  rutaDetalle?: {
    ruta: { descripcion: string };
    fecha: string;
  };
  paquete?: { municipio?: { nombre: string } };
  year?: number;
  mes?: number;
  dia?: number;
}

const descripcionTM = (tm: number) => {
  const estados: Record<number, string> = {
    1: "En origen",
    2: "En tránsito",
    3: "Entregado",
  };
  return estados[tm] || "Desconocido";
};

const tickets: TicketMovimiento[] = [
  {
    id: 1,
    tm: 1,
    fecha: "2024-07-01T14:30:00Z",
    observaciones: "Solicitado",
    paquete: { municipio: { nombre: "Ciudad de México" } },
  },
  {
    id: 2,
    tm: 2,
    fecha: "2024-07-02T09:45:00Z",
    observaciones: "En revisión",
    rutaDetalle: { ruta: { descripcion: "Ruta 5" }, fecha: "2024-07-02" },
  },
  {
    id: 3,
    tm: 3,
    fecha: "2024-07-03T18:20:00Z",
    observaciones: "Resuelto",
  },
  {
    id: 4,
    tm: 5,
    fecha: "2024-07-03T18:20:00Z",
    observaciones: "Se subio a producción",
  },
  {
    id: 3,
    tm: 3,
    fecha: "2024-07-03T18:20:00Z",
    observaciones: "Entregado al cliente",
  },
];

export const TicketsMovimientos = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {tickets.map((step, index) => (
        <div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card className="p-4 border-l-4 shadow-md rounded-xl border-primary ">
            <CardContent className="flex items-start gap-4">
              {step.tm === 3 ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : step.tm === 2 ? (
                <Clock className="w-6 h-6 text-yellow-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {descripcionTM(step.tm)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(step.fecha), "dd/MMMM/yyyy hh:mm:ss a", {
                    locale: es,
                  })}
                </p>
                {step.tm === 1 && step.paquete?.municipio && (
                  <p className="text-sm text-secondary">
                    {step.paquete.municipio.nombre}
                  </p>
                )}
                {step.tm === 2 && step.rutaDetalle && (
                  <p className="text-sm text-secondary">
                    {step.rutaDetalle.ruta.descripcion} -{" "}
                    {format(new Date(step.rutaDetalle.fecha), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                )}
                <p className="text-sm text-info">{step.observaciones}</p>
              </div>
            </CardContent>
          </Card>

        </div>
      ))}
    </div>
  );
};

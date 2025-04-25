import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ticketComentariosInterface } from "@/interfaces/procesos/ticketInterface";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import UserAvatar from "@/components/UserAvatar";
import { Loading } from "@/components/Loading";
import SinComentarios from "./sinComentarios";

interface ComentarioPanelProps {
  titulo: string;
  comentarios: ticketComentariosInterface[];
  tipo: "CLIENTE" | "ASIGNADO";
  usuarioActualId: string;
  asignadoId: string;
  isLoading: boolean;
  etapaActual: number;
  etapaSeleccionada: number;
  onResponder: () => void;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  openComentario: (comentario: ticketComentariosInterface) => void;
}

const ComentarioPanel: React.FC<ComentarioPanelProps> = ({
  titulo,
  comentarios,
  tipo,
  usuarioActualId,
  asignadoId,
  isLoading,
  etapaActual,
  etapaSeleccionada,
  onResponder,
  onEditar,
  onEliminar,
  openComentario,
}) => {
  return (
    <div className="flex relative flex-col   h-[calc(100vh-300px)] sm:h-[calc(100vh-300px)]  rounded-sm border bg-background">
      <div className="text-xs text-center">{titulo}</div>



      {!isLoading ? (
        <>
          {/* {comentarios && comentarios.length > 0 && (
            <h1 className="text-xs font-bold text-center">COMENTARIOS</h1>
          )} */}

          <div className="h-[calc(100vh-350px)] sm:h-[calc(100vh-350px)] overflow-auto bg-gray-50">
            {comentarios && comentarios.map((step, index) => {
              const fechaValida = new Date(step.fecha);
              const fechaFormateada = !isNaN(fechaValida.getTime())
                ? format(fechaValida, "dd/MM/yyyy hh:mm:ss a", { locale: es })
                : "Fecha inválida";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="p-2 max-w-full break-words rounded-xl border-l-4 shadow-md border-primary">
                    <CardContent className="flex gap-2 justify-between items-start">
                      <div className="flex gap-2">
                        {/* <div className="mt-1 w-6 h-3 bg-gray-500 rounded-full" /> */}
                        <div className="overflow-hidden max-w-full text-xs break-words">
                          <h3 className="text-lg font-semibold text-primary">
                            <UserAvatar
                              withTooltip
                              userId={step.usuarioCrea}
                              className="size-6"
                              rounded="rounded-full"
                            />
                          </h3>
                          <p className="text-sm text-muted-foreground">{fechaFormateada}</p>
                          <h5 className="break-words">{step.comentario}</h5>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {usuarioActualId === step.usuarioCrea && (
                          <>
                            <button
                              onClick={() => onEditar(step.id.toString())}
                              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onEliminar(step.id.toString())}
                              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openComentario(step)}
                          className="px-2 py-1 text-sm text-green-600 hover:text-green-800"
                        >
                          🔗
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {comentarios && comentarios.length === 0 && <SinComentarios />}
          </div>
        </>
      ) : (
        <Loading />
      )}

      {(etapaActual === 1 || etapaActual - 1 === etapaSeleccionada) && (
        <div className="absolute right-2 bottom-2">
          <Button size="sm" className="text-xs" onClick={onResponder}>
            {comentarios && comentarios.length === 0 ? "Iniciar conversación" : "Responder"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComentarioPanel;

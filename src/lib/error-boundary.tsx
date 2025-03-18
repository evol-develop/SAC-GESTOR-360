import { Component, ErrorInfo } from "react";

// import axios from "@/lib/utils/axios";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error en React:", error, errorInfo);
    // this.logErrorToServer(error, errorInfo);
  }

  // logErrorToServer(error: Error, errorInfo: ErrorInfo) {
  //   const errorMsg = `${error.message}:${error.stack}:${errorInfo.componentStack}`;
  //   axios
  //     .post("/api/log/log-error", {
  //       tipo: "frontend",
  //       mensaje: errorMsg,
  //       stack: error.stack || "",
  //       url: window.location.href,
  //       userAgent: navigator.userAgent,
  //     })
  //     .catch(console.error);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center p-6 m-4 bg-white rounded-lg border border-gray-200 shadow-lg">
          <h2 className="dark:text-red-500 mb-2 text-2xl font-bold text-red-600">
            ¡Ups! Algo salió mal
          </h2>
          <p className="dark:text-gray-300 mb-6 text-gray-700">
            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
          </p>
          <div className="sm:flex-row flex flex-col gap-4">
            <Button variant="default" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

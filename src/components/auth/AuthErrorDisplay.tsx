import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuthErrorDisplayProps {
  error: string;
  title?: string;
}

/**
 * Componente para mostrar errores de autenticación de manera consistente
 */
const AuthErrorDisplay = ({
  error,
  title = "Error de autenticación",
}: AuthErrorDisplayProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <LuCircleAlert className="w-4 h-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default AuthErrorDisplay;

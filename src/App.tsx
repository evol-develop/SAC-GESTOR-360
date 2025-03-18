import { es } from "date-fns/locale";
import { setDefaultOptions } from "date-fns";

import { Router } from "@/routers/router";
import { Sonner } from "@/components/ui/sonner";
import ErrorBoundary from "@/lib/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  setDefaultOptions({ locale: es });
  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="light">
      <TooltipProvider>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
        <Sonner position="top-center" richColors />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

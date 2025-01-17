import { LuLoaderCircle } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

type FormFooterProps = {
  handleCreateItemClose: any;
  form: any;
  dataModal: any;
  showButton?: boolean;
};

const FormFooter = ({
  handleCreateItemClose,
  form,
  dataModal,
  showButton = true,
}: FormFooterProps) => {
  return (
    <CardFooter className="flex justify-end gap-2">
      {showButton && (
        <Button type="button" color="secondary" onClick={handleCreateItemClose}>
        {"Cancelar"}
      </Button>
      )}
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        variant="outline"
      >
        {form.formState.isSubmitting ? (
          <LuLoaderCircle className="animate-spin" />
        ) : dataModal.id === undefined ? (
          `Agregar Registro`
        ) : (
          "Guardar Cambios"
        )}
      </Button>
    </CardFooter>
  );
};

export default FormFooter;

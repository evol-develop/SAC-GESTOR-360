import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute | undefined;
  className?: string;
  focus?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormInput = ({
  form,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  className,
  focus,
  disabled = false,
  onChange,  // <-- Asegurar que la prop se recibe
}: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type || "text"}
              placeholder={placeholder || ""}
              required={required}
              className={className}
              onFocus={() => focus && form.setFocus(name)}
              disabled={disabled}
              onChange={(e) => {
                field.onChange(e); // Mantiene el comportamiento de react-hook-form
                onChange && onChange(e); // Ejecuta la función personalizada si se proporciona
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

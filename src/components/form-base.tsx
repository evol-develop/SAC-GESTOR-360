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
};

const FormInput = ({
  form,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type || "text"}
              placeholder={placeholder || ""}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

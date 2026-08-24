import type { ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  title: string;
  inputId: string;
  required?: boolean;
  placeholder?: string;
  type?: ComponentProps<"input">["type"];
  autoComplete?: ComponentProps<"input">["autoComplete"];
  field: ComponentProps<"input">;
  error?: string;
  className?: string;
  labelClassName?: string;
}

/**
 * Reusable form input built on top of the application's
 * Field and Input components.
 *
 * Responsibilities:
 * - Renders the field label and required indicator.
 * - Renders the input using the provided field props.
 * - Exposes the invalid state through the validation error.
 * - Displays the corresponding validation message.
 *
 * Form state and validation remain the responsibility of the
 * parent form.
 */
const FormInput = ({
  title,
  inputId,
  required = false,
  placeholder,
  type = "text",
  autoComplete,
  field,
  error,
  className,
  labelClassName,
}: FormInputProps) => {
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={inputId} className={`${labelClassName} gap-1`}>
        {title}

        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </FieldLabel>

      <Input
        {...field}
        id={inputId}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={isInvalid}
        className={`border-input bg-background rounded-md ${className}`}
      />

      {isInvalid && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default FormInput;

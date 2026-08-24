import type { ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps {
  title: string;
  inputId: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  field: ComponentProps<"textarea">;
  error?: string;
  className?: string;
  labelClassName?: string;
}

/**
 * Reusable form textarea built on top of the application's
 * Field and Textarea components.
 *
 * Responsibilities:
 * - Renders the field label and required indicator.
 * - Renders the textarea using the provided field props.
 * - Exposes the invalid state through the validation error.
 * - Displays the corresponding validation message.
 *
 * Form state and validation remain the responsibility of the
 * parent form.
 */
const FormTextarea = ({
  title,
  inputId,
  required = false,
  placeholder,
  rows,
  field,
  error,
  className,
  labelClassName,
}: FormTextareaProps) => {
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

      <Textarea
        {...field}
        id={inputId}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        rows={rows}
        className={`border-input bg-background rounded-md ${className}`}
      />

      {isInvalid && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default FormTextarea;

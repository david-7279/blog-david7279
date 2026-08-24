"use client";

import React from "react";
import { useFormContact } from "@/components/footer/hooks/use-form-contact";
import { FieldGroup } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import FormInput from "@/components/ui/form/form-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FormTextarea from "@/components/ui/form/form-textarea";
import { cn } from "@/lib/utils";

const FORM_ID = "form-contact";
const FORM_BUTTON = "Send Message";

const formFieldClassName =
  "w-full rounded-lg border-0 bg-primary-foreground px-4 text-primary shadow-none placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm";
const formLabelClassName =
  "block text-[10px] font-mono font-normal text-primary-foreground tracking-[0.5px] uppercase";

const FormContact = () => {
  const { control, handleSubmit, onSubmit, isSubmitting } = useFormContact();

  return (
    <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              title="Name"
              field={field}
              inputId="form-contact-name"
              placeholder="David Vieira"
              autoComplete="name"
              type="text"
              error={fieldState.error?.message}
              className={cn(formFieldClassName, "h-10 py-2.5")}
              labelClassName={formLabelClassName}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              title="Email"
              field={field}
              inputId="form-contact-email"
              placeholder="david.dev7279@outlook.com"
              autoComplete="email"
              type="email"
              error={fieldState.error?.message}
              className={cn(formFieldClassName, "h-10 py-2.5")}
              labelClassName={formLabelClassName}
            />
          )}
        />

        <Controller
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <FormTextarea
              title="Message"
              field={field}
              inputId="form-contact-message"
              placeholder="What’s on your mind?"
              rows={4}
              error={fieldState.error?.message}
              className={cn(formFieldClassName, "resize-none py-4")}
              labelClassName={formLabelClassName}
            />
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-2.5 rounded-full bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors tracking-[-0.03em] h-10"
        >
          {isSubmitting ? <Spinner /> : FORM_BUTTON}
        </Button>
      </FieldGroup>
    </form>
  );
};
export default FormContact;

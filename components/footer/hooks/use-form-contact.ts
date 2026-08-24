import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ContactFormValues,
  contactSchema,
} from "@/components/footer/form/schemas/contact-schema";
import { toast } from "@/components/ui/toast";

/**
 * Generic error message displayed when contact form submission fails.
 *
 * Contact form errors are intentionally normalized so that
 * implementation details returned by Supabase are not exposed
 * directly to the user.
 */
const CONTACT_ERROR =
  "We were unable to submit your contact information. Please try again later.";

/**
 * Provides the complete form state and submission logic for the
 * contact form.
 *
 * Responsibilities:
 * - Configures React Hook Form.
 * - Connects the form to the Zod validation schema.
 * - Defines initial form values.
 * - Submits validated credentials through the authentication service.
 * - Exposes authentication errors to the UI.
 *
 * This hook intentionally does not perform navigation.
 * Authentication state changes are handled by the application's
 * authentication and routing layers.
 */
export function useFormContact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onSubmit",
  });

  /**
   * Handles the contact form submission.
   *
   * React Hook Form guarantees that this callback receives values
   * that have already passed the configured Zod validation.
   */
  const onSubmit = async (values: ContactFormValues): Promise<void> => {
    try {
    } catch (error) {
      console.error("useFormContact: contact form submission failed", error);

      form.setError("root", {
        type: "server",
        message: error instanceof Error ? error.message : CONTACT_ERROR,
      });

      toast.add({
        title: "Error submitting contact form",
        description: error instanceof Error ? error.message : CONTACT_ERROR,
        type: "error",
      });
    }
  };

  return {
    ...form,

    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    serverError: form.formState.errors.root?.message ?? null,
  } as const;
}

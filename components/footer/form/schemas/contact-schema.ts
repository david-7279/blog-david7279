import { z } from "zod";

/**
 * Minimum number of characters required for a user's name.
 */
const NAME_MIN = 2;

/**
 * Maximum number of characters allowed for a user's name.
 */
const NAME_MAX = 100;

/**
 * Maximum number of characters allowed for an email address.
 */
const EMAIL_MAX = 255;

/**
 * Maximum number of characters allowed for a message.
 */
const MESSAGE_MAX = 255;

/**
 * Minimum number of characters required for a message.
 */
const MESSAGE_MIN = 2;

/**
 * Centralized validation messages used by the contact form schema.
 *
 * Keeping messages in one object avoids duplicating strings across
 * the schemas and makes future changes easier to maintain.
 */
const MESSAGES = {
  name: {
    required: "Enter a valid name.",
    max: `The name cannot exceed ${NAME_MAX} characters.`,
  },
  email: {
    required: "Enter a valid email address.",
    max: `The email cannot exceed ${EMAIL_MAX} characters.`,
  },
  message: {
    required: "Enter a valid message.",
    max: `The message cannot exceed ${MESSAGE_MAX} characters.`,
  },
} as const;

/**
 * Checks whether a string contains ASCII control characters.
 *
 * ASCII control characters are non-printable characters in the ranges
 * 0x00-0x1F and 0x7F. These characters should not normally appear in
 * user-entered authentication or profile fields.
 *
 * Examples include null characters, line breaks, tabs, and other
 * non-printable control characters.
 *
 * The check is performed manually instead of using a regular expression
 * to keep the validation logic explicit and easy to understand.
 *
 * @param value The string to validate.
 * @returns `true` when a control character is present; otherwise `false`.
 */
function containsAsciiControlChars(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);

    /*
     * ASCII control characters occupy 0x00-0x1F, while 0x7F
     * represents the DEL character.
     */
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      return true;
    }
  }

  return false;
}

/**
 * Validates user name.
 *
 * The schema trims surrounding whitespace, enforces the configured
 * length limit, validates the email format, and rejects ASCII control
 * characters that should not be accepted as part of an email address.
 */
export const nameSchema = z
  .string()
  .min(NAME_MIN, { message: MESSAGES.name.required })
  .max(NAME_MAX, { message: MESSAGES.name.max })
  .refine((value) => !containsAsciiControlChars(value), {
    message: MESSAGES.name.required,
  });

/**
 * Validates user email addresses.
 *
 * The schema trims surrounding whitespace, enforces the configured
 * length limit, validates the email format, and rejects ASCII control
 * characters that should not be accepted as part of an email address.
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: MESSAGES.email.required })
  .max(EMAIL_MAX, { message: MESSAGES.email.max })
  .email({ message: MESSAGES.email.required })
  .refine((value) => !containsAsciiControlChars(value), {
    message: MESSAGES.email.required,
  });

/**
 * Validates a user's message.
 *
 * The schema removes surrounding whitespace, requires the message to
 * contain at least the configured minimum number of characters,
 * enforces the maximum length, and rejects ASCII control characters.
 */
export const messageSchema = z
  .string()
  .trim()
  .min(MESSAGE_MIN, { message: MESSAGES.message.required })
  .max(MESSAGE_MAX, { message: MESSAGES.message.max })
  .refine((value) => !containsAsciiControlChars(value), {
    message: MESSAGES.message.required,
  });

/**
 * Schema used by the contact form.
 *
 * Client-side validation provides immediate feedback only.
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

export type ContactFormValues = z.infer<typeof contactSchema>;

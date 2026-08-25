import type { ComponentPropsWithoutRef, ReactElement } from "react";

import { CodeBlock } from "@/components/ui/code-block";

type PostCodeBlockProps = ComponentPropsWithoutRef<"pre">;

type CodeElementProps = ComponentPropsWithoutRef<"code">;

/**
 * Extracts the language from MDX's generated code class.
 *
 * MDX generates:
 *
 * <code className="language-tsx">
 *
 * This returns:
 *
 * "tsx"
 */
function getLanguage(className?: string): string {
  if (!className) {
    return "text";
  }

  const match = className.match(/(?:^|\s)language-([^\s]+)/);

  return match?.[1] ?? "text";
}

/**
 * Normalizes common language aliases to languages
 * supported by Shiki.
 */
function normalizeLanguage(language: string): string {
  const aliases: Record<string, string> = {
    shell: "bash",
    sh: "bash",
    console: "text",
    plaintext: "text",
    plain: "text",
    md: "markdown",
    yml: "yaml",
    ts: "typescript",
    js: "javascript",
    jsx: "jsx",
    tsx: "tsx",
  };

  return aliases[language.toLowerCase()] ?? language;
}

/**
 * Extracts the raw code text from the MDX <code> element.
 */
function getCode(children: ReactElement<CodeElementProps>): string {
  const value = children.props.children;

  if (typeof value === "string") {
    return value.replace(/\n$/, "");
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .join("")
      .replace(/\n$/, "");
  }

  return String(value ?? "").replace(/\n$/, "");
}

/**
 * Renders fenced MDX code blocks using the custom CodeBlock UI.
 *
 * Example MDX:
 *
 * ```tsx
 * const hello = "world";
 * ```
 *
 * becomes:
 *
 * <CodeBlock
 *   code="const hello = ..."
 *   language="tsx"
 * />
 */
export function PostCodeBlock({ children }: PostCodeBlockProps) {
  const codeElement = children as ReactElement<CodeElementProps>;

  if (
    !codeElement ||
    typeof codeElement !== "object" ||
    codeElement.type !== "code"
  ) {
    return <pre>{children}</pre>;
  }

  const className = codeElement.props.className;

  const language = normalizeLanguage(getLanguage(className));

  const code = getCode(codeElement);

  return (
    <CodeBlock
      code={code}
      language={language}
      showLineNumbers
      className="not-prose my-6"
    />
  );
}

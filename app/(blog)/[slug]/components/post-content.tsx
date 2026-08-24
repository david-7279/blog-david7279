import { MDXRemote } from "next-mdx-remote/rsc";

type PostContentProps = {
  content: string;
};

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const components = {
  h2: (props: any) => {
    const text = String(props.children);
    const id = slugify(text);

    return (
      <h2 id={id} className="scroll-mt-28" {...props}>
        {props.children}
      </h2>
    );
  },
  h3: (props: any) => {
    const text = String(props.children);
    const id = slugify(text);

    return (
      <h3 id={id} className="scroll-mt-28" {...props}>
        {props.children}
      </h3>
    );
  },
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none mt-10
                prose-headings:font-semibold
                prose-ul:my-5
                prose-li:my-1.5
                prose-a:text-primary"
    >
      <MDXRemote source={content} components={components} />
    </div>
  );
}

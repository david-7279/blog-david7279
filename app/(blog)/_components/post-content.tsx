import { MDXRemote } from "next-mdx-remote/rsc";

type PostContentProps = {
  content: string;
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none mt-10 prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg">
      <MDXRemote source={content} />
    </div>
  );
}

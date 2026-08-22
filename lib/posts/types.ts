export type PostMeta = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  published: boolean;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

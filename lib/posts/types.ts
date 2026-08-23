export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  author: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

export type PostWithStats = PostMeta & {
  views: number;
  upvotes: number;
  downvotes: number;
};

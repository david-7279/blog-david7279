export type PostStats = {
  views: number;
  upvotes: number;
};

export type ToggleUpvoteResult = PostStats & {
  voted: boolean;
};

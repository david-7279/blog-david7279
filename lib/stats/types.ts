/**
 * Aggregated engagement statistics for a post.
 *
 * Views and upvotes are stored independently from the post content
 * because they represent dynamic application data.
 */
export type PostStats = {
  views: number;
  upvotes: number;
};

/**
 * Result returned after toggling a visitor's upvote.
 *
 * `voted` indicates whether the visitor currently has an active
 * upvote for the post after the operation has completed.
 */
export type ToggleUpvoteResult = PostStats & {
  voted: boolean;
};

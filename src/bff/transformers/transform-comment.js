export const transformComment = (comment) => ({
	id: comment.id,
	postId: comment.postId,
	authorId: comment.author_id || comment.authorId,
	content: comment.content,
	publishedAt: comment.publishedAt || comment.published_at || '',
});


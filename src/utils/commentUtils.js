export const organizeComments = (comments) => {
    // First, separate comments and replies
    const mainComments = comments.filter(comment => !comment.parentCommentId);
    const replies = comments.filter(comment => comment.parentCommentId);
  
    // Create a map of comments with their replies
    const commentMap = mainComments.reduce((acc, comment) => {
      acc[comment.commentId] = {
        ...comment,
        replies: replies.filter(reply => reply.parentCommentId === comment.commentId)
      };
      return acc;
    }, {});
  
    // Convert map back to array and sort by creation date
    return Object.values(commentMap).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };
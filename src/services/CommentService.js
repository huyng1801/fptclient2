import ApiService from './ApiService';

const CommentService = {
  getCommentById: async (id) => {
    try {
      const response = await ApiService.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  },

  createNewComment: async (commentData) => {
    try {
      const response = await ApiService.post('/comments', commentData);
      return response.data; // Assuming the API returns the new comment's ID or details
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  viewAllComments: async (filter, pagingModel) => {
    try {
      const response = await ApiService.get('/comments', {
        params: { ...filter, ...pagingModel }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  updateCommentInfo: async (id, commentData) => {
    try {
      const response = await ApiService.patch(`/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }
};

export default CommentService;

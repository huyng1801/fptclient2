import api from './ApiService';

const MentorshipService = {
  getMentorshipById: async (id) => {
    try {
      const response = await api.get(`/mentorships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentorship:', error);
      throw error;
    }
  },

  getAllMentorships: async (filter = {}, pagingModel = { page: 1, size: 10 }) => {
    try {
      const params = { ...filter, ...pagingModel };
      const response = await api.get('/mentorships', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentorships:', error);
      throw error;
    }
  },

  createMentorship: async (mentorshipData) => {
    try {
      const response = await api.post('/mentorships', {
        alumniId: mentorshipData.alumniId,
        requestMessage: mentorshipData.requestMessage,
        type: mentorshipData.type || 'PENDING',
        status: mentorshipData.status || 'ACTIVE'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating mentorship:', error);
      throw error;
    }
  },

  updateMentorship: async (id, mentorshipData) => {
    try {
      const response = await api.patch(`/mentorships/${id}`, mentorshipData);
      return response.data;
    } catch (error) {
      console.error('Error updating mentorship:', error);
      throw error;
    }
  },

  deleteMentorship: async (id) => {
    try {
      await api.delete(`/mentorships/${id}`);
    } catch (error) {
      console.error('Error deleting mentorship:', error);
      throw error;
    }
  }
};

export default MentorshipService;
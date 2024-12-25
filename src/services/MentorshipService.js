import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
});

class MentorshipService {
  static async getMentorshipById(id) {
    try {
      const response = await apiClient.get(`/mentorships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentorship:', error);
      throw error;
    }
  }

  static async getAllMentorships(filter = {}, pagingModel = { page: 1, pageSize: 10 }) {
    try {
      const params = {
        ...filter,
        ...pagingModel
      };
      const response = await apiClient.get('/mentorships', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentorships:', error);
      throw error;
    }
  }

  static async createMentorship(mentorshipData) {
    try {
      const response = await apiClient.post('/mentorships', mentorshipData);
      return response.data;
    } catch (error) {
      console.error('Error creating mentorship:', error);
      throw error;
    }
  }

  static async updateMentorship(id, mentorshipData) {
    try {
      const response = await apiClient.patch(`/mentorships/${id}`, mentorshipData);
      return response.data;
    } catch (error) {
      console.error('Error updating mentorship:', error);
      throw error;
    }
  }

  static async deleteMentorship(id) {
    try {
      await apiClient.delete(`/mentorships/${id}`);
    } catch (error) {
      console.error('Error deleting mentorship:', error);
      throw error;
    }
  }
}

export default MentorshipService;
import api from './ApiService';

const PhoBertService = {
  findBestMatchingCV: async (jobPostId) => {
    try {
      // Include the idJobPost as a query parameter in the URL
      const response = await api.post(`/phobert/find-best-matching-cv?idJobPost=${jobPostId}`);
      return response.data;
    } catch (error) {
      console.error('Error in PhoBertService:', error);
      throw error;
    }
  }
};

export default PhoBertService;

import ApiService, { setAuthToken } from './ApiService'; // Import the ApiService instance

const MajorCodeService = {
  // Function to create a new major code
  async createMajorCode(data, token) {
    try {
      if (token) {
        setAuthToken(token);
      }

      const response = await ApiService.post('/majorcodes', data);
      return response.data; // Return the response data (e.g., the created MajorCode)
    } catch (error) {
      console.error('Error creating MajorCode:', error);
      throw error;
    }
  },

  // Function to get a major code by ID
  async getMajorCodeById(id, token) {
    try {
      if (token) {
        setAuthToken(token);
      }

      const response = await ApiService.get(`/majorcodes/${id}`);
      return response.data; // Return the response data (e.g., the MajorCode)
    } catch (error) {
      console.error('Error fetching MajorCode by ID:', error);
      throw error;
    }
  },

  // Function to update a major code by ID
  async updateMajorCode(id, data, token) {
    try {
      if (token) {
        setAuthToken(token);
      }

      const response = await ApiService.put(`/majorcodes/${id}`, data);
      return response.data; 
    } catch (error) {
      console.error('Error updating MajorCode:', error);
      throw error;
    }
  },

  async getAllMajorCodes() {
    try {

      const response = await ApiService.get(`/majorcodes`, {
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching MajorCodes:', error);
      throw error;
    }
  },
};

export default MajorCodeService;

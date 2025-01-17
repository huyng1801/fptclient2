import ApiService from './ApiService';

const MajorCodeService = {
  // Function to create a new major code
  async createMajorCode(data) {
    try {
      console.log(data);
      const response = await ApiService.post('/majorcodes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating MajorCode:', error);
      throw error;
    }
  },

  // Function to get a major code by ID
  async getMajorCodeById(id) {
    try {
      const response = await ApiService.get(`/majorcodes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching MajorCode by ID:', error);
      throw error;
    }
  },

  // Function to update a major code by ID
  async updateMajorCode(id, data) {
    try {
      const response = await ApiService.put(`/majorcodes/${id}`, data);
      return response.data; 
    } catch (error) {
      console.error('Error updating MajorCode:', error);
      throw error;
    }
  },

  // Function to get all major codes with filter and pagination
  async getAllMajorCodes(filter = {}, pagingModel = { page: 1, size: 10 }) {
    try {
      const params = {
        ...filter,
        page: pagingModel.page,
        size: pagingModel.size
      };

      const response = await ApiService.get('/majorcodes', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching MajorCodes:', error);
      throw error;
    }
  },
};

export default MajorCodeService;
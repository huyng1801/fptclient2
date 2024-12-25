import ApiService from './ApiService';

const CVService = {
  /**
   * Get a CV by its ID
   * @param {number} id - The ID of the CV
   * @returns {Promise} - Axios response promise
   */
  getCVById: (id) => {
    return ApiService.get(`/cv/${id}`);
  },

  /**
   * Get all CVs with filtering and pagination
   * @param {object} filter - Filters for the CVs (e.g., address, gender)
   * @param {object} pagingModel - Paging options (e.g., page, pageSize)
   * @returns {Promise} - Axios response promise
   */
  viewAllCV: (filter = {}, pagingModel = { page: 1, pageSize: 10 }) => {
    const params = { ...filter, ...pagingModel };
    return ApiService.get('/cvs', { params });
  },

  /**
   * Get a CV by user ID
   * @param {number} userId - The ID of the user
   * @returns {Promise} - Axios response promise
   */
  getCVByUserId: (userId) => {
    return ApiService.get(`/cvs/user/${userId}`);
  },

  /**
   * Create a new CV
   * @param {object} cvData - The data for the new CV
   * @returns {Promise} - Axios response promise
   */
  createNewCV: (cvData) => {
    return ApiService.post('/cvs', cvData);
  },

  /**
   * Update an existing CV by ID
   * @param {number} id - The ID of the CV to update
   * @param {object} cvData - The updated CV data
   * @returns {Promise} - Axios response promise
   */
  updateCVInfo: (id, cvData) => {
    return ApiService.patch(`/cv/${id}`, cvData);
  },
};

export default CVService;

import ApiService from './ApiService';

/**
 * Service for handling job application API operations
 */
class JobApplicationService {
  /**
   * Get a job application by ID
   * @param {number} id - The ID of the job application
   * @returns {Promise} API response
   */
  static getJobApplicationById(id) {
    return ApiService.get(`/jobapplications/${id}`);
  }

  /**
   * Get all job applications with filtering and pagination
   * @param {Object} filter - Filters for job applications
   * @param {Object} pagingModel - Paging options (page, pageSize)
   * @returns {Promise} API response
   */
  static viewAllJobApplications(filter = {}, pagingModel = { page: 1, pageSize: 10 }) {
    const params = { ...filter, ...pagingModel };
    return ApiService.get('/jobapplications', { params });
  }

  /**
   * Create a new job application
   * @param {Object} applicationData - The job application data
   * @returns {Promise} API response
   */
  static createNewJobApplication(applicationData) {
    return ApiService.post('/jobapplications', applicationData);
  }

  /**
   * Update a job application
   * @param {number} id - The ID of the job application
   * @param {Object} applicationData - Updated application data
   * @returns {Promise} API response
   */
  static updateJobApplicationInfo(id, applicationData) {
    return ApiService.patch(`/jobapplications/${id}`, applicationData);
  }
}

export default JobApplicationService;
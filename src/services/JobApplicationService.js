import ApiService from './ApiService';

/**
 * Service for handling job application API operations
 */
class JobApplicationService {

  static getJobApplicationById(id) {
    return ApiService.get(`/jobapplications/${id}`);
  }


  static viewAllJobApplications(filter = {}, pagingModel = { page: 1, pageSize: 10 }) {
    const params = { ...filter, ...pagingModel };
    return ApiService.get('/jobapplications', { params });
  }

  static createNewJobApplication(applicationData) {
    return ApiService.post('/jobapplications', applicationData);
  }

  static updateJobApplicationInfo(id, applicationData) {
    return ApiService.patch(`/jobapplications/${id}`, applicationData);
  }
}

export default JobApplicationService;
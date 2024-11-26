import ApiService from './ApiService'; // Assuming ApiService is already set up to make HTTP requests

const JobPostService = {
  // Function to fetch a single job post by its ID
  getJobPostById: async (id) => {
    try {
      const response = await ApiService.get(`/jobposts/${id}`);
      return response.data; // Returns the job post details
    } catch (error) {
      console.error('Error fetching job post by ID:', error);
      throw error;
    }
  },

  // Function to create a new job post
  createJobPost: async (jobPostData) => {
    try {
      const response = await ApiService.post('/jobposts', jobPostData);
      return response.data; // Returns the job post ID after creation
    } catch (error) {
      console.error('Error creating job post:', error);
      throw error;
    }
  },

  // Function to update an existing job post
  updateJobPost: async (id, jobPostData) => {
    try {
      const response = await ApiService.patch(`/jobposts/${id}`, jobPostData);
      return response.data; // Returns the status message ("UpdateStatusSuccess" or "UpdateStatusFailed")
    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  },

  // Function to fetch all job posts with filtering and pagination
  getAllJobPosts: async (filter, pagingModel) => {
    try {
      const params = {
        ...filter, // Optional filtering parameters
        ...pagingModel, // Pagination parameters
      };
      const response = await ApiService.get('/jobposts', { params });
      return response.data; // Returns the paginated list of job posts
    } catch (error) {
      console.error('Error fetching all job posts:', error);
      throw error;
    }
  }
};

// Default export of the JobPostService object
export default JobPostService;

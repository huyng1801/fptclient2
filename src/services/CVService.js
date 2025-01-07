import ApiService from './ApiService';

const CVService = {
  getCVById: (id) => {
    return ApiService.get(`/cvs/${id}`);
  },
  viewAllCV: (filter = {}, pagingModel = { page: 1, pageSize: 10 }) => {
    const params = { ...filter, ...pagingModel };
    return ApiService.get('/cvs', { params });
  },

  getCVByUserId: (userId) => {
    return ApiService.get(`/cvs/user/${userId}`);
  },

  createNewCV: (cvData) => {
    return ApiService.post('/cvs', cvData);
  },
  updateCVInfo: (id, cvData) => {
    return ApiService.patch(`/cvs/${id}`, cvData);
  },
};

export default CVService;

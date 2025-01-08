import api from './ApiService';

const ScheduleService = {
  getScheduleById: async (id) => {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  getAllSchedules: async (filter = {}, pagingModel = { page: 1, size: 10 }) => {
    try {
      const params = { ...filter, ...pagingModel };
      const response = await api.get('/schedules', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.patch(`/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }
};

export default ScheduleService;
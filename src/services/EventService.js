import ApiService from './ApiService';  // Importing the base API service

const EventService = {
  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await ApiService.post('/events', eventData);
      return response.data;  // Returns the ID of the newly created event
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await ApiService.get(`/events/${id}`);
      return response.data;  // Returns event details
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  },

  // Update event information
  updateEvent: async (id, eventData) => {
    try {
      await ApiService.put(`/events/${id}`, eventData);
      return true;  // Return true if update was successful
    } catch (error) {
      console.error('Error updating event:', error);
      return false;  // Return false if update failed
    }
  },

  // View all events with optional filters and pagination
  getAllEvents: async (filter, pagingModel) => {
    try {
      const params = {
        ...filter,
        ...pagingModel,
      };
      const response = await ApiService.get('/events', { params });
      return response.data;  // Returns paginated events list
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
};

export default EventService;  // Default export of the service object

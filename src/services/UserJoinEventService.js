import ApiService from './ApiService';

const UserJoinEventService = {
  /**
   * Fetch all user join events with filters and pagination.
   * @param {Object} filter - Filters for user join events (e.g., { UserId, EventId, Rating }).
   * @param {Object} pagingModel - Pagination model (e.g., { page, pageSize }).
   * @returns {Promise} Axios response with the list of user join events.
   */
  viewAllUserJoinEvents: async (filter = {}, pagingModel = {}) => {
    try {
      const response = await ApiService.get('/user-join-events/view-all', {
        params: { ...filter, ...pagingModel },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user join events:', error);
      throw error;
    }
  },

  /**
   * Create a new user join event.
   * @param {Object} userJoinEventInfo - The data for the new user join event.
   * @returns {Promise} Axios response with the created user join event ID.
   */
  createUserJoinEvent: async (userJoinEventInfo) => {
    try {
      const response = await ApiService.post('/user-join-events', userJoinEventInfo);
      return response.data;
    } catch (error) {
      console.error('Error creating user join event:', error);
      throw error;
    }
  },

  /**
   * Fetch a single user join event by its ID.
   * @param {number} id - The ID of the user join event.
   * @returns {Promise} Axios response with the user join event data.
   */
  getUserJoinEventById: async (id) => {
    try {
      const response = await ApiService.get(`/user-join-events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user join event with ID: ${id}`, error);
      throw error;
    }
  },

  /**
   * Update an existing user join event by its ID.
   * @param {number} id - The ID of the user join event to update.
   * @param {Object} userJoinEventInfo - The updated data for the user join event.
   * @returns {Promise} Axios response with no content.
   */
  updateUserJoinEvent: async (id, userJoinEventInfo) => {
    try {
      const response = await ApiService.put(`/user-join-events/${id}`, userJoinEventInfo);
      return response.data;
    } catch (error) {
      console.error(`Error updating user join event with ID: ${id}`, error);
      throw error;
    }
  },
};

export default UserJoinEventService;

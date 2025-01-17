import ApiService from './ApiService'; // Import the ApiService instance for making API calls

// Function to get user details by ID
const getUser = async (userId) => {
  try {
    const response = await ApiService.get(`/users/${userId}`);
    return response.data; // Return the user data from the response
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // Propagate the error to the calling function
  }
};

// Function to get all users with optional filters and pagination
const getAllUsers = async (filter = {}, pagingModel = { page: 1, size: 10 }) => {
  try {
    const response = await ApiService.get('/users', {
      params: {
        ...filter,
        page: pagingModel.page,
        size: pagingModel.size,
      },
    });
    return response.data; // Return the list of users from the response
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Propagate the error to the calling function
  }
};

// Function to update user information
const updateUserInfo = async (userId, userInfo) => {
  try {
    const response = await ApiService.patch(`/users/${userId}`, userInfo);
    return response.data; // Return the response from the API
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Propagate the error to the calling function
  }
};

// Function to update user information
const createUser = async (userInfo) => {
  try {
    userInfo.password = "12345678";
    const response = await ApiService.post(`/auth/register`, userInfo);
    return response.data; // Return the response from the API
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Propagate the error to the calling function
  }
};

// Export the functions as a default export
const UserService = {
  createUser,
  getUser,
  getAllUsers,
  updateUserInfo,
};

export default UserService;

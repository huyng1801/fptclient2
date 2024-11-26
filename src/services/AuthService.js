import ApiService from './ApiService'; // Import the configured ApiService

// Google Login
export const handleGoogleLogin = async (token) => {
  try {
    const response = await ApiService.post('/users/login', {
      token: token, // Adjust the payload as per your API contract
    });

    return response.data; // Return user data or token received from the API
  } catch (error) {
    console.error('Error during Google login:', error.response || error.message);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

// Email and Password Login
export const handleEmailPasswordLogin = async (email, password) => {
  try {
    const response = await ApiService.post('/auth/login', {
      email: email,
      password: password,
    });

    return response.data; // Return user data or token received from the API
  } catch (error) {
    console.error('Error during login:', error.response || error.message);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

// Export default object for usability
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  handleGoogleLogin,
  handleEmailPasswordLogin,
};

import ApiService from './ApiService'; // Import the configured ApiService

// Define the POSTS_ENDPOINT relative to the base URL
const POSTS_ENDPOINT = '/posts';

// Function to create a new post
const createPost = async (postData) => {
  try {
    const response = await ApiService.post(POSTS_ENDPOINT, postData);
    if (response.status === 201) {
      return response.data; // Assuming response.data contains the created post data or ID
    }
    throw new Error('Failed to create post');
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Propagate the error
  }
};

// Function to get a post by ID
const getPostById = async (postId) => {
  try {
    const response = await ApiService.get(`${POSTS_ENDPOINT}/${postId}`);
    if (response.status === 200) {
      return response.data; // Return the post data
    }
    throw new Error('Failed to fetch post');
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error; // Propagate the error
  }
};

// Function to fetch all posts with optional filters and pagination
const getAllPosts = async (filter = {}, pagingModel = { page: 1, size: 10 }) => {
  try {
    const response = await ApiService.get(POSTS_ENDPOINT, {
      params: { ...filter, ...pagingModel },
    });
    if (response.status === 200) {
      return response.data; // Return the list of posts
    }
    throw new Error('Failed to fetch posts');
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Propagate the error
  }
};

// Function to update a post by ID
const updatePost = async (postId, postData) => {
  try {
    const response = await ApiService.patch(`${POSTS_ENDPOINT}/${postId}`, postData);
    if (response.status === 200) {
      return response.data; // Assuming response contains a success message or the updated post data
    }
    throw new Error('Failed to update post');
  } catch (error) {
    console.error(`Error updating post with ID ${postId}:`, error);
    throw error; // Propagate the error
  }
};

// Export the functions for use in other modules
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
};

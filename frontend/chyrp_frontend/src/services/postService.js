// src/services/postService.js
import API from './api';
import { getCSRFToken } from './auth';

// Create post
export const createPost = async (formData) => {
  const csrfRes = await getCSRFToken();
  const csrfToken = csrfRes.data.csrfToken;

  return API.post('posts/create/', formData, {
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get single post
export const fetchPost = (postId) =>
  API.get(`posts/${postId}/`);

// Update post
export const updatePost = async (postId, data) => {
  const csrfRes = await getCSRFToken();
  const csrfToken = csrfRes.data.csrfToken;

  return API.patch(`posts/${postId}/`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    },
  });
};


// Delete post
export const deletePost = async (postId) => {
  const csrfRes = await getCSRFToken();
  const csrfToken = csrfRes.data.csrfToken;

  return API.delete(`posts/${postId}/`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
  });
};

// Comments
export const fetchComments = (postId) =>
  API.get(`comments/?post=${postId}`);

export const addComment = (postId, message) =>
  API.post('comments/', { post: postId, message });

// Likes (use toggle only)
export const toggleLike = (postId) =>
  API.post('likes/toggle/', { post_id: postId });

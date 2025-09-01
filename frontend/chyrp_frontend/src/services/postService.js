// src/services/postService.js
import API from './api';
import { getCSRFToken } from './auth';

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

// Comments
export const fetchComments = (postId) =>
  API.get(`comments/?post=${postId}`);
export const addComment = (postId, message) =>
  API.post('comments/', { post: postId, message });

// Likes (use toggle only)
export const toggleLike = (postId) =>
  API.post('likes/toggle/', { post_id: postId });

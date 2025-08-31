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

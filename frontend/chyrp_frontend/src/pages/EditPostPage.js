import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Typography, Snackbar, Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { updatePost } from '../services/postService';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: ''
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    API.get(`/posts/${id}/`)
      .then(res => {
        const post = res.data;
        setForm({
          title: post.title || '',
          content: post.content || ''
        });
      })
      .catch(err => {
        setSnackbar({
          open: true,
          message: 'Error loading post!',
          severity: 'error'
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, {
        title: form.title,
        content: form.content,
      });
      setSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate(`/posts/${id}`), 1200);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update post!',
        severity: 'error'
      });
    }
  };

  return (
    <div className="edit-post-container">
      <Typography variant="h4" className="page-title">Edit Post</Typography>

      {!loading && (
        <form onSubmit={handleSubmit} className="edit-post-form">
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ maxLength: 120 }}
            helperText={`${form.title.length}/120`}
          />

          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={6}
          />

          <Button variant="contained" type="submit">
            Save Changes
          </Button>
        </form>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EditPostPage;

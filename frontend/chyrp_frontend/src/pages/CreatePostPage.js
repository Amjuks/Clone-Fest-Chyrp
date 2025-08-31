import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, MenuItem } from '@mui/material';
import { createPost } from '../services/postService';
import { getCurrentUser } from '../services/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePostPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    hashtags: '',
    image: null,
    video: null,
    attachments: [],
  });

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));

    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('content', form.content);
    data.append('category', form.category);
    data.append('hashtags', form.hashtags);

    if (form.image?.[0]) data.append('image', form.image[0]);
    if (form.video?.[0]) data.append('video', form.video[0]);

    for (let i = 0; i < Math.min(form.attachments.length, 3); i++) {
      data.append('attachments', form.attachments[i]);
    }

    try {
      await createPost(data);
      alert('Post created!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to create post.');
    }
  };

  return (
    <div className="create-post-container">
      <Typography variant="h4" className="title">Create New Post</Typography>
      <form onSubmit={handleSubmit} className="post-form">

        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          helperText="Enter a clear and descriptive post title"
        />

        <TextField
          label="Content"
          name="content"
          value={form.content}
          onChange={handleChange}
          fullWidth
          multiline
          rows={6}
          required
          helperText="Write your main content here"
        />

        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          select
          fullWidth
          required
          helperText="Choose a relevant category"
        >
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Hashtags"
          name="hashtags"
          value={form.hashtags}
          onChange={handleChange}
          fullWidth
          helperText="Separate hashtags with commas (e.g. travel, food, dev)"
        />

        <div className="file-upload-group">
          <label>Cover Image (optional)</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
          {form.image?.[0] && <p className="filename">📷 {form.image[0].name}</p>}
        </div>

        <div className="file-upload-group">
          <label>Video (optional)</label>
          <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
          {form.video?.[0] && <p className="filename">🎞️ {form.video[0].name}</p>}
        </div>

        <div className="file-upload-group">
          <label>Attachments (optional, max 3)</label>
          <input type="file" name="attachments" multiple onChange={handleFileChange} />
          {form.attachments?.length > 0 && (
            <ul className="filename-list">
              {[...form.attachments].slice(0, 3).map((file, i) => (
                <li key={i}>📎 {file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <Button variant="contained" color="primary" type="submit">Submit Post</Button>
      </form>
    </div>
  );
}

export default CreatePostPage;

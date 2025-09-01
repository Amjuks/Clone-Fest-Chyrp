import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, MenuItem, Chip,
} from '@mui/material';
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
    hashtags: [],
    image: null,
    video: null,
    attachments: [],
  });
  const [hashtagInput, setHashtagInput] = useState('');

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

  const handleHashtagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && hashtagInput.trim()) {
      e.preventDefault();
      if (!form.hashtags.includes(hashtagInput.trim())) {
        setForm({ ...form, hashtags: [...form.hashtags, hashtagInput.trim()] });
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag) => {
    setForm({ ...form, hashtags: form.hashtags.filter(ht => ht !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('content', form.content);
    data.append('category', form.category);
    data.append('hashtags', form.hashtags.join(','));

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
      <Typography variant="h4" className="title">✨ Create New Post</Typography>

      <form onSubmit={handleSubmit} className="post-form">

        {/* Title */}
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          helperText={`${form.title.length}/120 characters`}
          inputProps={{ maxLength: 120 }}
        />

        {/* Content */}
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

        {/* Category */}
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

        {/* Hashtags */}
        <div className="hashtags-field">
          <TextField
            label="Hashtags"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            fullWidth
            helperText="Press Enter or comma to add"
          />
          <div className="hashtags-preview">
            {form.hashtags.map((tag, idx) => (
              <Chip
                key={idx}
                label={`#${tag}`}
                onDelete={() => removeHashtag(tag)}
                variant="outlined"
              />
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="file-upload-group">
          <label>Cover Image (optional)</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
          {form.image?.[0] && (
            <div className="preview">
              <img src={URL.createObjectURL(form.image[0])} alt="preview" />
              <p>📷 {form.image[0].name}</p>
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div className="file-upload-group">
          <label>Video (optional)</label>
          <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
          {form.video?.[0] && (
            <div className="preview">
              <video src={URL.createObjectURL(form.video[0])} controls />
              <p>🎞️ {form.video[0].name}</p>
            </div>
          )}
        </div>

        {/* Attachments */}
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

        {/* Submit */}
        <Button
          variant="contained"
          type="submit"
          className="submit-btn"
        >
          Submit Post
        </Button>
      </form>
    </div>
  );
}

export default CreatePostPage;

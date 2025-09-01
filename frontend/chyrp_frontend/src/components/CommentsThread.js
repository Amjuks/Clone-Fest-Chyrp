// src/components/CommentsThread.jsx
import React, { useEffect, useState } from 'react';
import { fetchComments, addComment } from '../services/postService';
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

export default function CommentsThread({ postId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const { data } = await fetchComments(postId);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await addComment(postId, message.trim());
      setMessage('');
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <TextField
          size="small"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained">Post</Button>
      </form>

      <List>
        {comments.map((c) => (
          <ListItem key={c.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={c.user?.profile_pic} />
            </ListItemAvatar>
            <ListItemText
              primary={c.user?.display_name || c.user?.username}
              secondary={c.message}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

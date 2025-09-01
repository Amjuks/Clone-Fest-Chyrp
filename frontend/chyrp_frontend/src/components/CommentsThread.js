import React, { useEffect, useState } from 'react';
import { fetchComments, addComment } from '../services/postService';
import {
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
// import './CommentsThread.scss';

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
    <div className="comments-thread">
      <Typography variant="h6" className="comments-title">Comments</Typography>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <TextField
          size="small"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          className="comment-input"
          variant="outlined"
        />
        <Button type="submit" variant="contained" className="comment-btn">
          Post
        </Button>
      </form>

      {/* Comments List */}
      <List className="comments-list">
        {comments.map((c) => (
          <React.Fragment key={c.id}>
            <ListItem alignItems="flex-start" className="comment-item">
              <ListItemAvatar>
                <Avatar src={c.user?.profile_pic}>
                  {(c.user?.display_name || c.user?.username)?.[0]?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div className="comment-header">
                    <span className="comment-author">
                      {c.user?.display_name || c.user?.username}
                    </span>
                    <span className="comment-time">
                      {formatDistanceToNow(new Date(c.sent_at), { addSuffix: true })}
                    </span>
                  </div>
                }
                secondary={<span className="comment-message">{c.message}</span>}
              />
            </ListItem>
            <Divider component="li" className="comment-divider" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

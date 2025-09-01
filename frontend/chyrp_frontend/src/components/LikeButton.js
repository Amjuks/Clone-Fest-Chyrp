// src/components/LikeButton.jsx
import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import API from '../services/api';
import { toggleLike } from '../services/postService';

export default function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('likes/toggle/', { post_id: postId });

      // backend returns { liked: bool, like_count: int }
      setLiked(res.data.liked);
      setCount(res.data.like_count);
    } catch (err) {
      console.error('Like toggle failed:', err.response?.data || err.message);
      // optional: rollback UI if request fails
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Tooltip title={liked ? 'Unlike' : 'Like'}>
        <IconButton onClick={toggleLike}>
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
      <span>{count ?? 0}</span>
    </div>
  );
}

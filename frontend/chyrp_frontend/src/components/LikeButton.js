import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import API from '../services/api';

export default function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('likes/toggle/', { post_id: postId });
      setLiked(res.data.liked);
      setCount(res.data.like_count);
    } catch (err) {
      console.error('Like toggle failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="like-button">
      <Tooltip title={liked ? 'Unlike' : 'Like'}>
        <IconButton onClick={toggleLike} className={liked ? 'liked' : ''}>
          {liked ? (
            <FavoriteIcon className="like-icon liked" />
          ) : (
            <FavoriteBorderIcon className="like-icon" />
          )}
        </IconButton>
      </Tooltip>
      <span className="like-count">{count ?? 0}</span>
    </div>
  );
}

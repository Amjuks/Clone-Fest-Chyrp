import React, { useState } from 'react';
import { IconButton, Tooltip, Typography, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import API from '../services/api';

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}) {
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
    <Tooltip title={liked ? 'Unlike' : 'Like'}>
      <Box
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={toggleLike}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          cursor: 'pointer',
          color: liked ? '#e91e63' : '#ccc',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            color: '#f06292',
          },
        }}
      >
        {liked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {count}
        </Typography>
      </Box>
    </Tooltip>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Avatar } from '@mui/material';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/posts/${id}/`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!post) return <Typography>Loading...</Typography>;

  return (
    <div className="post-page">
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <Typography variant="h3" className="post-title">{post.title}</Typography>

      <div className="post-author">
        <Avatar src={post.profile_pic} />
        <div className="author-info">
          <Typography variant="subtitle1">{post.display_name}</Typography>
          <Typography variant="caption">@{post.username} — {post.created_at}</Typography>
        </div>
      </div>

      <Typography className="post-category">Category: {post.category}</Typography>

      <div className="post-content">
        <Typography>{post.content}</Typography>
      </div>

      {post.video && (
        <video controls className="post-video">
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default PostPage;

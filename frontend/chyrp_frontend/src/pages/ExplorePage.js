import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Avatar } from '@mui/material';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="explore-container">
      <Typography variant="h4" className="explore-title">Explore Posts</Typography>
      
      <div className="post-list">
        {posts.map(post => {
          const {
            id,
            image,
            title,
            content,
            display_name,
            username,
            profile_pic,
            category,
            created_at,
          } = post;

          return (
            <Card
              key={id}
              className="post-card"
              component={RouterLink}
              to={`/post/${id}`}
              elevation={3}
            >
              {image && (
                <CardMedia
                  component="img"
                  height="180"
                  image={image}
                  alt={title || "Post image"}
                  className="post-image"
                />
              )}
              <CardContent style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div className="post-header">
                  <Avatar src={profile_pic} alt={display_name || username} />
                  <div className="user-info">
                    <Typography variant="subtitle1">{display_name}</Typography>
                    <Typography variant="caption">@{username}</Typography>
                  </div>
                </div>

                <Typography variant="h6" className="post-title">{title}</Typography>
                <Typography variant="body2" className="post-snippet">{content}</Typography>

                <div className="post-meta">
                  <span>{category}</span>
                  <span>{new Date(created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePage;

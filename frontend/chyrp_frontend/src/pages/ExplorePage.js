import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/posts/")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(query.toLowerCase()) ||
      post.content?.toLowerCase().includes(query.toLowerCase()) ||
      post.username?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="explore-container">
      <Typography variant="h3" className="explore-title">
        Explore Posts
      </Typography>

      {/* Search */}
      <div className="search-bar">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Post List or Skeleton */}
      <div className="post-list">
        {loading
          ? Array.from(new Array(6)).map((_, idx) => (
              <Card key={idx} className="post-card skeleton-card">
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <div className="post-header">
                    <Skeleton variant="circular" width={44} height={44} />
                    <div className="user-info">
                      <Skeleton width={120} height={20} />
                      <Skeleton width={80} height={15} />
                    </div>
                  </div>
                  <Skeleton width="90%" height={24} />
                  <Skeleton width="100%" height={60} />
                </CardContent>
              </Card>
            ))
          : filteredPosts.map((post) => {
              const {
                id,
                image,
                video,
                files,
                title,
                content,
                display_name,
                username,
                profile_pic,
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
                  {video && (
                    <CardMedia
                      component="video"
                      height="200"
                      controls
                      className="post-video"
                    >
                      <source src={video} type="video/mp4" />
                    </CardMedia>
                  )}
                  <CardContent>
                    <div className="post-header">
                      <Avatar src={profile_pic} alt={display_name || username} />
                      <div className="user-info">
                        <Typography variant="subtitle1">
                          {display_name || username}
                        </Typography>
                        <Typography variant="caption">
                          {new Date(created_at).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>

                    <Typography variant="h6" className="post-title">
                      {title}
                    </Typography>
                    <Typography variant="body2" className="post-snippet">
                      {content}
                    </Typography>

                    {files?.length > 0 && (
                      <div className="file-links">
                        {files.slice(0, 3).map((file, idx) => (
                          <a
                            key={idx}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            📄 File {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
};

export default ExplorePage;

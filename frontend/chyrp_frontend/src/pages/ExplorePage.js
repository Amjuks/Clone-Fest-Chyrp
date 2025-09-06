import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import debounce from "lodash.debounce";

const PAGE_SIZE = 10;

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts function with pagination and query
  const fetchPosts = useCallback(
    async (pageNum, currentQuery = query, append = false) => {
      try {
        const res = await axios.get("http://localhost:8000/api/posts/", {
          params: {
            page: pageNum,
            page_size: PAGE_SIZE,
            search: currentQuery,
          },
        });

        // Assuming API returns { results: [], total: n } or similar pagination format
        const newPosts = res.data.results || res.data;

        if (append) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        setHasMore(newPosts.length === PAGE_SIZE);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query]
  );

  // Initial fetch and fetch on query change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPosts(1, query, false);
  }, [fetchPosts, query]);

  // Debounced query setter
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        setQuery(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetQuery(e.target.value);
  };

  const clearSearch = () => {
    debouncedSetQuery("");
    setQuery("");
  };

  // Infinite scroll handler
  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300 &&
        !loadingMore &&
        hasMore
      ) {
        setLoadingMore(true);
        const nextPage = page + 1;
        fetchPosts(nextPage, query, true);
        setPage(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore, page, fetchPosts, query]);

  // Filter posts client side for any extra filtering (optional)
  // Since server search param is used, maybe no need to filter here:
  // Keeping client-side filter as backup
  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(query.toLowerCase()) ||
      post.content?.toLowerCase().includes(query.toLowerCase()) ||
      post.username?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="explore-container" role="main" aria-label="Explore posts">
      <Typography variant="h3" className="explore-title" tabIndex={0}>
        Explore Posts
      </Typography>

      <div className="search-bar">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts..."
          defaultValue={query}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon aria-label="Search icon" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear search"
                  onClick={clearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            inputProps: {
              "aria-label": "Search posts",
            },
          }}
        />
      </div>

      <div className="post-list">
        {loading && !loadingMore
          ? Array.from(new Array(6)).map((_, idx) => (
              <Card
                key={idx}
                className="post-card skeleton-card"
                tabIndex={-1}
                aria-busy="true"
              >
                <Skeleton
                  variant="rectangular"
                  height={180}
                  animation="wave"
                  className="skeleton-media"
                />
                <CardContent>
                  <div className="post-header">
                    <Skeleton
                      variant="circular"
                      width={44}
                      height={44}
                      animation="wave"
                    />
                    <div className="user-info">
                      <Skeleton width={120} height={20} animation="wave" />
                      <Skeleton width={80} height={15} animation="wave" />
                    </div>
                  </div>
                  <Skeleton width="90%" height={24} animation="wave" />
                  <Skeleton width="100%" height={60} animation="wave" />
                </CardContent>
              </Card>
            ))
          : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
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

                // Generate video thumbnail fallback or poster if available
                // You could extend API to provide video thumbnail URLs, for now we'll show a "video" icon overlay on the video element
                return (
                  <Card
                    key={id}
                    className="post-card"
                    component={RouterLink}
                    to={`/posts/${id}`}
                    elevation={4}
                    tabIndex={0}
                    aria-label={`View post titled ${title}`}
                  >
                    {image ? (
                      <CardMedia
                        component="img"
                        height="180"
                        image={image}
                        alt={title || "Post image"}
                        loading="lazy"
                        className="post-image"
                      />
                    ) : video ? (
                      <CardMedia
                        component="video"
                        height="180"
                        controls
                        preload="metadata"
                        poster="" // optionally pass video thumbnail URL here if you have it
                        className="post-video"
                      >
                        <source src={video} type="video/mp4" />
                        Sorry, your browser does not support embedded videos.
                      </CardMedia>
                    ) : null}

                    <CardContent>
                      <div className="post-header">
                        <Avatar
                          src={profile_pic}
                          alt={display_name || username}
                          loading="lazy"
                        />
                        <div className="user-info">
                          <Tooltip title={display_name || username}>
                            <Typography variant="subtitle1" noWrap>
                              {display_name || username}
                            </Typography>
                          </Tooltip>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(created_at).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>

                      <Tooltip title={title || ""}>
                        <Typography variant="h6" className="post-title" noWrap>
                          {title}
                        </Typography>
                      </Tooltip>

                      <Tooltip title={content || ""}>
                        <Typography variant="body2" className="post-snippet" noWrap>
                          {content}
                        </Typography>
                      </Tooltip>

                      {files?.length > 0 && (
                        <div className="file-links" aria-label="Post attachments">
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
              })
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                className="no-results"
                tabIndex={0}
              >
                No posts found matching your search.
              </Typography>
            )}

        {/* Infinite loading spinner */}
        {loadingMore && (
          <div className="loading-more" aria-live="polite" aria-busy="true">
            <CircularProgress color="primary" size={36} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;

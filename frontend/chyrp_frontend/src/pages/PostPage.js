import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Avatar,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';
import LikeButton from '../components/LikeButton';
import CommentsThread from '../components/CommentsThread';
import API from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`posts/${id}/`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading post:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="post-page loading">
        <CircularProgress size={48} thickness={4} sx={{ color: '#6a5acd' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-page">
        <Typography variant="h6" color="error">
          Oops! Couldn’t load the post.
        </Typography>
      </div>
    );
  }

  const avatarContent = post.profile_pic ? (
    <Avatar src={post.profile_pic} sx={{ width: 56, height: 56 }} />
  ) : (
    <Avatar
      sx={{
        bgcolor: 'primary.light',
        width: 56,
        height: 56,
        fontWeight: 'bold',
      }}
    >
      {(post.display_name || post.username)[0]?.toUpperCase()}
    </Avatar>
  );

  return (
    <div className="post-page">
      {/* Header */}
      <header className="post-header">
        {avatarContent}
        <div className="header-info">
          <Typography
            variant="h5"
            className="post-title"
            title={post.title}
          >
            {post.title}
          </Typography>
          <Typography variant="body1" className="post-meta" noWrap>
            {post.display_name || post.username} •{' '}
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </Typography>
        </div>
      </header>

      {/* Media */}
      {(post.image || post.video) && (
        <Grid container spacing={2} className="media-grid">
          {post.image && (
            <Grid item xs={12} sm={post.video ? 6 : 12}>
              <div className="media-preview">
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
            </Grid>
          )}
          {post.video && (
            <Grid item xs={12} sm={post.image ? 6 : 12}>
              <div className="media-preview">
                <video src={post.video} controls muted />
              </div>
            </Grid>
          )}
        </Grid>
      )}

      {/* Hashtags */}
      {post.hashtags?.length > 0 && (
        <div className="hashtags">
                <div className="post-actions">
        <LikeButton
          postId={post.id}
          initialLiked={post.liked_by_me}
          initialCount={post.like_count}
        />
      </div>

          {post.hashtags.map(ht => (
            <Chip
              key={ht.id}
              label={`#${ht.name}`}
              size="small"
              clickable
              color="primary"
              variant="outlined"
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="post-content">
        <Typography>{post.content}</Typography>
      </div>

      {/* Attachments */}
      {post.files?.length > 0 && (
        <div className="attachments">
          {post.files.map((f, idx) => (
            <a
              key={idx}
              href={f.file}
              target="_blank"
              rel="noopener noreferrer"
              className="attachment-link"
            >
              <FileIcon fontSize="small" />
              <span className="file-label">
                {f.file.split('/').pop()}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Actions */}
      {/* <div className="post-actions">
        <LikeButton
          postId={post.id}
          initialLiked={post.liked_by_me}
          initialCount={post.like_count}
        />
      </div> */}

      {/* Comments */}
      <div className="comments-thread">
        <CommentsThread postId={post.id} />
      </div>
    </div>
  );
};

export default PostPage;

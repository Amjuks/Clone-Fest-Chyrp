import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Likes = ({ postId, currentUser }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load likes info on mount or postId change
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/likes/?post=${postId}`, { withCredentials: true })
      .then(res => {
        setLikesCount(res.data.length);
        setLiked(res.data.some(like => like.user === currentUser.id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, currentUser]);

  const toggleLike = () => {
    if (!currentUser) {
      alert("Please login to like posts.");
      return;
    }

    if (liked) {
      axios.delete('http://localhost:8000/api/likes/unlike/', {
        data: { post: postId },
        withCredentials: true,
      })
      .then(() => {
        setLikesCount(c => c - 1);
        setLiked(false);
      })
      .catch(console.error);
    } else {
      axios.post('http://localhost:8000/api/likes/', { post: postId }, { withCredentials: true })
        .then(() => {
          setLikesCount(c => c + 1);
          setLiked(true);
        })
        .catch(console.error);
    }
  };

  if (loading) return <button disabled>Loading...</button>;

  return (
    <button onClick={toggleLike} style={{cursor: 'pointer', backgroundColor: liked ? '#e0245e' : '#ddd', color: liked ? 'white' : 'black', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px'}}>
      {liked ? '♥ Liked' : '♡ Like'} ({likesCount})
    </button>
  );
};

export default Likes;

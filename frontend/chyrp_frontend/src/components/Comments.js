import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/comments/?post=${postId}`)
      .then(res => setComments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to comment.");
      return;
    }
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:8000/api/comments/', { post: postId, message }, { withCredentials: true });
      setComments(prev => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Comments ({comments.length})</h3>
      {loading ? <p>Loading comments...</p> : (
        <>
          {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>
              <strong>{c.user_display_name || c.user_username}</strong> <span style={{ color: '#555', fontSize: '0.9rem' }}>on {new Date(c.sent_at).toLocaleString()}</span>
              <p style={{ marginTop: '0.3rem', whiteSpace: 'pre-wrap' }}>{c.message}</p>
            </div>
          ))}
          {currentUser ? (
            <form onSubmit={handleSubmit}>
              <textarea
                rows="3"
                placeholder="Write your comment..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', borderColor: '#ccc', marginBottom: '0.5rem' }}
                disabled={submitting}
              />
              <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                {submitting ? 'Submitting...' : 'Add Comment'}
              </button>
            </form>
          ) : (
            <p><em>Please login to add comments.</em></p>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';

function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        console.log(res.data);
        setUser(res.data)})
      .catch(() => navigate('/login')); // Redirect if not logged in
  }, [navigate]);

  if (!user) return <CircularProgress />;
  let display_name = user.display_name || user.username

  return <Typography variant="h4">Welcome, {display_name}</Typography>;
}

export default HomePage;

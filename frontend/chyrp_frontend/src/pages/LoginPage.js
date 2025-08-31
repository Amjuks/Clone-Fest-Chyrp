import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.username, form.password);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setSnackbar({ open: true, message: 'Login failed: Invalid credentials', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="sm" className="auth-container">
      <Box className="auth-box">
        <Typography variant="h4" className="auth-title">Login</Typography>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <TextField
            label="Username"
            name="username"
            fullWidth
            required
            value={form.username}
            onChange={handleChange}
            autoFocus
            className="auth-input"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
            className="auth-input"
          />

          <Button type="submit" variant="contained" fullWidth className="auth-button">
            Login
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Snackbar, Alert
} from '@mui/material';
import { register, login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form.username, form.password);
      await login(form.username, form.password);

      setSnackbar({ open: true, message: 'Registration successful! Logging in...', severity: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: 'Registration failed. Username may be taken.', severity: 'error' });
    }
  };

  return (
    <div className="auth-page">
      <Box className="auth-box">
        <Typography variant="h4" className="auth-title">Register</Typography>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <TextField
            label="Username"
            name="username"
            fullWidth
            required
            value={form.username}
            onChange={handleChange}
            autoFocus
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" fullWidth className="auth-button">
            Register
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
    </div>
  );
};

export default RegisterPage;

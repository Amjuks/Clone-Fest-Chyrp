import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';

function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #4A148C, #6A1B9A)',
        color: '#fff',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Chyrp
        </Typography>

        {/* Right side nav */}
        <div>
          <Button color="inherit" component={Link} to="/explore">
            Explore
          </Button>
          <Button color="inherit" component={Link} to="/create">
            Create
          </Button>

          {/* Auth/Profile dropdown */}
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                bgcolor: user ? '#8E24AA' : '#9E9E9E',
                width: 32,
                height: 32,
                fontSize: 14,
              }}
            >
              {user ? user.username[0].toUpperCase() : '?'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {!user &&
              [
                <MenuItem
                  key="login"
                  component={Link}
                  to="/login"
                  onClick={handleClose}
                >
                  Login
                </MenuItem>,
                <MenuItem
                  key="register"
                  component={Link}
                  to="/register"
                  onClick={handleClose}
                >
                  Register
                </MenuItem>,
              ]}

            {user &&
              [
                <MenuItem
                  key="profile"
                  component={Link}
                  to={`/profile/${user.username}`}
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>,
                <MenuItem
                  key="settings"
                  component={Link}
                  to="/settings"
                  onClick={handleClose}
                >
                  Settings
                </MenuItem>,
                <MenuItem key="logout" onClick={handleLogout}>
                  Logout
                </MenuItem>,
              ]}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AppBarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const CustomAppBar: React.FC<AppBarProps> = ({ sidebarOpen, onSidebarToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ width: '100%', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onSidebarToggle} edge="start">
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Dashboard
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;

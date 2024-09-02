import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function LeftDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const handleLogout = () => {
    // Clear token and perform other logout actions if needed
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login or home page
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/register')}>
            <ListItemText primary="Register" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/users')}>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} >Open Menu</Button>
      
      <Drawer
        anchor='left'
        open={open}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </div>
  );
}

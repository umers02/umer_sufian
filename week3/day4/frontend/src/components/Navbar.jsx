import { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Projects', icon: <FolderIcon />, path: '/projects' },
    { text: 'Members', icon: <GroupIcon />, path: '/members' },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Team Portal
        </Typography>
        {user && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" startIcon={<DashboardIcon />} component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" startIcon={<FolderIcon />} component={Link} to="/projects">Projects</Button>
              <Button color="inherit" startIcon={<GroupIcon />} component={Link} to="/members">Members</Button>
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>Logout</Button>
            </Box>
            <IconButton color="inherit" sx={{ display: { xs: 'block', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
                <List>
                  {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  <ListItem button onClick={logout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

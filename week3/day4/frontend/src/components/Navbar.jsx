import { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
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
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #69a6ff, #7c3aed)',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            TP
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              Team Portal
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Projects & Collaboration
            </Typography>
          </Box>
        </Box>
        {user && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
              <Button color="inherit" startIcon={<DashboardIcon />} component={Link} to="/dashboard" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Dashboard
              </Button>
              <Button color="inherit" startIcon={<FolderIcon />} component={Link} to="/projects" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Projects
              </Button>
              <Button color="inherit" startIcon={<GroupIcon />} component={Link} to="/members" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Members
              </Button>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ textTransform: 'none', fontWeight: 700, ml: 1, px: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.08)', '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
              >
                Logout
              </Button>
            </Box>
            <IconButton color="inherit" sx={{ display: { xs: 'block', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 260, height: '100%', bgcolor: '#0b1021', color: 'white' }} onClick={() => setDrawerOpen(false)}>
                <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #69a6ff, #7c3aed)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                    }}
                  >
                    TP
                  </Box>
                  <Box>
                    <Typography fontWeight={800} lineHeight={1}>Team Portal</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Navigation</Typography>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <List sx={{ py: 1 }}>
                  {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  <ListItem button onClick={logout} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
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

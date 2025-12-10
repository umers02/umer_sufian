import { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import gsap from 'gsap';

const Navbar = ({ isDark, onThemeToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const displayDark = isAuthPage ? true : isDark;

  const handleNavHover = (e) => {
    gsap.to(e.currentTarget, {
      y: -4,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleNavHoverOut = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

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
        background: displayDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(248, 250, 252, 0.82)',
        backdropFilter: 'blur(10px)',
        borderBottom: displayDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
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
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: displayDark ? 'white' : 'black' }}>
              Team Portal
            </Typography>
            <Typography variant="caption" sx={{ color: displayDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
              Projects & Collaboration
            </Typography>
          </Box>
        </Box>
        {user && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
              <Button 
                startIcon={<DashboardIcon />} 
                component={Link} 
                to="/dashboard" 
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavHoverOut}
                sx={{ textTransform: 'none', fontWeight: 600, color: isDark ? 'white' : 'black' }}
              >
                Dashboard
              </Button>
              <Button 
                startIcon={<FolderIcon />} 
                component={Link} 
                to="/projects" 
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavHoverOut}
                sx={{ textTransform: 'none', fontWeight: 600, color: isDark ? 'white' : 'black' }}
              >
                Projects
              </Button>
              <Button 
                startIcon={<GroupIcon />} 
                component={Link} 
                to="/members" 
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavHoverOut}
                sx={{ textTransform: 'none', fontWeight: 600, color: isDark ? 'white' : 'black' }}
              >
                Members
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                onClick={logout}
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavHoverOut}
                sx={{ textTransform: 'none', fontWeight: 700, ml: 1, px: 2.5, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', '&:hover': { background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }, color: isDark ? 'white' : 'black' }}
              >
                Logout
              </Button>
            </Box>
            <IconButton
              onClick={onThemeToggle}
              sx={{
                ml: 2,
                color: 'primary.main',
                background: 'rgba(105,166,255,0.1)',
                '&:hover': {
                  background: 'rgba(105,166,255,0.15)',
                },
              }}
            >
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton sx={{ display: { xs: 'block', md: 'none' }, color: isDark ? 'white' : 'black' }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 260, height: '100%', bgcolor: isDark ? '#0b1021' : '#f8fafc', color: isDark ? 'white' : 'black' }} onClick={() => setDrawerOpen(false)}>
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
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Navigation</Typography>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                <List sx={{ py: 1 }}>
                  {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                      <ListItemIcon sx={{ color: isDark ? 'white' : 'black' }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  <ListItem button onClick={logout} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                    <ListItemIcon sx={{ color: isDark ? 'white' : 'black' }}><LogoutIcon /></ListItemIcon>
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




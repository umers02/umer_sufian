import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Card, CardContent, Typography, Container } from '@mui/material';
import { projectAPI, memberAPI } from '../services/api';
import gsap from 'gsap';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, members: 0 });
  const heroRef = useRef();
  const cardsRef = useRef();

  useEffect(() => {
    fetchStats();
    gsap.fromTo(heroRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
    gsap.fromTo(cardsRef.current.children, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.15, delay: 0.5 });
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([projectAPI.getStats(), memberAPI.getAll()]);
      const projectStats = projectsRes.data.data;
      setStats({ 
        total: projectStats.totalProjects, 
        active: projectStats.activeProjects, 
        completed: projectStats.completedProjects, 
        members: membersRes.data.data.length 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const statCards = [
    { title: 'Total Projects', value: stats.total, icon: <FolderIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#1976d2' },
    { title: 'Active Projects', value: stats.active, icon: <PendingIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#ed6c02' },
    { title: 'Completed Projects', value: stats.completed, icon: <CheckCircleIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#2e7d32' },
    { title: 'Team Members', value: stats.members, icon: <GroupIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#9c27b0' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 5 },
        px: { xs: 2, sm: 0 },
        background:
          'radial-gradient(circle at 15% 15%, rgba(105,166,255,0.2), transparent 30%), radial-gradient(circle at 85% 10%, rgba(220,0,78,0.18), transparent 28%), #0b1021',
      }}
    >
      <Container maxWidth="lg">
        <Box
          ref={heroRef}
          sx={{
            textAlign: 'center',
            mb: { xs: 4, sm: 5, md: 7 },
            color: 'white',
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(255,255,255,0.7)' }}>
            Overview
          </Typography>
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' } }}>
            Team & Project Portal
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '1rem', sm: '1.05rem', md: '1.2rem' } }}>
            Manage your projects, track progress, and align your team in one place.
          </Typography>
        </Box>
        <Grid ref={cardsRef} container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
          {statCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(160deg, ${card.color} 0%, ${card.color}cc 35%, #0b1021 100%)`,
                  color: 'white',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                  '&:hover': { transform: 'translateY(-6px)', transition: 'all 0.3s ease' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 }, display: 'grid', gap: 1 }}>
                  {card.icon}
                  <Typography variant="h3" fontWeight="bold" mt={1} sx={{ fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' } }}>
                    {card.value}
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>{card.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

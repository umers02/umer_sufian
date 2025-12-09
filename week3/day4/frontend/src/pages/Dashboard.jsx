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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 0 } }}>
      <Container maxWidth="lg">
        <Box ref={heroRef} sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' } }}>
            Team & Project Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}>
            Manage your projects and team members efficiently
          </Typography>
        </Box>
        <Grid ref={cardsRef} container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {statCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ bgcolor: card.color, color: 'white', '&:hover': { transform: 'scale(1.05)', transition: '0.3s' } }}>
                <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 2.5, md: 3 } }}>
                  {card.icon}
                  <Typography variant="h3" fontWeight="bold" mt={2} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                    {card.value}
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}>{card.title}</Typography>
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

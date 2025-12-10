import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardActions, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton } from '@mui/material';
import { projectAPI, memberAPI } from '../services/api';
import gsap from 'gsap';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', techStack: '', status: 'active', teamMembers: [] });
  const cardsRef = useRef();

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (cardsRef.current?.children.length) {
      gsap.fromTo(cardsRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1 });
    }
  }, [projects]);

  const fetchProjects = async () => {
    const { data } = await projectAPI.getAll();
    setProjects(data.data);
  };

  const fetchMembers = async () => {
    const { data } = await memberAPI.getAll();
    setMembers(data.data);
  };

  const handleOpen = (project = null) => {
    if (project) {
      setEditId(project._id);
      setFormData({ ...project, techStack: project.techStack.join(', '), teamMembers: project.teamMembers.map(m => m._id || m) });
    } else {
      setEditId(null);
      setFormData({ title: '', description: '', techStack: '', status: 'active', teamMembers: [] });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    const payload = { ...formData, techStack: formData.techStack.split(',').map(s => s.trim()) };
    if (editId) {
      await projectAPI.update(editId, payload);
    } else {
      await projectAPI.create(payload);
    }
    fetchProjects();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await projectAPI.delete(id);
      fetchProjects();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme => theme.palette.mode === 'dark' ? 'radial-gradient(circle at 15% 15%, rgba(105,166,255,0.2), transparent 30%), radial-gradient(circle at 85% 10%, rgba(220,0,78,0.18), transparent 28%), #0b1021' : 'radial-gradient(circle at 15% 15%, rgba(105,166,255,0.1), transparent 30%), radial-gradient(circle at 85% 10%, rgba(220,0,78,0.1), transparent 28%), #f8fafc',
      }}
    >
      <Container
        sx={{
          py: { xs: 2.5, sm: 3.5, md: 5 },
          px: { xs: 2, sm: 3 },
          color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
        }}
      >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 3, sm: 4, md: 5 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>Workspace</Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.9rem', sm: '2.2rem' } }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', mt: 0.5 }}>
            Track initiatives, technology stack, and ownership in one place.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #69a6ff, #7c3aed)',
            boxShadow: '0 10px 30px rgba(105,166,255,0.35)',
          }}
        >
          Add Project
        </Button>
      </Box>
      <Grid ref={cardsRef} container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card
              sx={{
                height: '100%',
                background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))' : 'linear-gradient(160deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
                border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                borderRadius: 3,
                boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
                '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.25s ease' },
              }}
            >
              <CardContent sx={{ display: 'grid', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{project.title}</Typography>
                    <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', mt: 0.5 }}>
                      {project.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={project.status}
                    color={project.status === 'active' ? 'primary' : 'success'}
                    size="small"
                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mt: 0.5 }}>
                  {project.techStack.map((tech, i) => (
                    <Chip
                      key={i}
                      label={tech}
                      size="small"
                      sx={{ bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', color: theme => theme.palette.mode === 'dark' ? 'white' : 'black', borderRadius: 1.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleOpen(project)} sx={{ color: theme => theme.palette.mode === 'dark' ? 'white' : 'black', bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project._id)} color="error" sx={{ bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editId ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <TextField label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <TextField label="Tech Stack (comma separated)" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
            <TextField select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            <TextField select label="Team Members" SelectProps={{ multiple: true }} value={formData.teamMembers} onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}>
              {members.map((m) => <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>)}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
  );
};

export default Projects;

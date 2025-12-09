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
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ width: { xs: '100%', sm: 'auto' } }}>Add Project</Button>
      </Box>
      <Grid ref={cardsRef} container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{project.description}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', my: 1 }}>
                  {project.techStack.map((tech, i) => <Chip key={i} label={tech} size="small" />)}
                </Box>
                <Chip label={project.status} color={project.status === 'active' ? 'primary' : 'success'} size="small" />
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpen(project)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(project._id)} color="error"><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Project' : 'Add Project'}</DialogTitle>
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
  );
};

export default Projects;

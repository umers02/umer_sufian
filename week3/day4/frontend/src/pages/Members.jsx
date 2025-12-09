import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { memberAPI } from '../services/api';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', skills: '', phone: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await memberAPI.getAll();
    setMembers(data.data);
  };

  const handleOpen = (member = null) => {
    if (member) {
      setEditId(member._id);
      setFormData({ ...member, skills: member.skills.join(', ') });
    } else {
      setEditId(null);
      setFormData({ name: '', email: '', role: '', skills: '', phone: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
    if (editId) {
      await memberAPI.update(editId, payload);
    } else {
      await memberAPI.create(payload);
    }
    fetchMembers();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this member?')) {
      await memberAPI.delete(id);
      fetchMembers();
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'skills', headerName: 'Skills', flex: 1, valueGetter: (params) => params.join(', ') },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)} color="error"><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>Team Members</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ width: { xs: '100%', sm: 'auto' } }}>Add Member</Button>
      </Box>
      <Box sx={{ height: { xs: 400, sm: 500, md: 600 }, bgcolor: 'white', width: '100%', overflow: 'auto' }}>
        <DataGrid rows={members} columns={columns} getRowId={(row) => row._id} pageSize={10} />
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Member' : 'Add Member'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <TextField label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            <TextField label="Skills (comma separated)" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
            <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
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

export default Members;

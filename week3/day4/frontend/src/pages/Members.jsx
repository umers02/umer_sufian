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
          <Typography variant="overline" sx={{ letterSpacing: 2, color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>Directory</Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.9rem', sm: '2.2rem' } }}>Team Members</Typography>
          <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', mt: 0.5 }}>
            Maintain profiles, roles, and skill sets across the team.
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
          Add Member
        </Button>
      </Box>
      <Box
        sx={{
          height: { xs: 420, sm: 520, md: 620 },
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 3,
          border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
        }}
      >
        <DataGrid
          rows={members}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          disableColumnMenu
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
            border: 'none',
            background: 'transparent',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme => theme.palette.mode === 'dark' ? '#0f172a !important' : '#f1f5f9 !important',
              color: theme => theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
              borderBottom: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
              backgroundImage: theme => theme.palette.mode === 'dark' ? 'linear-gradient(90deg, rgba(105,166,255,0.18), rgba(124,58,237,0.12))' : 'linear-gradient(90deg, rgba(105,166,255,0.08), rgba(124,58,237,0.06))',
            },
            '& .MuiDataGrid-columnHeadersInner, & .MuiDataGrid-columnHeaderRow': {
              bgcolor: theme => theme.palette.mode === 'dark' ? '#0f172a !important' : '#f1f5f9 !important',
              backgroundImage: 'none !important',
            },
            '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle': {
              color: theme => theme.palette.mode === 'dark' ? '#e2e8f0 !important' : '#1e293b !important',
              fontWeight: 800,
              bgcolor: 'transparent !important',
              backgroundImage: 'none !important',
              '&:hover': {
                backgroundColor: 'transparent !important',
              },
              '&:focus, &:focus-within, &:focus-visible': {
                outline: 'none',
                backgroundColor: 'transparent !important',
              },
            },
            '& .MuiDataGrid-columnSeparator': {
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12) !important' : 'rgba(0,0,0,0.12) !important',
              opacity: 1,
            },
            '& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root': {
              color: theme => theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
              '&:hover': {
                backgroundColor: 'transparent !important',
              },
              '& .MuiTouchRipple-root': {
                display: 'none',
              },
              '&:focus, &:focus-visible': {
                outline: 'none',
                backgroundColor: 'transparent !important',
              },
            },
            '& .MuiDataGrid-sortIcon': {
              color: theme => theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
            },
            '& .MuiDataGrid-sortButton': {
              backgroundColor: 'transparent !important',
              '&:hover': { backgroundColor: 'transparent !important' },
              '&:focus, &:focus-visible': { backgroundColor: 'transparent !important' },
            },
            '& .MuiDataGrid-columnHeader .MuiTouchRipple-root': {
              display: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus-visible': {
              outline: 'none',
              backgroundColor: 'transparent !important',
            },
            '& .MuiDataGrid-virtualScroller': {
              background: 'transparent',
            },
            '& .MuiDataGrid-row': {
              borderBottom: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            },
            '& .MuiDataGrid-cell': {
              borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
            },
            '& .MuiTablePagination-root': { color: theme => theme.palette.mode === 'dark' ? 'white' : 'black' },
            '& .MuiSvgIcon-root': { color: theme => theme.palette.mode === 'dark' ? 'white' : 'black' },
          }}
        />
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
    </Box>
  );
};

export default Members;
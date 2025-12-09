import { useState, useContext, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useContext(AuthContext);
  const containerRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 });
    gsap.fromTo(formRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, delay: 0.3 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', px: { xs: 2, sm: 0 } }}>
      <Paper ref={containerRef} elevation={3} sx={{ p: { xs: 3, sm: 4 }, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box ref={formRef} component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit" variant="contained" size="large">
            Register
          </Button>
          <Typography align="center">
            Already have an account? <MuiLink component={Link} to="/login">Login</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;

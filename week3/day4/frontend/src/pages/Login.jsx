import { useState, useContext, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const containerRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 });
    gsap.fromTo(formRef.current.children, { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.1, delay: 0.3 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', px: { xs: 2, sm: 0 } }}>
      <Paper ref={containerRef} elevation={3} sx={{ p: { xs: 3, sm: 4 }, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box ref={formRef} component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            Login
          </Button>
          <Typography align="center">
            Don't have an account? <MuiLink component={Link} to="/register">Register</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

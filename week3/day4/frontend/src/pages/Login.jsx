import { useState, useContext, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink, Alert, Stack, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const containerRef = useRef();
  const formRef = useRef();

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 2,
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(105,166,255,0.6)' },
      '&.Mui-focused fieldset': {
        borderColor: '#69a6ff',
        boxShadow: '0 0 0 1px rgba(105,166,255,0.35)',
      },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
    '& .MuiInputBase-input': { color: 'white' },
  };

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 0 },
        background: 'radial-gradient(circle at 20% 20%, rgba(105,166,255,0.18), transparent 30%), radial-gradient(circle at 80% 0, rgba(124,58,237,0.16), transparent 26%), #0b1021',
      }}
    >
      <Paper
        ref={containerRef}
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          maxWidth: 440,
          width: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
            Welcome back
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.9rem', sm: '2.2rem' } }}>
            Sign in to continue
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Access your projects and stay in sync with your team.
          </Typography>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box
          ref={formRef}
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            sx={inputStyles}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            sx={inputStyles}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.4,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #69a6ff, #7c3aed)',
              boxShadow: '0 10px 30px rgba(105,166,255,0.35)',
            }}
          >
            Login
          </Button>
          <Typography align="center" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Don't have an account? <MuiLink component={Link} to="/register" sx={{ color: '#69a6ff', fontWeight: 700 }}>Register</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

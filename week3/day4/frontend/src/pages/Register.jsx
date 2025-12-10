import { useState, useContext, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink, Alert, Stack, Divider } from '@mui/material';
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
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 100px rgba(255,255,255,0.04) inset',
      WebkitTextFillColor: 'white',
      caretColor: 'white',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  };

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 0 },
        background: 'radial-gradient(circle at 15% 20%, rgba(220,0,78,0.16), transparent 28%), radial-gradient(circle at 80% 10%, rgba(105,166,255,0.15), transparent 30%), #0b1021',
      }}
    >
      <Paper
        ref={containerRef}
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          maxWidth: 480,
          width: '100%',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
            Create account
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.9rem', sm: '2.2rem' } }}>
            Join the workspace
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Set up your profile to collaborate securely with your team.
          </Typography>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box
          ref={formRef}
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <TextField
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            sx={inputStyles}
          />
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
              background: 'linear-gradient(135deg, #dc004e, #7c3aed)',
              boxShadow: '0 10px 30px rgba(220,0,78,0.35)',
            }}
          >
            Register
          </Button>
          <Typography align="center" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Already have an account? <MuiLink component={Link} to="/login" sx={{ color: '#69a6ff', fontWeight: 700 }}>Login</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Members from './pages/Members';

function App() {
  const [isDark, setIsDark] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#69a6ff' },
      secondary: { main: '#7c3aed' },
      background: {
        default: isDark ? '#0f172a' : '#ffffff',
        paper: isDark ? '#1e293b' : '#f8fafc',
      },
    },
  });

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

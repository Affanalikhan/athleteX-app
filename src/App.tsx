import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { CapacitorProvider } from './providers/CapacitorProvider';

// Pages
import LandingPage from './pages/LandingPage';
import SimpleLoginPage from './pages/SimpleLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import EnhancedAssessmentPage from './pages/EnhancedAssessmentPage';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import PerformancePage from './pages/PerformancePage';
import TrainingPage from './pages/TrainingPage';
import SocialPage from './pages/SocialPage';
import AdminPage from './pages/AdminPage';
import AssessmentIntegrityDashboard from './components/AssessmentIntegrityDashboard';
import SAILoginPage from './pages/SAILoginPage';
import SAIDashboard from './pages/SAIDashboard';

// Components
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import { AdminAuthProvider } from './components/AdminAuthProvider';
import AdminLayout from './components/AdminLayout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import SportyBackground from './components/SportyBackground';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff', // Cyan
      light: '#4dd5ff',
      dark: '#00c4cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#0080ff', // Blue
      light: '#66b2ff',
      dark: '#0056b3',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0, 245, 255, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 245, 255, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: '#00f5ff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00f5ff',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

// Add Admin Login Link to Main Login Page
const LoginPageWithAdminLink: React.FC = () => {
  return (
    <Box>
      <SimpleLoginPage />
      <Box sx={{ position: 'fixed', top: 20, right: 20 }}>
        <Button
          variant="outlined"
          color="primary"
          href="/admin/login"
          sx={{ fontWeight: 'bold' }}
        >
          Admin Login
        </Button>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CapacitorProvider>
        <Router>
          <AdminAuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPageWithAdminLink />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* SAI Login Route */}
              <Route path="/admin/sai-login" element={<SAILoginPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminPage />} />
                <Route path="integrity" element={<AssessmentIntegrityDashboard />} />
                <Route path="sai-dashboard" element={<SAIDashboard />} />
              </Route>

              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <SportyBackground variant="minimal">
                      <Navigation />
                      <ProfilePage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <SportyBackground variant="pattern">
                      <Navigation />
                      <AssessmentPage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/ai"
                element={
                  <ProtectedRoute>
                    <SportyBackground variant="pattern">
                      <Navigation />
                      <EnhancedAssessmentPage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/results/:assessmentId"
                element={
                  <ProtectedRoute>
                    <SportyBackground>
                      <Navigation />
                      <AssessmentResultsPage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <SportyBackground variant="minimal">
                      <Navigation />
                      <PerformancePage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/training"
                element={
                  <ProtectedRoute>
                    <SportyBackground variant="pattern">
                      <Navigation />
                      <TrainingPage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <SportyBackground>
                      <Navigation />
                      <SocialPage />
                    </SportyBackground>
                  </ProtectedRoute>
                }
              />

              {/* Dashboard redirect */}
              <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
              
              {/* Default Route - Landing Page */}
              <Route path="/" element={<LandingPage />} />
            </Routes>
            </Box>
          </AdminAuthProvider>
        </Router>
      </CapacitorProvider>
    </ThemeProvider>
  );
};

export default App;

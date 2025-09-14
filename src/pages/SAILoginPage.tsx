import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Security,
  VerifiedUser,
  ArrowBack,
  Login,
  Key,
  Person,
  Phone,
  CheckCircle,
  Policy,
} from '@mui/icons-material';
import saiCloudService from '../services/saiCloudService';

interface LoginForm {
  officialId: string;
  password: string;
  otp: string;
}

interface LoginError {
  field: string;
  message: string;
}

const SAILoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    officialId: '',
    password: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [step, setStep] = useState<'credentials' | 'otp' | 'success'>('credentials');
  const [generalError, setGeneralError] = useState<string>('');

  const handleInputChange = (field: keyof LoginForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const validateCredentials = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!form.officialId) {
      newErrors.push({ field: 'officialId', message: 'Official ID is required' });
    } else if (!/^SAI[0-9]{6,8}$/.test(form.officialId)) {
      newErrors.push({ field: 'officialId', message: 'Official ID must be in format SAI123456' });
    }

    if (!form.password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (form.password.length < 8) {
      newErrors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const validateOTP = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!form.otp) {
      newErrors.push({ field: 'otp', message: 'OTP is required' });
    } else if (!/^[0-9]{6}$/.test(form.otp)) {
      newErrors.push({ field: 'otp', message: 'OTP must be 6 digits' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCredentialsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateCredentials()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      // In a real implementation, this would send credentials and receive OTP
      // For demo purposes, we'll simulate this step
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('otp');
    } catch (error) {
      setGeneralError('Failed to send OTP. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateOTP()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      const authToken = await saiCloudService.authenticateSAIOfficial({
        officialId: form.officialId,
        password: form.password,
        otp: form.otp
      });

      setStep('success');
      
      // Redirect to SAI dashboard after short delay
      setTimeout(() => {
        navigate('/admin/sai-dashboard');
      }, 2000);
    } catch (error) {
      setGeneralError('Invalid OTP or authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string => {
    const error = errors.find(e => e.field === field);
    return error ? error.message : '';
  };

  const renderCredentialsStep = () => (
    <Box component="form" onSubmit={handleCredentialsSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          SAI Official Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sports Authority of India - Talent Identification Platform
        </Typography>
      </Box>

      {generalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {generalError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Official ID"
        value={form.officialId}
        onChange={handleInputChange('officialId')}
        error={!!getFieldError('officialId')}
        helperText={getFieldError('officialId') || 'Enter your SAI Official ID (e.g., SAI123456)'}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="SAI123456"
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleInputChange('password')}
        error={!!getFieldError('password')}
        helperText={getFieldError('password')}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Key color="primary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<Phone />}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>

      <Box textAlign="center">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/login')}
          color="inherit"
        >
          Back to Admin Login
        </Button>
      </Box>
    </Box>
  );

  const renderOTPStep = () => (
    <Box component="form" onSubmit={handleOTPSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Verify OTP
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the 6-digit OTP sent to your registered mobile number
        </Typography>
        <Chip 
          label={`ID: ${form.officialId}`} 
          color="primary" 
          size="small" 
          sx={{ mt: 1 }} 
        />
      </Box>

      {generalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {generalError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="6-Digit OTP"
        value={form.otp}
        onChange={handleInputChange('otp')}
        error={!!getFieldError('otp')}
        helperText={getFieldError('otp')}
        margin="normal"
        inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Security color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="123456"
        autoComplete="one-time-code"
      />

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<Login />}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Verifying...' : 'Verify & Login'}
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={() => setStep('credentials')}
          color="inherit"
        >
          Back
        </Button>
        <Button
          color="primary"
          disabled={loading}
        >
          Resend OTP
        </Button>
      </Box>
    </Box>
  );

  const renderSuccessStep = () => (
    <Box textAlign="center">
      <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="success.main">
        Authentication Successful
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to the SAI Talent Identification Platform
      </Typography>
      <LinearProgress color="success" sx={{ mb: 2 }} />
      <Typography variant="caption" color="text.secondary">
        Redirecting to dashboard...
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header with SAI Branding */}
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
          <AccountBalance color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Sports Authority of India
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Talent Identification Portal
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        {step === 'credentials' && renderCredentialsStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'success' && renderSuccessStep()}

        {/* Security Notice */}
        {step !== 'success' && (
          <>
            <Divider sx={{ my: 3 }} />
            <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  <Policy sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                  Security Notice
                </Typography>
                <List dense>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <VerifiedUser color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Authorized personnel only"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Security color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="All activities are logged and monitored"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </>
        )}
      </Paper>

      {/* Demo Instructions */}
      {process.env.NODE_ENV === 'development' && step === 'credentials' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Demo Instructions:</Typography>
          <Typography variant="body2">
            Use any Official ID in format <strong>SAI123456</strong> and any password (8+ characters).
            Any 6-digit OTP will be accepted for demo purposes.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default SAILoginPage;

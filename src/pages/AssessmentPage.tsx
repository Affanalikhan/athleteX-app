import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
  Videocam as VideocamIcon,
  NetworkCheck as NetworkIcon,
  Smartphone as DeviceIcon
} from '@mui/icons-material';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TestType } from '../models';
import { useAssessment } from '../hooks/useAssessment';
import { useCapacitorContext } from '../providers/CapacitorProvider';
import VideoRecorder from '../components/VideoRecorder';

interface AssessmentForm {
  testType: TestType;
  notes: string;
}

const assessmentSchema = yup.object({
  testType: yup.mixed<TestType>().oneOf(Object.values(TestType)).required(),
  notes: yup.string().max(500)
}).required() as yup.ObjectSchema<AssessmentForm>;

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAssessment, uploading, error, clearError, getScoreDisplay } = useAssessment();
  const capacitor = useCapacitorContext();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const form = useForm<AssessmentForm>({
    resolver: yupResolver(assessmentSchema) as unknown as Resolver<AssessmentForm>,
    defaultValues: { testType: TestType.SPEED, notes: '' }
  });

  // Capture location for assessment context
  const handleCaptureLocation = async () => {
    if (!capacitor.permissions.location) {
      const permissions = await capacitor.requestPermissions();
      if (!permissions.location) {
        alert('Location permission is required to capture assessment location.');
        return;
      }
    }

    setGettingLocation(true);
    try {
      const location = await capacitor.getCurrentLocation();
      if (location) {
        setLocationData({
          lat: location.latitude,
          lng: location.longitude,
          accuracy: location.accuracy
        });
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setGettingLocation(false);
    }
  };

  // Capture photo for assessment reference
  const handleCapturePhoto = async () => {
    if (!capacitor.permissions.camera) {
      const permissions = await capacitor.requestPermissions();
      if (!permissions.camera) {
        alert('Camera permission is required to capture photos.');
        return;
      }
    }

    const photoBase64 = await capacitor.capturePhoto();
    if (photoBase64) {
      // Save photo data for later use with assessment
      console.log('Photo captured successfully:', photoBase64.substring(0, 50) + '...');
      // You could save this to state or include it with the assessment
    }
  };

  const onVideoReady = (file: File) => {
    setVideoFile(file);
  };

  const onUpload = async (file: File) => {
    setUploadingVideo(true);
    try {
      clearError();
      const data = form.getValues();
      const assessment = await createAssessment(data.testType, file, data.notes);
      setLastResult(getScoreDisplay(assessment.testType, assessment.score));
      setVideoFile(null);
      
      // Redirect to results page after successful submission
      setTimeout(() => {
        navigate(`/assessment/results/${assessment.id}`);
      }, 1500); // Show success message briefly before redirecting
      
    } finally {
      setUploadingVideo(false);
    }
  };

const onSubmit: SubmitHandler<AssessmentForm> = async (data) => {
    if (!videoFile) {
      alert('Please record a video first.');
      return;
    }

    await onUpload(videoFile);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assessment Tests
        </Typography>

        {/* Native Features Status */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Device Features
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              icon={<DeviceIcon />}
              label={capacitor.isNative ? 'Native App' : 'Web App'}
              color={capacitor.isNative ? 'success' : 'default'}
              size="small"
            />
            <Chip
              icon={<NetworkIcon />}
              label={capacitor.networkInfo?.connected ? 'Online' : 'Offline'}
              color={capacitor.networkInfo?.connected ? 'success' : 'warning'}
              size="small"
            />
            {capacitor.deviceInfo && (
              <Chip
                label={`${capacitor.deviceInfo.platform} • ${capacitor.deviceInfo.operatingSystem}`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        {/* Native Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Assessment Tools
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Capture current location for assessment context">
              <Button
                variant="outlined"
                startIcon={gettingLocation ? <CircularProgress size={16} /> : <LocationIcon />}
                onClick={handleCaptureLocation}
                disabled={gettingLocation}
                size="small"
              >
                {locationData ? 'Location Captured' : 'Get Location'}
              </Button>
            </Tooltip>
            
            <Tooltip title="Take a photo for assessment reference">
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                onClick={handleCapturePhoto}
                disabled={!capacitor.permissions.camera && capacitor.isNative}
                size="small"
              >
                Capture Photo
              </Button>
            </Tooltip>
          </Box>
          
          {locationData && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Location captured: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)} 
              (±{locationData.accuracy.toFixed(0)}m)
            </Alert>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Test Type</InputLabel>
                <Controller
                  name="testType"
                  control={form.control}
                  render={({ field }) => (
                    <Select {...field} label="Test Type">
                      {Object.values(TestType).map((t) => (
                        <MenuItem key={t} value={t}>
                          {t.replace('_', ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <TextField
                {...form.register('notes')}
                label="Notes (optional)"
                fullWidth
                multiline
                minRows={3}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={uploading || uploadingVideo || !videoFile}
              >
                {uploading || uploadingVideo ? <CircularProgress size={24} /> : 'Submit Assessment'}
              </Button>

              {lastResult && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Assessment submitted! Score: {lastResult}
                </Alert>
              )}
            </form>
          </Grid>

          <Grid item xs={12} md={6}>
            <VideoRecorder
              onVideoReady={onVideoReady}
              onUpload={onUpload}
              uploading={uploading || uploadingVideo}
              maxDuration={60}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AssessmentPage;

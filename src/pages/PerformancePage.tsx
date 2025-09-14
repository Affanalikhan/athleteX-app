import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, TrendingUp, TrendingDown, Delete, Edit } from '@mui/icons-material';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MetricType } from '../models';
import { usePerformance } from '../hooks/usePerformance';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricForm {
  metricType: MetricType;
  value: number;
  unit: string;
  notes: string;
}

const metricSchema = yup.object({
  metricType: yup.mixed<MetricType>().oneOf(Object.values(MetricType)).required(),
  value: yup.number().positive('Value must be positive').required('Value is required'),
  unit: yup.string().required('Unit is required'),
  notes: yup.string().max(500, 'Notes must be less than 500 characters')
}).required() as yup.ObjectSchema<MetricForm>;

const PerformancePage: React.FC = () => {
  const {
    metrics,
    loading,
    error,
    adding,
    addMetric,
    deleteMetric,
    getPersonalBest,
    getProgress,
    getChartData,
    getMetricDisplayInfo,
    clearError
  } = usePerformance();

  const [open, setOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState<MetricType>(MetricType.TIMING_100M);

const form = useForm<MetricForm>({
    resolver: yupResolver(metricSchema) as unknown as Resolver<MetricForm>,
    defaultValues: {
      metricType: MetricType.TIMING_100M,
      value: 0,
      unit: 'seconds',
      notes: ''
    }
  });

  // Update unit when metric type changes
  React.useEffect(() => {
    const info = getMetricDisplayInfo(form.watch('metricType'));
    form.setValue('unit', info.unit);
  }, [form.watch('metricType'), form, getMetricDisplayInfo]);

const handleSubmit: SubmitHandler<MetricForm> = async (data) => {
    try {
      clearError();
      await addMetric(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async (metricId: string) => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      try {
        await deleteMetric(metricId);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading && metrics.length === 0) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Performance Metrics
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Metric
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Performance Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.values(MetricType).map((metricType) => {
          const info = getMetricDisplayInfo(metricType);
          const personalBest = getPersonalBest(metricType);
          const progress = getProgress(metricType);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={metricType}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {info.label}
                  </Typography>
                  
                  {personalBest !== null ? (
                    <>
                      <Typography variant="h4" color="primary">
                        {info.format(personalBest)}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        {progress > 0 ? (
                          <TrendingUp color="success" />
                        ) : progress < 0 ? (
                          <TrendingDown color="error" />
                        ) : null}
                        
                        <Typography
                          variant="body2"
                          color={progress > 0 ? 'success.main' : progress < 0 ? 'error.main' : 'text.secondary'}
                          sx={{ ml: 0.5 }}
                        >
                          {progress !== 0 ? `${progress.toFixed(1)}% (30 days)` : 'No change'}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No records yet
                    </Typography>
                  )}
                  
                  <Button
                    size="small"
                    onClick={() => setSelectedMetricType(metricType)}
                    sx={{ mt: 1 }}
                  >
                    View Chart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Chart Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Progress Chart - {getMetricDisplayInfo(selectedMetricType).label}
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Metric Type</InputLabel>
            <Select
              value={selectedMetricType}
              label="Metric Type"
              onChange={(e) => setSelectedMetricType(e.target.value as MetricType)}
            >
              {Object.values(MetricType).map((type) => (
                <MenuItem key={type} value={type}>
                  {getMetricDisplayInfo(type).label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 400 }}>
          <Line data={getChartData(selectedMetricType)} options={chartOptions} />
        </Box>
      </Paper>

      {/* Recent Metrics List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Metrics
        </Typography>
        
        {metrics.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No metrics recorded yet. Add your first performance metric!
          </Typography>
        ) : (
          <List>
            {metrics.slice(0, 10).map((metric) => {
              const info = getMetricDisplayInfo(metric.metricType);
              
              return (
                <ListItem key={metric.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                          {info.label}
                        </Typography>
                        <Chip 
                          label={info.format(metric.value)} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.timestamp.toLocaleDateString()} at {metric.timestamp.toLocaleTimeString()}
                        </Typography>
                        {metric.notes && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {metric.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(metric.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Add Metric Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Performance Metric</DialogTitle>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="metricType"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Metric Type</InputLabel>
                      <Select {...field} label="Metric Type">
                        {Object.values(MetricType).map((type) => (
                          <MenuItem key={type} value={type}>
                            {getMetricDisplayInfo(type).label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={8}>
<TextField
                  {...form.register('value')}
                  error={!!form.formState.errors.value}
                  helperText={form.formState.errors.value?.message}
                  label="Value"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={4}>
                <TextField
                  {...form.register('unit')}
                  error={!!form.formState.errors.unit}
                  helperText={form.formState.errors.unit?.message}
                  label="Unit"
                  fullWidth
                  disabled
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...form.register('notes')}
                  error={!!form.formState.errors.notes}
                  helperText={form.formState.errors.notes?.message}
                  label="Notes (optional)"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={adding}>
              {adding ? <CircularProgress size={20} /> : 'Add Metric'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default PerformancePage;

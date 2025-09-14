import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Badge,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  People,
  Star,
  Assessment,
  CloudSync,
  FilterList,
  Search,
  Download,
  Visibility,
  LocationOn,
  SportsSoccer,
  EmojiEvents,
  Analytics,
  Campaign,
  NotificationImportant,
  ExpandMore,
  Close,
  CheckCircle,
  Warning,
  Info,
  AccountBalance,
  Groups,
  Map as MapIcon,
  Timeline,
  Phone,
  Email,
  PersonAdd,
  FileUpload
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import saiCloudService, { SAITalentProfile, SAITalentSearchFilters, SAIRecruitmentCampaign } from '../services/saiCloudService';
import assessmentService from '../services/assessmentService';
import athleteService from '../services/athleteService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sai-tabpanel-${index}`}
      aria-labelledby={`sai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface DashboardMetrics {
  totalTalents: number;
  identifiedTalents: number;
  activeRecruitments: number;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSync: Date;
}

const SAIDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [talents, setTalents] = useState<SAITalentProfile[]>([]);
  const [campaigns, setCampaigns] = useState<SAIRecruitmentCampaign[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTalents: 0,
    identifiedTalents: 0,
    activeRecruitments: 0,
    syncStatus: 'synced',
    lastSync: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<SAITalentProfile | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Search and Filter States
  const [searchFilters, setSearchFilters] = useState<SAITalentSearchFilters>({
    ageRange: { min: 14, max: 25 },
    minScore: 60,
    percentileThreshold: 50
  });
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  
  // Selection States
  const [selectedTalentIds, setSelectedTalentIds] = useState<Set<string>>(new Set());
  const [bulkActionDialog, setBulkActionDialog] = useState<'shortlist' | 'export' | 'contact' | null>(null);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load talents, campaigns, and analytics
      const [talentsData, campaignsData, analyticsData] = await Promise.all([
        saiCloudService.searchTalents(searchFilters),
        saiCloudService.getActiveRecruitmentCampaigns(),
        saiCloudService.generateTalentAnalytics()
      ]);

      setTalents(talentsData);
      setCampaigns(campaignsData);
      setAnalytics(analyticsData);
      
      // Update metrics
      setMetrics({
        totalTalents: analyticsData.totalTalents,
        identifiedTalents: analyticsData.recruitmentFunnel.identified,
        activeRecruitments: campaignsData.length,
        syncStatus: 'synced',
        lastSync: new Date()
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setSyncLoading(true);
    try {
      // Get local athlete and assessment data
      const [athletes, assessments] = await Promise.all([
        athleteService.getAllAthletes(),
        assessmentService.getAllAssessments()
      ]);

      // Group assessments by athlete
      const assessmentsByAthlete = new Map<string, any[]>();
      assessments.forEach(assessment => {
        const existing = assessmentsByAthlete.get(assessment.athleteId) || [];
        assessmentsByAthlete.set(assessment.athleteId, [...existing, assessment]);
      });

      // Bulk sync to SAI cloud
      const syncResult = await saiCloudService.bulkSyncAthletes(athletes, assessmentsByAthlete);
      
      // Reload data after sync
      await loadDashboardData();
      
      setMetrics(prev => ({
        ...prev,
        syncStatus: 'synced',
        lastSync: new Date()
      }));
      
    } catch (error) {
      console.error('Sync error:', error);
      setMetrics(prev => ({ ...prev, syncStatus: 'error' }));
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await saiCloudService.searchTalents(searchFilters);
      setTalents(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTalent = (talent: SAITalentProfile) => {
    setSelectedTalent(talent);
    setViewDetailsOpen(true);
  };

  const handleSelectTalent = (talentId: string) => {
    const newSet = new Set(selectedTalentIds);
    if (newSet.has(talentId)) {
      newSet.delete(talentId);
    } else {
      newSet.add(talentId);
    }
    setSelectedTalentIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedTalentIds.size === talents.length) {
      setSelectedTalentIds(new Set());
    } else {
      setSelectedTalentIds(new Set(talents.map(t => t.athleteId)));
    }
  };

  const handleBulkAction = async (action: 'shortlist' | 'export' | 'contact') => {
    if (selectedTalentIds.size === 0) return;

    setBulkActionDialog(action);
  };

  const executeBulkAction = async () => {
    if (!bulkActionDialog || selectedTalentIds.size === 0) return;

    try {
      const selectedIds = Array.from(selectedTalentIds);
      
      switch (bulkActionDialog) {
        case 'shortlist':
          if (campaigns.length > 0) {
            await saiCloudService.createRecruitmentShortlist(campaigns[0].id, selectedIds);
          }
          break;
        case 'export':
          const exportResult = await saiCloudService.exportTalentData({
            ...searchFilters,
            // Filter to only selected talents
          }, 'excel');
          // Handle download
          break;
        case 'contact':
          // Implement contact functionality
          break;
      }
      
      setSelectedTalentIds(new Set());
      setBulkActionDialog(null);
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const getSyncStatusColor = () => {
    switch (metrics.syncStatus) {
      case 'synced': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getRecruitmentStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'success';
      case 'shortlisted': return 'info';
      case 'contacted': return 'warning';
      case 'recruited': return 'primary';
      default: return 'default';
    }
  };

  // Chart colors for consistency
  const chartColors = ['#00f5ff', '#0080ff', '#4dd5ff', '#66b2ff', '#0056b3'];

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Key Metrics Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Groups color="primary" fontSize="large" />
              <Box>
                <Typography variant="h4">{metrics.totalTalents}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Talents
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Star color="warning" fontSize="large" />
              <Box>
                <Typography variant="h4">{metrics.identifiedTalents}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Identified Talents
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Campaign color="info" fontSize="large" />
              <Box>
                <Typography variant="h4">{metrics.activeRecruitments}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Campaigns
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CloudSync color={getSyncStatusColor() as any} fontSize="large" />
              <Box>
                <Typography variant="h6">
                  <Chip 
                    label={metrics.syncStatus.toUpperCase()} 
                    color={getSyncStatusColor()} 
                    size="small" 
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data Sync Status
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Analytics Charts */}
      {analytics && (
        <>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Talent Distribution by State" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.byState}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#00f5ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Sport-wise Talent Count" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.bySport}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }: any) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.bySport.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Recruitment Funnel" />
              <CardContent>
                <Grid container spacing={2}>
                  {Object.entries(analytics.recruitmentFunnel).map(([stage, count]) => (
                    <Grid item xs={12} sm={6} md={3} key={stage}>
                      <Box textAlign="center">
                        <Typography variant="h5" color="primary">
                          {count as number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderTalentSearchTab = () => (
    <Box>
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Minimum Score"
              type="number"
              value={searchFilters.minScore || ''}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, minScore: Number(e.target.value) }))}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Percentile"
              type="number"
              value={searchFilters.percentileThreshold || ''}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, percentileThreshold: Number(e.target.value) }))}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={loading}
              fullWidth
            >
              Search
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setAdvancedFiltersOpen(true)}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<CloudSync />}
              onClick={handleSyncData}
              disabled={syncLoading}
              fullWidth
            >
              {syncLoading ? 'Syncing...' : 'Sync Data'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedTalentIds.size > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedTalentIds.size} talent{selectedTalentIds.size !== 1 ? 's' : ''} selected
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="success"
                startIcon={<Star />}
                onClick={() => handleBulkAction('shortlist')}
              >
                Shortlist
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleBulkAction('export')}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<PersonAdd />}
                onClick={() => handleBulkAction('contact')}
              >
                Contact
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setSelectedTalentIds(new Set())}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Talents Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Button
                    size="small"
                    onClick={handleSelectAll}
                  >
                    {selectedTalentIds.size === talents.length && talents.length > 0 ? 'Deselect All' : 'Select All'}
                  </Button>
                </TableCell>
                <TableCell>Athlete</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Sports</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Percentile</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading talents...</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                talents.map((talent) => (
                  <TableRow key={talent.athleteId} selected={selectedTalentIds.has(talent.athleteId)}>
                    <TableCell padding="checkbox">
                      <Button
                        size="small"
                        onClick={() => handleSelectTalent(talent.athleteId)}
                      >
                        {selectedTalentIds.has(talent.athleteId) ? '☑️' : '☐'}
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          {talent.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {talent.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Age: {talent.age}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">
                          {talent.location.city}, {talent.location.state}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {talent.sportsCategories.slice(0, 2).map(sport => (
                          <Chip
                            key={sport}
                            label={sport}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {talent.sportsCategories.length > 2 && (
                          <Chip
                            label={`+${talent.sportsCategories.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip
                        label={talent.assessmentSummary.averageScore.toFixed(1)}
                        color={talent.assessmentSummary.averageScore >= 80 ? 'success' : 
                               talent.assessmentSummary.averageScore >= 70 ? 'info' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        {talent.assessmentSummary.percentileRank}th
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip
                        label={talent.recruitmentStatus.replace('_', ' ').toUpperCase()}
                        color={getRecruitmentStatusColor(talent.recruitmentStatus)}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewTalent(talent)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  const renderCampaignsTab = () => (
    <Grid container spacing={3}>
      {campaigns.map((campaign) => (
        <Grid item xs={12} md={6} key={campaign.id}>
          <Card>
            <CardHeader
              title={campaign.name}
              subheader={campaign.description}
              action={
                <Chip
                  label={campaign.status.toUpperCase()}
                  color={campaign.status === 'active' ? 'success' : 'default'}
                />
              }
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon><SportsSoccer /></ListItemIcon>
                  <ListItemText
                    primary="Target Sports"
                    secondary={campaign.targetSports.join(', ')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Groups /></ListItemIcon>
                  <ListItemText
                    primary="Recruitment Quota"
                    secondary={campaign.recruitmentQuota}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Assessment /></ListItemIcon>
                  <ListItemText
                    primary="Min Score Required"
                    secondary={campaign.eligibilityCriteria.minScore}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" fullWidth>
                  View Campaign Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <AccountBalance color="primary" fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              SAI Talent Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sports Authority of India - Talent Identification & Recruitment
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Last Sync: {metrics.lastSync.toLocaleString()}
          </Typography>
          <Chip
            label={`Official: ${saiCloudService.getCurrentOfficialId()}`}
            color="primary"
            size="small"
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" icon={<Dashboard />} />
          <Tab label="Talent Search" icon={<Search />} />
          <Tab label="Recruitment Campaigns" icon={<Campaign />} />
          <Tab label="Analytics" icon={<Analytics />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderOverviewTab()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderTalentSearchTab()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderCampaignsTab()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6">Advanced Analytics Coming Soon</Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed performance analytics, trend analysis, and predictive insights will be available in the next release.
        </Typography>
      </TabPanel>

      {/* Talent Details Dialog */}
      <Dialog open={viewDetailsOpen} onClose={() => setViewDetailsOpen(false)} maxWidth="md" fullWidth>
        {selectedTalent && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 56, height: 56 }}>
                  {selectedTalent.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedTalent.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTalent.location.city}, {selectedTalent.location.state}
                  </Typography>
                </Box>
                <IconButton onClick={() => setViewDetailsOpen(false)} sx={{ ml: 'auto' }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Age" secondary={`${selectedTalent.age} years`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Sports Categories" 
                        secondary={selectedTalent.sportsCategories.join(', ')} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Recruitment Status"
                        secondary={
                          <Chip
                            label={selectedTalent.recruitmentStatus.replace('_', ' ').toUpperCase()}
                            color={getRecruitmentStatusColor(selectedTalent.recruitmentStatus)}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Assessment Summary</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total Assessments" 
                        secondary={selectedTalent.assessmentSummary.totalAssessments} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Average Score" 
                        secondary={selectedTalent.assessmentSummary.averageScore.toFixed(1)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Percentile Rank" 
                        secondary={`${selectedTalent.assessmentSummary.percentileRank}th percentile`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Key Strengths" 
                        secondary={selectedTalent.assessmentSummary.strengths.join(', ') || 'None identified'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                {selectedTalent.assessmentSummary.potentialSports.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Potential Sports</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedTalent.assessmentSummary.potentialSports.map(sport => (
                        <Chip
                          key={sport}
                          label={sport}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setViewDetailsOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                color="primary"
              >
                Add to Shortlist
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone />}
              >
                Contact Athlete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={!!bulkActionDialog} onClose={() => setBulkActionDialog(null)}>
        <DialogTitle>
          Confirm Bulk Action
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {bulkActionDialog} {selectedTalentIds.size} selected talent{selectedTalentIds.size !== 1 ? 's' : ''}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={executeBulkAction}
            color={bulkActionDialog === 'shortlist' ? 'primary' : 'success'}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SAIDashboard;

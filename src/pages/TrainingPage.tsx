import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore,
  FitnessCenter,
  Timer,
  Repeat,
  Star,
  StarBorder,
  PlayArrow
} from '@mui/icons-material';
import { SportType, DifficultyLevel, TrainingProgram } from '../models';
import trainingProgramsData from '../data/trainingPrograms.json';

// Convert JSON data to our TypeScript interface
const trainingPrograms: TrainingProgram[] = trainingProgramsData.map(program => ({
  ...program,
  sport: program.sport as SportType,
  difficulty: program.difficulty as DifficultyLevel
}));

const TrainingPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredPrograms = trainingPrograms.filter(program => {
    const sportMatch = selectedSport === 'all' || program.sport === selectedSport;
    const difficultyMatch = selectedDifficulty === 'all' || program.difficulty === selectedDifficulty;
    return sportMatch && difficultyMatch;
  });

  const toggleFavorite = (programId: string) => {
    setFavorites(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return 'success';
      case DifficultyLevel.INTERMEDIATE:
        return 'warning';
      case DifficultyLevel.ADVANCED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getSportIcon = (sport: SportType) => {
    // In a real app, you'd have different icons for different sports
    return <FitnessCenter />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Training Programs
      </Typography>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Programs
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sport</InputLabel>
              <Select
                value={selectedSport}
                label="Sport"
                onChange={(e) => setSelectedSport(e.target.value as SportType | 'all')}
              >
                <MenuItem value="all">All Sports</MenuItem>
                {Object.values(SportType).map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              >
                <MenuItem value="all">All Levels</MenuItem>
                {Object.values(DifficultyLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Programs Grid */}
      <Grid container spacing={3}>
        {filteredPrograms.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Box textAlign="center">
                  {getSportIcon(program.sport)}
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {program.sport.charAt(0).toUpperCase() + program.sport.slice(1)}
                  </Typography>
                </Box>
              </CardMedia>

              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="h2">
                    {program.title}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => toggleFavorite(program.id)}
                    startIcon={favorites.includes(program.id) ? <Star /> : <StarBorder />}
                  >
                    {favorites.includes(program.id) ? 'Favorited' : 'Favorite'}
                  </Button>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={program.difficulty}
                    color={getDifficultyColor(program.difficulty)}
                    size="small"
                  />
                  <Chip
                    label={program.duration}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {program.description}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {program.exercises.length} exercises included
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => setSelectedProgram(program)}
                  fullWidth
                >
                  View Program
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPrograms.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No training programs found for the selected filters.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your sport or difficulty level filters.
          </Typography>
        </Paper>
      )}

      {/* Program Details Dialog */}
      <Dialog
        open={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedProgram && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">
                  {selectedProgram.title}
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    label={selectedProgram.difficulty}
                    color={getDifficultyColor(selectedProgram.difficulty)}
                  />
                  <Chip
                    label={selectedProgram.duration}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedProgram.description}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Exercises ({selectedProgram.exercises.length})
              </Typography>

              {selectedProgram.exercises.map((exercise, index) => (
                <Accordion key={exercise.id}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {index + 1}. {exercise.name}
                      </Typography>
                      <Box display="flex" gap={2} mr={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Timer fontSize="small" />
                          <Typography variant="body2">{exercise.duration}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Repeat fontSize="small" />
                          <Typography variant="body2">{exercise.reps}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" display="block">
                        <strong>Duration:</strong> {exercise.duration}
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>Repetitions:</strong> {exercise.reps}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedProgram(null)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => {
                  // In a real app, this could start a workout session
                  alert('Starting workout session! (This is a demo)');
                }}
              >
                Start Training
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default TrainingPage;

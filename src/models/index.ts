export interface Athlete {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  sportsPlayed: string[];
  primarySport?: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  profilePictureUrl: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentTest {
  id: string;
  athleteId: string;
  testType: TestType;
  videoUrl: string;
  score: number;
  timestamp: Date;
  notes: string;
}

export enum TestType {
  SPEED = 'speed',
  AGILITY = 'agility',
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  BALANCE = 'balance'
}

export interface PerformanceMetric {
  id: string;
  athleteId: string;
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  notes: string;
}

export enum MetricType {
  TIMING_100M = 'timing_100m',
  TIMING_200M = 'timing_200m',
  TIMING_800M = 'timing_800m',
  LONG_JUMP = 'long_jump',
  SHOT_PUT_DISTANCE = 'shot_put_distance'
}

export interface TrainingProgram {
  id: string;
  sport: SportType;
  title: string;
  description: string;
  exercises: Exercise[];
  difficulty: DifficultyLevel;
  duration: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  reps: string;
  imageUrl: string;
}

export enum SportType {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  HANDBALL = 'handball',
  ATHLETICS = 'athletics',
  HOCKEY = 'hockey',
  KABADDI = 'kabaddi'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface SocialPost {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteProfilePicture: string;
  content: string;
  mediaUrl: string;
  mediaType: MediaType;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: Date;
}

export interface Comment {
  id: string;
  athleteId: string;
  athleteName: string;
  content: string;
  timestamp: Date;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export interface AdminFilter {
  sport?: SportType;
  minAge?: number;
  maxAge?: number;
  country: string;
  state: string;
  city: string;
}

export interface AthleteRanking {
  athlete: Athlete;
  totalScore: number;
  rank: number;
  isShortlisted: boolean;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'athlete' | 'admin';
}

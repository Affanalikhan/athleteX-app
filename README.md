# AthleteX MVP - AI-Powered Athletic Performance Management

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/user/athletex)

## 🚀 Overview

AthleteX is an AI-powered athletic performance management platform that provides comprehensive assessment, analysis, and improvement tools for athletes of all levels. This MVP showcases advanced AI features for assessment integrity, performance benchmarking, and talent identification.

**🌐 Live MVP**: [https://athletex-mvp.vercel.app](https://athletex-mvp.vercel.app)

## Features

### 🔐 Authentication (Firebase Auth)
- User Login & Signup with Email/Password
- Phone OTP login support (Coming Soon)
- Secure user session management

### 👤 Athlete Profile Management
- Comprehensive athlete profile with details:
  - Personal Information (Name, Age, Weight, Height)
  - Sports Played
  - Contact Information (Mobile, Email)
  - Location Details (Country, State, City, Pin Code)
- Profile picture upload using Firebase Storage
- Clean and intuitive profile UI

### 📊 Assessment Tests
- Athletic performance tests including:
  - Shot Put
  - Broad Jump
  - Shuttle Run
  - Squats
  - High Jump
- Video recording using CameraX API
- Video upload to Firebase Storage
- Test results storage in Firestore with dummy scoring

### 📈 Athletic Performance Tracking
- Performance metrics tracking:
  - 100m Timing
  - 200m Timing
  - Long Jump
  - 800m Timing
  - Shot Put Distance
- Performance history visualization
- Graph display using MPAndroidChart
- Historical data management in Firestore

### 🏃‍♂️ Training Programs
- Sport-specific training programs:
  - Football
  - Basketball
  - Handball
  - Athletics
  - Hockey
  - Kabaddi
- Exercise library with detailed instructions
- Training plans displayed in RecyclerView cards
- Static JSON data for exercises

### 📱 Social Feed (AthleteX Social)
- Instagram-like social platform for athletes
- Features include:
  - Upload training/performance videos and images
  - Like and comment on posts
  - Follow other athletes
  - Share achievements
- Posts stored in Firestore
- Media files stored in Firebase Storage

### 👨‍💼 Admin Dashboard
- Administrative panel with:
  - View all athlete test results
  - Athlete ranking system based on scores
  - Filtering options (by sport, age, location)
  - Athlete shortlisting functionality
- Available as in-app admin mode

## Technical Stack

- **Language**: Kotlin
- **Architecture**: MVVM (Model-View-ViewModel)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Components**: Material Design 3
- **Camera**: CameraX API
- **Charts**: MPAndroidChart
- **Image Loading**: Glide
- **Coroutines**: For asynchronous operations
- **ViewBinding & DataBinding**: For type-safe view interactions

## Project Structure

```
app/src/main/java/com/athletex/
├── model/                  # Data models and entities
├── ui/                    # UI layer (Activities, Fragments, Adapters)
│   ├── adapter/          # RecyclerView adapters
│   ├── auth/             # Authentication screens
│   ├── profile/          # Profile management
│   ├── assessment/       # Assessment tests
│   ├── performance/      # Performance tracking
│   ├── training/         # Training programs
│   ├── social/           # Social feed
│   ├── admin/            # Admin dashboard
│   └── model/            # UI-specific models
├── viewmodel/            # ViewModels for MVVM
├── repository/           # Data access layer
└── utils/                # Utility classes and extensions
```

## Firebase Configuration

### Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following Firebase services:
   - Authentication (Email/Password & Phone)
   - Cloud Firestore
   - Cloud Storage

### Setup Steps

1. **Download google-services.json**:
   - In Firebase Console, go to Project Settings
   - Download the `google-services.json` file
   - Replace the placeholder file at `app/google-services.json`

2. **Configure Authentication**:
   ```
   Firebase Console > Authentication > Sign-in method
   - Enable Email/Password
   - Enable Phone (for OTP support)
   ```

3. **Setup Firestore Database**:
   ```
   Firebase Console > Firestore Database
   - Create database in production mode
   - Configure security rules as needed
   ```

4. **Configure Storage**:
   ```
   Firebase Console > Storage
   - Set up Cloud Storage bucket
   - Configure security rules for file uploads
   ```

## Installation & Setup

### Development Environment Requirements
- Android Studio Arctic Fox or later
- Android SDK API 24 (minimum) to API 34 (target)
- JDK 8 or later
- Gradle 8.0+

### Build Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
# AthleteX Web Application

A modern React + TypeScript web application for athletic performance management with Firebase backend.

## Features

### 🔐 Authentication
- **Email/Password signup & login**
- **Phone OTP login** with Firebase Auth + reCAPTCHA
- **Role-based access** (Athlete/Admin)

### 👤 Athlete Profile
- **Comprehensive profile form** (Personal info, sports, address)
- **Profile picture upload** to Firebase Storage
- **Form validation** with react-hook-form + yup
- **Clean, responsive UI** with Material-UI

### 🎯 Assessment Tests
- **Video recording** using browser MediaRecorder API
- **5 test types**: Shot Put, Broad Jump, Shuttle Run, Squats, High Jump
- **Camera access** with getUserMedia
- **Video upload** to Firebase Storage
- **AI scoring simulation** (dummy algorithm for demo)

### 📈 Performance Metrics
- **5 metric types**: 100m/200m/800m timing, Long Jump, Shot Put distance
- **Interactive charts** with Chart.js/react-chartjs-2
- **Personal best tracking**
- **Progress calculation** (30-day improvement %)
- **CRUD operations** (Create, Read, Update, Delete)

### 🏋️ Training Programs
- **6 sports programs**: Football, Basketball, Handball, Athletics, Hockey, Kabaddi
- **3 difficulty levels**: Beginner, Intermediate, Advanced
- **Static JSON data** with detailed exercise breakdowns
- **Filtering & favorites** functionality
- **Card-based Material-UI layout**

### 🗣️ Social Feed (Placeholder)
- Post creation with media upload
- Like & comment system
- Follow other athletes

### 👨‍💼 Admin Dashboard (Placeholder)
- View all athletes and rankings
- Filter by sport, age, location
- Review test results & shortlist athletes

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components & theming
- **React Router** for navigation
- **React Hook Form + Yup** for forms & validation
- **Chart.js + react-chartjs-2** for data visualization

### Backend & Services
- **Firebase Authentication** (Email/Password + Phone OTP)
- **Firestore Database** for data persistence
- **Firebase Storage** for file uploads
- **Browser APIs**: MediaRecorder, getUserMedia for video recording

### Architecture
- **MVVM Pattern**:
  - **Views**: React components (src/pages, src/components)
  - **ViewModels**: Custom hooks (src/hooks)
  - **Models**: TypeScript interfaces (src/models)
  - **Services**: Firebase operations (src/services)

## Setup Instructions

### 1. Prerequisites
- Node.js 16+ and npm
- Firebase project with Web app configured

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable the following services:
   - **Authentication** → Email/Password + Phone providers
   - **Firestore Database** → Production mode
   - **Storage** → Default bucket
3. Add a Web app to get your config object
4. Add your domain to Auth → Settings → Authorized domains (for local dev: `localhost`)

### 3. Project Setup
```bash
# Install dependencies
npm install

# Update Firebase config
# Edit src/config/firebase.ts with your Firebase project config:
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Deploy Firestore Rules (Optional)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

### 5. Run the Application
```bash
# Start development server
npm start

# Open http://localhost:3000
```

## Usage Guide

### For Athletes
1. **Sign up** with email or phone number
2. **Complete your profile** with personal info and sports
3. **Take assessment tests** by recording videos
4. **Track performance metrics** and view progress charts
5. **Browse training programs** filtered by sport/difficulty

### For Admins
1. **Sign up** normally (role can be changed in Firestore manually)
2. **Access admin dashboard** with elevated permissions
3. **View all athlete data** and assessment results

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx
│   ├── LoadingSpinner.tsx
│   └── VideoRecorder.tsx
├── pages/               # Main page components (Views)
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ProfilePage.tsx
│   ├── AssessmentPage.tsx
│   ├── PerformancePage.tsx
│   ├── TrainingPage.tsx
│   ├── SocialPage.tsx
│   └── AdminPage.tsx
├── hooks/               # Custom React hooks (ViewModels)
│   ├── useAuth.ts
│   ├── useAthlete.ts
│   ├── useAssessment.ts
│   └── usePerformance.ts
├── services/            # Firebase service classes
│   ├── authService.ts
│   ├── athleteService.ts
│   ├── assessmentService.ts
│   └── performanceService.ts
├── models/              # TypeScript interfaces
│   └── index.ts
├── config/              # Configuration files
│   └── firebase.ts
├── data/                # Static JSON data
│   └── trainingPrograms.json
└── utils/               # Utility functions
```

## Key Features Implemented

✅ **Complete Authentication System** (Email + Phone OTP)  
✅ **Profile Management** with image upload  
✅ **Video Assessment Recording** with camera API  
✅ **Performance Tracking** with charts  
✅ **Training Programs** with filtering  
✅ **Responsive Material-UI Design**  
✅ **MVVM Architecture** with custom hooks  
✅ **Firestore Security Rules**  
✅ **TypeScript Throughout**  

## Browser Compatibility
- **Chrome 88+** (recommended for video recording)
- **Firefox 85+**
- **Edge 88+**
- **Safari 14+** (limited video codec support)

## Future Enhancements
- Complete Social Feed implementation
- Full Admin Dashboard with rankings
- Real AI scoring for assessments
- Push notifications
- Progressive Web App (PWA) features
- More detailed analytics
   ```

2. **Configure Firebase**:
   - Replace `app/google-services.json` with your Firebase configuration file
   - Update Firebase project settings if needed

3. **Build the Project**:
   ```bash
   ./gradlew build
   ```

4. **Run on Emulator or Device**:
   - Use Android Studio to run the app
   - Recommended: Pixel 5 API 30+ emulator
   - Ensure emulator has camera and internet access

### Dependencies

The project includes the following key dependencies:

```gradle
// Firebase
implementation platform('com.google.firebase:firebase-bom:32.6.0')
implementation 'com.google.firebase:firebase-auth-ktx'
implementation 'com.google.firebase:firebase-firestore-ktx'
implementation 'com.google.firebase:firebase-storage-ktx'

// MVVM Architecture
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'

// CameraX
implementation 'androidx.camera:camera-core:1.3.0'
implementation 'androidx.camera:camera-camera2:1.3.0'
implementation 'androidx.camera:camera-lifecycle:1.3.0'
implementation 'androidx.camera:camera-video:1.3.0'

// UI & Charts
implementation 'com.google.android.material:material:1.10.0'
implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
implementation 'com.github.bumptech.glide:glide:4.16.0'
```

## Development Guidelines

### MVVM Architecture
- **Model**: Data classes and business logic
- **View**: Activities and Fragments (UI layer)
- **ViewModel**: Bridge between View and Model, handles UI logic

### Code Structure
- Use ViewBinding for type-safe view access
- Implement Repository pattern for data access
- Use Coroutines for asynchronous operations
- Follow Material Design guidelines for UI

### Firebase Integration
- Use Firebase Auth for user management
- Store user data in Firestore collections
- Upload media files to Firebase Storage
- Implement offline data caching where needed

## Current Implementation Status

### ✅ Completed
- [x] Project structure and MVVM architecture setup
- [x] Firebase integration and configuration
- [x] Authentication module foundation
- [x] Material Design theming and UI components
- [x] Basic navigation between modules
- [x] Data models and repository patterns

### 🔄 In Development
- [ ] Complete authentication implementation (Email & Phone OTP)
- [ ] Full athlete profile management
- [ ] Assessment tests with video recording
- [ ] Performance tracking with charts
- [ ] Social feed functionality
- [ ] Admin dashboard features

## Testing

### Emulator Configuration
- **Recommended**: Pixel 5 API 30+
- **Features Required**: Camera, Internet access
- **RAM**: Minimum 2GB allocated
- **Storage**: Minimum 4GB available

### Test Scenarios
1. User registration and login
2. Profile creation and image upload
3. Assessment test recording and submission
4. Performance data entry and visualization
5. Social feed interactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- **AI Integration**: Replace dummy scoring with TensorFlow Lite/MediaPipe
- **Advanced Analytics**: Enhanced performance insights
- **Coaching Tools**: Coach-athlete interaction features
- **Competition Management**: Tournament organization tools
- **Wearable Integration**: Smartwatch data synchronization

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

**AthleteX** - Empowering Athletes Through Technology 🏃‍♂️📱

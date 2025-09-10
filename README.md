# AthleteX - Athletic Performance Management App

## Overview

AthleteX is a comprehensive Android application designed to help athletes track their performance, participate in assessment tests, follow training programs, and connect with other athletes through a social platform. The app is built using Kotlin and follows the MVVM (Model-View-ViewModel) architecture pattern with Firebase integration.

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
   cd AthleteX
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

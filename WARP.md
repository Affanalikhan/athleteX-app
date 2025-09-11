# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AthleteX is a comprehensive Android application for athletic performance management built with Kotlin using the MVVM (Model-View-ViewModel) architecture pattern and Firebase integration. The app enables athletes to track performance, participate in assessment tests, follow training programs, and connect through a social platform.

## Common Development Commands

### Build Commands
```bash
# Build the project
gradle build

# Build debug APK
gradle assembleDebug

# Build release APK
gradle assembleRelease

# Clean build artifacts
gradle clean

# Build and install debug version to connected device
gradle installDebug
```

### Testing Commands
```bash
# Run unit tests
gradle test

# Run unit tests for debug build
gradle testDebugUnitTest

# Run instrumented tests (requires connected device/emulator)
gradle connectedAndroidTest

# Run all tests
gradle check
```

### Development Commands
```bash
# Generate lint report
gradle lint

# Run lint and stop on errors
gradle lintDebug

# Assemble and run tests
gradle build connectedCheck
```

### Firebase Setup Requirements
Before running the app, ensure:
1. Replace `app/google-services.json` with your Firebase configuration
2. Enable Authentication (Email/Password and Phone) in Firebase Console
3. Setup Firestore Database in production mode
4. Configure Firebase Storage with appropriate security rules

## Code Architecture

### MVVM Architecture Pattern
The project follows strict MVVM separation:

- **Model Layer**: Data classes in `com.athletex.model` (DataModels.kt)
  - Core entities: `Athlete`, `AssessmentTest`, `PerformanceMetric`, `TrainingProgram`, `SocialPost`
  - Enums: `TestType`, `MetricType`, `SportType`, `DifficultyLevel`, `MediaType`

- **View Layer**: Activities and Fragments in `com.athletex.ui`
  - Feature-based organization: `auth/`, `profile/`, `assessment/`, `performance/`, `training/`, `social/`, `admin/`
  - Uses ViewBinding and DataBinding for type-safe view access

- **ViewModel Layer**: `com.athletex.viewmodel`
  - Inherits from `BaseViewModel` which provides common loading/error states
  - Implements coroutine scope for asynchronous operations

### Repository Pattern
- **BaseRepository**: Abstract class providing Firebase service instances (`auth`, `firestore`, `storage`)
- Common utilities: `safeCall()` for exception handling, user authentication checks
- Feature repositories extend BaseRepository (e.g., `AuthRepository`)

### Key Architectural Components

#### Firebase Integration
- **Authentication**: FirebaseAuth for email/password and phone OTP
- **Database**: Firestore for all structured data storage
- **Storage**: Firebase Storage for media files (videos, images, profile pictures)

#### Core Features Architecture
1. **Assessment Module**: Video recording using CameraX API, test result scoring
2. **Performance Tracking**: MPAndroidChart integration for metrics visualization
3. **Social Platform**: Instagram-like feed with posts, likes, comments, following
4. **Training Programs**: JSON-based exercise library with sport-specific programs
5. **Admin Dashboard**: Filtering, ranking, and athlete management tools

#### Data Flow
- ViewModels communicate with Repositories using Kotlin Coroutines
- Repositories handle Firebase operations and return `Result<T>` objects
- UI observes ViewModel LiveData for state updates
- All async operations use `safeCall()` for consistent error handling

### Project Structure Mapping
```
app/src/main/java/com/athletex/
├── model/                 # Data models (Athlete, AssessmentTest, etc.)
├── viewmodel/            # MVVM ViewModels with coroutine support
├── repository/           # Data access layer with Firebase integration
├── ui/                   # Feature-organized Activities/Fragments
│   ├── auth/            # Login/Signup flows
│   ├── profile/         # Athlete profile management
│   ├── assessment/      # Performance tests with video recording
│   ├── performance/     # Metrics tracking and visualization
│   ├── training/        # Sport-specific programs
│   ├── social/          # Social feed platform
│   ├── admin/           # Administrative dashboard
│   └── adapter/         # RecyclerView adapters
└── utils/               # Extension functions and utilities
```

## Development Environment

### Requirements
- Android Studio Arctic Fox or later
- Android SDK API 24 (minimum) to API 34 (target)
- JDK 8 or later
- Gradle 8.0+

### Key Dependencies
- **Firebase BOM**: 32.6.0 (Auth, Firestore, Storage, Analytics)
- **MVVM**: AndroidX Lifecycle components 2.7.0
- **CameraX**: 1.3.0 for video recording functionality  
- **MPAndroidChart**: v3.1.0 for performance graphs
- **Glide**: 4.16.0 for image loading
- **Navigation Components**: 2.7.5 for app navigation
- **Material Design**: 1.10.0 for UI components

### Testing Configuration
- **Recommended Emulator**: Pixel 5 API 30+
- **Required Features**: Camera access, Internet connectivity
- **Minimum RAM**: 2GB allocated to emulator
- **Storage**: 4GB available space

## Firebase Configuration Notes

The app heavily relies on Firebase services:
- User authentication and session management through FirebaseAuth
- All user data, posts, test results stored in Firestore collections  
- Media uploads (videos, images) stored in Firebase Storage
- Admin features require proper Firestore security rules for data access control

## Development Workflow

When working on this codebase:
1. Follow MVVM pattern - keep business logic in ViewModels
2. Use Repository pattern for all Firebase operations
3. Implement proper error handling using `safeCall()` from BaseRepository
4. Use Kotlin Coroutines for asynchronous operations  
5. Leverage ViewBinding for all view interactions
6. Follow Material Design principles for UI consistency
7. Test camera functionality on physical devices when possible

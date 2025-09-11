# Firebase Setup Guide for AthleteX

## Step 1: Access Firebase Console

1. **Open your web browser** and go to: https://console.firebase.google.com
2. **Sign in** with your Google account (the same one you used to create the project)
3. **Select your project**: Look for "athletex-bf7b9" and click on it

## Step 2: Add Web App to Firebase Project

1. **In your Firebase project dashboard**, look for the "Get started by adding Firebase to your app" section
2. **Click the Web icon** `</>` (it looks like closing HTML tags)
3. **Register your app**:
   - App nickname: `AthleteX Web`
   - ✅ Check "Also set up Firebase Hosting for this app" (optional)
   - Click **"Register app"**

## Step 3: Copy Firebase Configuration

After registering, you'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "athletex-bf7b9.firebaseapp.com",
  projectId: "athletex-bf7b9",
  storageBucket: "athletex-bf7b9.appspot.com",
  messagingSenderId: "238160479702",
  appId: "1:238160479702:web:abc123..."
};
```

**Copy these values** - you'll need them in Step 4.

## Step 4: Update Environment Variables

1. **Open your project folder** in VS Code or your preferred editor
2. **Open the file**: `.env.local` (in the root of your AthleteX project)
3. **Replace the placeholder values** with your actual Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC... (your actual API key)
REACT_APP_FIREBASE_AUTH_DOMAIN=athletex-bf7b9.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=athletex-bf7b9
REACT_APP_FIREBASE_STORAGE_BUCKET=athletex-bf7b9.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=238160479702
REACT_APP_FIREBASE_APP_ID=1:238160479702:web:abc123... (your actual app ID)
```

4. **Save the file**

## Step 5: Enable Authentication Methods

### Enable Email/Password Authentication:
1. **In Firebase Console**, click **"Authentication"** in the left sidebar
2. **Go to "Sign-in method" tab**
3. **Find "Email/Password"** in the list
4. **Click on it** to open settings
5. **Enable the first option** (Email/Password)
6. **Click "Save"**

### Enable Phone Authentication:
1. **Still in "Sign-in method" tab**, find **"Phone"**
2. **Click on it** to open settings
3. **Toggle "Enable"**
4. **You'll need to add test phone numbers** for development:
   - Click "Add test phone number"
   - Add: `+1234567890` with verification code: `123456`
   - This allows testing without SMS costs
5. **Click "Save"**

## Step 6: Set up Firestore Database

1. **In Firebase Console**, click **"Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

## Step 7: Set up Firebase Storage

1. **In Firebase Console**, click **"Storage"** in the left sidebar
2. **Click "Get started"**
3. **Choose "Start in test mode"**
4. **Select the same location** as your Firestore
5. **Click "Done"**

## Step 8: Restart Your Development Server

1. **Stop your current dev server** (Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   npm start
   ```

## Step 9: Test Authentication

1. **Open your browser** to http://localhost:3000
2. **Try signing up** with a test email
3. **Check Firebase Console > Authentication > Users** to see if the user was created

## Troubleshooting

### If you see "Firebase: Error (auth/api-key-not-valid)"
- Double-check your API key in `.env.local`
- Make sure you copied it exactly from Firebase Console
- Restart your dev server after making changes

### If phone authentication doesn't work
- Make sure you added test phone numbers in Firebase Console
- Check that Phone authentication is enabled
- For production, you'll need to add your domain to authorized domains

### If you get CORS errors
- In Firebase Console, go to Authentication > Settings
- Add your domain (http://localhost:3000) to authorized domains

## Next Steps After Setup

Once authentication is working:
1. **Create user profiles** - Test the Profile page
2. **Add performance metrics** - Test the Performance page
3. **Upload assessment videos** - Test the Assessment page
4. **Set up Firestore security rules** for production

---

**Need Help?** 
- Check the browser console for error messages
- Look at the Firebase Console for any error logs
- Make sure all services (Auth, Firestore, Storage) are enabled
